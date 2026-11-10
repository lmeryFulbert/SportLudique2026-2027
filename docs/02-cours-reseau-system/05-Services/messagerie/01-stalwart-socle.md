# Stalwart — Socle : installer et comparer les échanges SMTP et IMAP

!!! abstract "Mission"
    Installez Stalwart, créez **deux utilisateurs en plus de l'administrateur**, puis échangez des messages en **SMTP Submission 587 avec STARTTLS** et **IMAP 143 sans TLS**. Analysez une capture Wireshark pour comparer les informations visibles sur le réseau selon que les échanges sont chiffrés ou non.

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

Vérifiez ensuite les ports en écoute. Sur une installation neuve, vous devriez retrouver les ports **25, 465, 993, 995, 4190, 443 et 8080**. Les ports **587 (SMTP Submission)** et **143 (IMAP)** ne sont pas nécessairement créés par défaut : vous les configurerez dans ce TP.

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

## 4. Configurer les listeners SMTP Submission et IMAP

Un **listener** accepte les connexions sur une adresse et un port, puis leur associe un protocole.

### 4.1 Comprendre le choix des ports et du chiffrement

Le port **25 (SMTP)** est principalement utilisé pour le transport du courrier entre serveurs. Il peut accepter des messages sans authentification destinés aux domaines locaux, mais **ce n'est pas le service de soumission à utiliser pour authentifier Thunderbird**. Désactiver la vérification *Must match sender* ne supprime pas l'obligation de s'authentifier et ne résout pas ce problème.

Pour l'envoi depuis un client de messagerie, utilisez **SMTP Submission sur le port 587**. La connexion commence en clair : le serveur annonce la possibilité d'utiliser `STARTTLS`, puis le client demande le passage à TLS. **L'authentification SMTP intervient après l'établissement de la connexion chiffrée**.

En revanche, pour l'IMAP sur le port **143**, nous désactivons volontairement TLS et autorisons temporairement l'authentification en clair afin d'observer les échanges dans Wireshark.

| Service | Port | Chiffrement | Authentification | Ce que montre Wireshark |
|---|---|---|---|---|
| SMTP Submission | **587** | **STARTTLS** (TLS explicite) | Identifiant et mot de passe après STARTTLS | `EHLO`, annonce et commande `STARTTLS`, puis échanges chiffrés |
| IMAP | **143** | **Aucun** | Mot de passe normal en clair | Identifiants, commandes et contenu des messages consultés |

!!! info "Pourquoi ne voit-on pas le contenu SMTP en clair ?"
    **STARTTLS ne chiffre pas le début de la connexion SMTP.** Il protège les échanges **après** la négociation TLS : l'authentification, les commandes d'envoi et le contenu du message ne sont alors plus lisibles directement dans la capture.

    Le TP Socle ne permet donc **pas** d'observer les identifiants SMTP ou le corps des messages SMTP en clair. C'est volontaire : la comparaison avec IMAP 143 illustre précisément l'intérêt de TLS. L'objectif n'est pas de contourner cette protection.

### 4.2 Créer les listeners 587 et 143

Dans **Settings › Network › Listeners**, choisissez **Create** pour chaque listener. Si un listener existe déjà sur le port concerné, modifiez-le plutôt que de créer un doublon.

| Champ | Soumission SMTP | Consultation IMAP |
|---|---|---|
| Listener Id (`name`) | **`submission`** | **`imap`** |
| Protocol (`protocol`) | SMTP (`smtp`) | IMAP (`imap`) |
| Bind addresses (`bind`) | `ipv4-service:587` | `ipv4-service:143` |
| Enable TLS (`useTls`) | **activé** | **désactivé** |
| Implicit TLS (`implicitTls`) | **désactivé** | **désactivé** |

Sur le port 587, **Enable TLS** permet la négociation `STARTTLS` ; **Implicit TLS** reste désactivé, car TLS n'est pas établi dès l'ouverture de la connexion. Vérifiez également dans les paramètres SMTP que `STARTTLS` est annoncé et que l'authentification SMTP est disponible après négociation TLS.

Les interfaces de la VM peuvent écouter sur ces ports ; limitez les connexions aux postes du laboratoire avec le pare-feu. Ne modifiez pas le listener **`https`**. Enregistrez avec **Save**, puis redémarrez le service.

```bash
sudo systemctl restart stalwart
sudo ss -lntp
```

!!! danger "Attention : session d'administration"
    Après le redémarrage du service, votre session HTTPS peut ne plus être valide. Reconnectez-vous à l'interface d'administration avant de poursuivre les modifications.

Source : [documentation officielle — listeners](https://stalw.art/docs/server/listener/){:target="_blank"}.

### 4.3 Configurer l'authentification

#### IMAP : autoriser temporairement l'authentification en clair

Ouvrez **Settings › Network › IMAP › Authentication settings**.

Activez **Allow plain text authentication** (`allowPlainTextAuth = true`) afin d'autoriser l'authentification IMAP par mot de passe sur une connexion non chiffrée. Enregistrez avec **Save**.

#### SMTP : conserver l'authentification sur le port 587

Sur SMTP Submission, les utilisateurs **Alice et Bob doivent s'authentifier** avec leur adresse électronique complète et leur mot de passe. La négociation `STARTTLS` doit précéder l'envoi des identifiants.

Dans **Settings › SMTP › AUTH Stage**, conservez **Must match sender** activé (`true`) : l'expéditeur doit correspondre au compte authentifié. **Ne désactivez pas ce contrôle pour essayer d'autoriser l'envoi anonyme** : ce paramètre ne sert pas à cela.

Vérifiez que les mécanismes d'authentification proposés par Stalwart sont compatibles avec Thunderbird après STARTTLS.

!!! warning "Application des réglages"
    Après avoir enregistré les modifications, redémarrez Stalwart et vérifiez les ports en écoute :

    ```bash
    sudo systemctl restart stalwart
    sudo ss -lntp
    ```

!!! danger "Configuration réservée au laboratoire"
    **Seul IMAP 143 reste volontairement non chiffré.** Les identifiants et les messages consultés peuvent être interceptés. Utilisez des comptes et secrets fictifs, limitez les accès aux réseaux du laboratoire et ne désactivez pas les restrictions de relais SMTP.

Sources : [documentation Stalwart — SMTP AUTH](https://stalw.art/docs/ref/object/mta-stage-auth/#saslmechanisms){:target="_blank"} et [variables SMTP](https://stalw.art/docs/ref/expression/variable/mta-ehlo-variable/){:target="_blank"}.

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
| Sécurité de connexion | **Aucune** | **STARTTLS** |
| Méthode d'authentification | **Mot de passe normal** | **Mot de passe normal** |
| Nom d'utilisateur | adresse électronique complète | adresse électronique complète |

4. Relancez le test de configuration, puis terminez. Si Thunderbird avertit que la connexion IMAP n’est pas chiffrée, confirmez uniquement pour ce compte fictif du laboratoire. Pour SMTP, vérifiez que STARTTLS est bien sélectionné. Le certificat autosigné peut provoquer un avertissement de confiance : vérifiez le nom du serveur et le certificat avant d’accepter une exception limitée au laboratoire.
5. Dans **Paramètres des comptes › Paramètres serveur**, contrôlez l'IMAP. Dans **Serveur sortant (SMTP) › Modifier**, contrôlez SMTP, puis vérifiez que chaque identité utilise **son propre identifiant SMTP**.
6. Envoyez d'Alice à Bob un message intitulé **`TP Stalwart — SMTP STARTTLS et IMAP en clair`**, contenant seulement un court texte fictif. Relevez-le chez Bob et répondez. Examinez aussi **Indésirables/Junk** si nécessaire.

« Mot de passe normal » décrit une méthode d’authentification, **pas le chiffrement de la connexion**. Sur SMTP 587, les identifiants sont protégés par STARTTLS ; sur IMAP 143, ils peuvent être observés dans la capture.

## 6. Capturer et comparer les échanges avec Wireshark

1. Sur le poste client, lancez Wireshark et sélectionnez **l'interface qui transporte réellement le trafic vers Stalwart**. Sur un réseau commuté, un autre poste ne voit pas nécessairement ces échanges.
2. Démarrez la capture **avant** l'ouverture des connexions. Fermez puis relancez Thunderbird si nécessaire pour provoquer de nouvelles connexions.
3. Envoyez un message d'Alice à Bob, puis consultez-le chez Bob. Arrêtez la capture et enregistrez-la sous `stalwart-socle.pcapng`.
4. Utilisez les filtres d'affichage suivants :

| Recherche | Filtre Wireshark |
|---|---|
| Courrier du TP | `tcp.port == 587 || tcp.port == 143` |
| Début des connexions TCP | `tcp.flags.syn == 1 && (tcp.port == 587 || tcp.port == 143)` |
| SMTP Submission | `tcp.port == 587` |
| IMAP | `tcp.port == 143` |
| Un dialogue précis | `tcp.stream eq N` — remplacez `N` par le numéro observé |

Si le port 587 n'est pas reconnu comme SMTP, utilisez **Analyser › Décoder comme… › SMTP**. Sélectionnez un paquet puis **Suivre › Flux TCP**.

### 6.1 SMTP 587 : observer le passage au chiffrement

Dans le flux SMTP, identifiez les échanges initiaux, notamment `EHLO`, la capacité `STARTTLS` annoncée par le serveur, la commande `STARTTLS` du client et la réponse du serveur. Repérez ensuite la négociation TLS.

**Après le passage à TLS, vous ne devez pas pouvoir lire directement** l'authentification (`AUTH`), les commandes `MAIL FROM`, `RCPT TO`, `DATA`, ni le sujet ou le corps du message. Ces données circulent dans le tunnel chiffré. Une capture réseau classique ne permet pas de les afficher en clair.

!!! question "À expliquer"
    Pourquoi Wireshark permet-il de lire le début de la conversation SMTP, mais pas les commandes et le message envoyés après STARTTLS ?

### 6.2 IMAP 143 : observer les échanges non chiffrés

Dans le flux IMAP, recherchez `CAPABILITY`, `LOGIN` ou `AUTHENTICATE`, puis les commandes de consultation (`SELECT`, `FETCH`…). Identifiez l'adresse du compte, son mot de passe fictif et les données du message consulté.

Avec `LOGIN` IMAP, l'identifiant et le mot de passe peuvent être directement lisibles. Avec `AUTHENTICATE PLAIN`, ils sont généralement encodés en Base64 : **Base64 est un encodage réversible, pas un chiffrement**. Le contenu des messages peut aussi être encodé en MIME, sans être pour autant confidentiel.

!!! question "À comparer"
    Pour chacun des deux protocoles, précisez ce qu'un observateur du réseau peut lire : identifiant, mot de passe, commandes et contenu du message. Expliquez pourquoi les résultats diffèrent.

!!! success "Point de validation 2"
    Présentez une capture montrant **STARTTLS sur SMTP 587** et une autre montrant **l'authentification IMAP en clair sur 143**. Justifiez l'impossibilité de lire le contenu SMTP après négociation TLS.

Poursuivez avec le [TP Avancé — TLS et PKI intermédiaire](02-stalwart-avance.md) pour sécuriser IMAP et utiliser un certificat signé par votre PKI. SPF, DKIM et DMARC relèvent du chapitre transversal **« Cybersécurité pour tous »**.
