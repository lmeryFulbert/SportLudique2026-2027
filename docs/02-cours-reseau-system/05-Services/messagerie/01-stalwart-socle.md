# Stalwart — Socle : installer et observer les échanges en clair

!!! abstract "Mission"
    Installez Stalwart, créez **deux utilisateurs en plus de l'administrateur**, puis échangez des messages en SMTP 587 et IMAP 143 sans TLS. Analysez une capture Wireshark pour expliquer ce que peut lire un observateur du réseau.

**Prérequis :**  Adressage et DMZ du groupe, résolution DNS opérationnelle, Comprendre le protocole TLS et nottament le rôle d'une CA.

!!! warning "Périmètre du laboratoire"
    Utilisez uniquement des identités et des mots de passe **fictifs, jamais réutilisés**. Limitez les ports de démonstration aux postes du groupe. Conservez l'administration en **HTTPS sur 443** ; les exceptions ci-dessous concernent les protocoles de courrier.

## 1. Préparer le serveur DNS

Dans **votre zone DNS**, publiez le nom `mail` et un MX. Adaptez ce gabarit avant de l'enregistrer :

```dns
; Gabarit : remplacez l'adresse et la ville par vos valeurs réelles.
@       IN MX 10 mail.ville.sportludique.fr.

mail    IN A     ADRESSE_JOIGNABLE_DU_SERVEUR

```

Utilisez l'adresse IP adaptée à votre architecture réseau : l'adresse publique du serveur de messagerie pour les clients externes et, si nécessaire, son adresse privée pour les clients du LAN.

L'enregistrement **MX** doit pointer vers un **nom DNS disposant d'un enregistrement A**, et non directement vers une adresse IP ou un alias CNAME.

Incrémentez le numéro de série de la zone DNS, rechargez la configuration et vérifiez la résolution des enregistrements A et MX avec `dig`.

=== "dig"

    ```bash
    dig mail.ville.sportludique.fr A +short
    dig ville.sportludique.fr MX +short
    ```

=== "nslookup"

    ```bash
    nslookup
    > set type=A
    > mail.ville.sportludique.fr
    > set type=MX
    > ville.sportludique.fr
    > exit
    ```

!!! warning "nslookup"
    `nslookup` dispose d'un **mode interactif** permettant de préciser le type d'enregistrement DNS recherché.

    Par défaut, il recherche les adresses IP associées à un nom de domaine (enregistrements **A** et **AAAA**, selon la configuration).

    Pour rechercher un autre type d'enregistrement, utilisez la commande `set type=MX`, `set type=NS`, etc.

## 2. Installer Stalwart

### 2.1 Installer avec le script officiel

L'administration de Stalwart doit être accessible **uniquement depuis le VLAN de management**. Adaptez les règles de filtrage de votre pare-feu en conséquence.

Suivez la [documentation officielle de Stalwart](https://stalw.art/docs/install/platform/linux/){:target="_blank"} pour installer le serveur sur Debian.

Contrairement aux installations précédentes réalisées avec `apt`, Stalwart utilise un **script d'installation** qui configure notamment son service `systemd`. Sa mise à jour ne s'effectue donc pas avec `apt upgrade`.

Une fois l'installation terminée, vérifiez le fonctionnement du service et identifiez le compte système utilisé ainsi que les ports en écoute.

```bash
sudo systemctl status stalwart
sudo systemctl show stalwart --property=User,Group,ExecStart
sudo ss -lntp
```

À ce stade, Stalwart est en phase d'initialisation (*bootstrap*) et son interface de configuration est accessible sur le port **TCP 8080**. Cette interface ne doit pas être exposée aux autres réseaux.

En cas de problème, consultez les journaux du service :

```bash
sudo journalctl -u stalwart -n 80 --no-pager
```

### 2.2 Initialiser localement avant le premier accès Web

!!! info "Pourquoi cette étape en ligne de commande ?"
    Lors de l'installation, Stalwart utilise le port 8080 en HTTP pour son initialisation (bootstrap). 

**Si le serveur est déjà initialisé** (`/etc/stalwart/config.json` existe et l'administration fonctionne), sautez cette étape. Ne réinitialisez pas son stockage.

La documentation indique comment personnaliser le mot de passe administrateur ou comment retrouvé celui generé par défaut à partir des journaux.

Ce mot de passe change à chaque redémarrage en bootstrap. Ne le confondez pas avec celui du compte permanent qui sera créé.

Remplissez les champs de la configuration initiale avecl'assistant :
- nom du serveur,
- domaine,
- stockage local SQlite,
- annuaire interne
- DNS manuel.

Les demandes de certificat public sont désactivées dans le faux Internet SportLudique.

Ces deux valeurs sont l'identifiant **`admin@ville.sportludique.fr`** et son mot de passe permanent.
Consignez-les dans votre gestionnaire de mots de passe ;

redemarrer le service avec systemd

```bash
sudo systemctl restart stalwart
sudo ss -lntp
```

Le redémarrage est **obligatoire** pour quitter le bootstrap. La base contient l'essentiel des réglages ; `config.json` décrit le stockage.


### 2.3 Ouvrir l'administration en HTTPS

Accédez à l'interface d'administration de Stalwart :

**`https://mail.ville.sportludique.fr/`** (remplacez `ville` par votre site).

Utilisez le **nom DNS du serveur**, conformément au certificat autosigné généré lors de l'initialisation (*bootstrap*), dont le champ SAN contient ce nom.

Votre navigateur affiche un avertissement de sécurité, car le certificat autosigné n'est pas reconnu par une autorité de certification de confiance.

Dans le cadre de ce laboratoire, **acceptez l'exception de sécurité**, puis connectez-vous avec votre compte administrateur. La connexion est chiffrée, mais l'identité du serveur n'est pas vérifiée par une chaîne de confiance reconnue. Ce problème sera résolu dans le TP Avancé avec un certificat délivré par votre PKI.

Vérifiez ensuite les ports en écoute. Sur une installation neuve, vous devriez retrouver les ports **25, 465, 993, 995, 4190, 443 et 8080**. Les ports **587 (SMTP Submission)** et **143 (IMAP)** seront configurés dans le TP Avancé.

!!! warning "Port 8080"
    Le port 8080 reste actif en HTTP après l'initialisation. **Son accès doit être interdit depuis le réseau des services**.

!!! success "Point de validation 1"
    Présentez le service Stalwart actif, sa version, les ports en écoute et l'accès à l'administration en **HTTPS**. Expliquez l'origine de l'avertissement affiché par le navigateur.

## 3. Vérifier le domaine et créer Alice et Bob

Les menus ci-dessous sont ceux de l'interface en anglais. Utilisez les noms techniques entre parenthèses si l'interface est traduite.

1. Ouvrez **Management › Domains › Domains**. Vérifiez le domaine `ville.sportludique.fr` créé au bootstrap et **Enabled** activé. Si le domaine manque sur un serveur déjà préparé, utilisez **Create**, renseignez **Domain Name**, activez **Enabled** et enregistrez. Laissez **Allow Relaying** désactivé.
2. Ouvrez **Management › Directory › Accounts**, puis **Create**.
3. Renseignez les valeurs suivantes ; le nom d'utilisateur est la partie locale, le domaine est sélectionné séparément.

| Champ | Alice | Bob |
|---|---|---|
| Username (`name`) | `alice` | `bob` |
| Domain (`domainId`) | domaine du groupe | domaine du groupe |
| Full Name (`description`) | `Alice — groupe` | `Bob — groupe` |
| Credentials | ajoutez un **Password** | ajoutez un autre **Password** |
| Roles | **User role** | **User role** |
| Permissions | héritées | héritées |
| Adresse résultante | `alice@ville.sportludique.fr` | `bob@ville.sportludique.fr` |

Choisissez deux secrets fictifs distincts assez longs pour satisfaire la politique de mots de passe. Enregistrez chaque compte avec **Save**. Relisez les fiches créées : adresses complètes, bon domaine et absence du rôle administrateur. Les comptes sont disponibles **sans redémarrage**.

Source : [gestion officielle des comptes](https://stalw.art/docs/auth/accounts/manage/){:target="_blank"} .

## 4. Ajouter les listeners sans TLS

Un **listener** accepte les connexions sur une adresse et un port, puis leur associe un protocole.

### 4.1 Créer SMTP 587 et IMAP 143

Dans **Settings › Network › Listeners**, choisissez **Create** pour chaque listener. Si le port existe déjà, modifiez son listener au lieu d'en créer un second.

| Champ | Soumission SMTP | Consultation IMAP |
|---|---|---|
| Listener Id (`name`) | **`submission`** | **`imap`** |
| Protocol (`protocol`) | SMTP (`smtp`) | IMAP (`imap`) |
| Bind addresses (`bind`) | `ipv4-service:587` | `ipv4-service:143` |
| Enable TLS (`useTls`) | **désactivé** | **désactivé** |
| Implicit TLS (`implicitTls`) | **désactivé** | **désactivé** |

Cette écoute IPv4 concerne les interfaces de la VM ; le pare-feu doit limiter les sources aux postes du laboratoire. Ne modifiez pas le listener **`https`**. Enregistrez avec **Save**. et redemarrer le service. 

!!! danger "Attention : session d'administration"
    Après le redémarrage du service, votre session HTTPS peut ne plus être valide. Reconnectez-vous à l'interface d'administration avant de poursuivre les modifications.

Source : [listeners et redémarrage](https://stalw.art/docs/server/listener/){:target="_blank"} .

### 4.2 Autoriser temporairement l'authentification IMAP en clair et SMTP sans authentification

#### IMAP

Ouvrez **Settings › Network › IMAP › Authentication settings**.

Activez **Allow plain text authentication** (`allowPlainTextAuth = true`) pour autoriser l'authentification IMAP par mot de passe sans chiffrement.

Enregistrez avec **Save**.

#### SMTP

Ouvrez **Settings › SMTP › AUTH Stage**.

Dans **Must match sender**, remplacez `true` par `false`.

Par défaut, Stalwart vérifie que l'adresse de l'expéditeur correspond à celle de l'utilisateur authentifié. Cette vérification doit être désactivée pour permettre l'envoi de messages sans authentification SMTP dans notre laboratoire.

Enregistrez avec **Save**.

!!! warning "Redémarrage obligatoire"
    Le bouton **Save** enregistre les modifications, mais ne redémarre pas Stalwart.

    **Après chaque modification de configuration**, redémarrez le service pour appliquer les nouveaux paramètres :

    ```bash
    sudo systemctl restart stalwart
    ```

!!! danger "Configuration réservée au laboratoire"
    Ces réglages permettent de transmettre des identifiants IMAP en clair et d'envoyer des messages SMTP sans authentification ni vérification de l'adresse de l'expéditeur.

    Ils sont destinés uniquement à l'analyse des protocoles avec Wireshark. Limitez les accès aux réseaux du laboratoire et conservez les restrictions de relais SMTP.

Sources : [Documentation Stalwart — SMTP AUTH](https://stalw.art/docs/ref/object/mta-stage-auth/#saslmechanisms){:target="_blank"} et [variables des expressions SMTP](https://stalw.art/docs/ref/expression/variable/mta-ehlo-variable/){:target="_blank"}.

Sources : [MtaStageAuth.saslMechanisms](https://stalw.art/docs/ref/object/mta-stage-auth/#saslmechanisms), [variables listener, local_port et is_tls](https://stalw.art/docs/ref/expression/variable/mta-ehlo-variable/).


### Configuration de Thunderbird

Configurez votre compte de messagerie dans Thunderbird avec les paramètres suivants :

| Paramètre | Valeur |
|---|---|
| Serveur entrant | `mail.ville.sportludique.fr` |
| Protocole | IMAP |
| Port | `143` |
| Sécurité de connexion | Aucune |
| Méthode d'authentification | Mot de passe normal |
| Serveur sortant | `mail.ville.sportludique.fr` |
| Protocole | SMTP |
| Port | `25` |
| Sécurité de connexion | Aucune |
| Méthode d'authentification | Aucune |

Remplacez `ville` par le nom de votre site.

!!! danger "Authentification en clair"
    Cette configuration est volontairement non sécurisée afin d'observer les échanges avec Wireshark. Sur IMAP, **l'identifiant et le mot de passe circulent en clair**. Le serveur SMTP accepte ici l'envoi sans authentification.

    Cette configuration est réservée au laboratoire et ne doit jamais être exposée à Internet.

## 5. Configurer Thunderbird et échanger des messages

Créez les deux comptes sur deux postes ou dans des profils clairement identifiés. Relevez la version dans **Aide › À propos de Thunderbird**.

1. Ouvrez **Paramètres des comptes › Gestion des comptes › Ajouter un compte de messagerie** ; selon la version, utilisez l'écran d'ajout de compte affiché au démarrage.
2. Saisissez le nom, l'adresse complète et le secret fictif, puis ouvrez **Configuration manuelle**.
3. Utilisez les paramètres suivants pour Alice, puis pour Bob :

| Paramètre | Entrant | Sortant |
|---|---|---|
| Protocole | IMAP | SMTP |
| Serveur | `mail.ville.sportludique.fr` | même nom |
| Port | **143** | **587** |
| Sécurité de connexion | **Aucune** | **Aucune** |
| Méthode d'authentification | **Mot de passe normal** | **Mot de passe normal** |
| Nom d'utilisateur | adresse électronique complète | adresse électronique complète |

4. Relancez le test de configuration, puis terminez. Si Thunderbird affiche un avertissement de connexion non chiffrée avec une confirmation, confirmez uniquement pour ce compte fictif du laboratoire.
5. Dans **Paramètres des comptes › Paramètres serveur**, contrôlez l'IMAP. Dans **Serveur sortant (SMTP) › Modifier**, contrôlez SMTP, puis vérifiez que chaque identité utilise **son propre identifiant SMTP**.
6. Envoyez d'Alice à Bob un message intitulé **`TP Stalwart sans TLS`**, contenant seulement un court texte fictif. Relevez-le chez Bob et répondez. Examinez aussi **Indésirables/Junk** si nécessaire.

« Mot de passe normal » est une méthode d'authentification, pas une garantie de chiffrement. SMTP utilise ici PLAIN ou LOGIN ; IMAP peut utiliser PLAIN ou sa commande LOGIN.

## 6. Capturer et expliquer les échanges avec Wireshark

1. Sur le poste client, lancez Wireshark et sélectionnez **l'interface qui transporte réellement le trafic vers Stalwart**. Une capture sur un autre poste d'un réseau commuté ne voit pas nécessairement ces échanges.
2. Démarrez la capture **avant** l'ouverture des connexions. Fermez puis relancez Thunderbird ou utilisez le client Python pour provoquer une nouvelle authentification.
3. Envoyez et lisez le message fictif. Arrêtez la capture et enregistrez-la sous `stalwart-socle.pcapng`.
4. Utilisez ces filtres d'affichage :

| Recherche | Filtre Wireshark |
|---|---|
| Courrier du TP | `tcp.port == 587 || tcp.port == 143` |
| Début des connexions TCP | `tcp.flags.syn == 1 && (tcp.port == 587 || tcp.port == 143)` |
| SMTP | `tcp.port == 587` |
| IMAP | `tcp.port == 143` |
| Un dialogue précis | `tcp.stream eq N` — remplacez `N` par le numéro observé |

Si 587 n'est pas reconnu comme SMTP, utilisez **Analyser › Décoder comme… › SMTP**. Sélectionnez un paquet puis **Suivre › Flux TCP**.

Dans SMTP, retrouvez `EHLO`, `AUTH`, `MAIL FROM`, `RCPT TO`, `DATA`, le sujet et le corps du message. Dans IMAP, retrouvez `CAPABILITY`, `LOGIN` ou `AUTHENTICATE`, puis les commandes de sélection et de lecture (`SELECT`, `FETCH`…).

Avec **AUTH PLAIN**, la chaîne Base64 contient généralement `\0identifiant\0mot_de_passe`. Avec **AUTH LOGIN** SMTP, les réponses du client encodent séparément l'identifiant et le secret. Avec **LOGIN IMAP**, ils peuvent être directement lisibles dans la commande. 

**Base64 est un encodage réversible, pas un chiffrement.** Selon le client et MIME, le corps du message peut également être encodé ; cela ne le rend pas confidentiel.

Poursuivez avec le [TP Avancé — TLS et PKI intermédiaire](02-stalwart-avance.md). SPF, DKIM et DMARC relèvent du chapitre transversal **« Cybersécurité pour tous »**.
