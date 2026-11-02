# Stalwart — Avancé : STARTTLS, TLS implicite et PKI intermédiaire

!!! abstract "Mission"
    Sécurisez les échanges de messagerie, comparez **STARTTLS** et **TLS implicite** avec Thunderbird et Wireshark, puis remplacez le certificat autosigné par un certificat signé par **la CA intermédiaire de votre groupe**.

**Prérequis :** TP Socle réalisé, deux comptes de messagerie, capture Wireshark du Socle et CA intermédiaire signée par la racine SportLudique. Consultez le [cours TLS](../pki/01-tls-presentation.md) et le [TP PKI](../pki/02-tls-creation-ca.md). **Vous ne créez pas de nouvelle CA dans ce TP.**

## 1. Comprendre les deux modes TLS

| | STARTTLS | TLS implicite |
|---|---|---|
| Principe | La connexion commence en clair, puis passe sous TLS | TLS est négocié dès le début de la connexion |
| SMTP | **587** | **465** |
| IMAP | **143** | **993** |
| Dans Wireshark | Commande `STARTTLS` visible avant le chiffrement | Négociation TLS dès le début, sans commande `STARTTLS` |
| Dans Thunderbird | **STARTTLS** | **SSL/TLS** |

Dans les deux cas, **l'authentification et les messages doivent être protégés par TLS**. Les adresses IP et les ports restent visibles dans une capture réseau.

## 2. Configurer STARTTLS

Dans **Settings › Network › Listeners**, vérifiez ou adaptez les deux listeners :

| Listener | Port | Enable TLS | Implicit TLS |
|---|---:|---|---|
| `submission` (SMTP) | **587** | Activé | Désactivé |
| `imap` (IMAP) | **143** | Activé | Désactivé |

Enregistrez avec **Save**, puis redémarrez Stalwart :

```bash
sudo systemctl restart stalwart
```

!!! warning "Appliquer les modifications"
    Le bouton **Save** enregistre les paramètres, mais ne redémarre pas le service. **Redémarrez Stalwart après chaque modification de configuration dans ce TP**, puis reconnectez Thunderbird.

### Tester avec Thunderbird

Dans les paramètres des comptes, utilisez le nom `mail.ville.sportludique.fr` (adaptez `ville`) et votre adresse électronique complète comme identifiant.

| Paramètre | Serveur entrant | Serveur sortant |
|---|---|---|
| Protocole | IMAP | SMTP |
| Port | **143** | **587** |
| Sécurité | **STARTTLS** | **STARTTLS** |
| Authentification | Mot de passe normal | Mot de passe normal |

Envoyez un message entre deux comptes, puis relevez-le dans Thunderbird.

!!! info "Certificat autosigné"
    Tant que Stalwart utilise le certificat autosigné du Socle, Thunderbird peut afficher un avertissement ou refuser la connexion. Si le test ne peut pas aboutir, **installez d'abord le certificat de l'étape 4**, puis recommencez. Ne désactivez pas TLS pour contourner le problème.

### Observer avec Wireshark

Démarrez la capture **avant** de reconnecter Thunderbird. Utilisez le filtre :

```text
tcp.port == 587 || tcp.port == 143
```

Repérez la commande **STARTTLS**, puis le début de la négociation TLS. Comparez avec la capture du Socle : pouvez-vous encore lire les identifiants et le contenu du message ?

## 3. Tester TLS implicite

Dans **Settings › Network › Listeners**, vérifiez les listeners normalement présents après l'installation :

| Listener | Port | Enable TLS | Implicit TLS |
|---|---:|---|---|
| `submissions` (SMTP) | **465** | Activé | Activé |
| `imaps` (IMAP) | **993** | Activé | Activé |

S'ils sont absents, créez-les en vous appuyant sur la configuration des listeners existants. Enregistrez et redémarrez Stalwart si vous avez modifié la configuration.

Dans Thunderbird, conservez le même nom DNS, les mêmes comptes et **Mot de passe normal** :

| Paramètre | Serveur entrant | Serveur sortant |
|---|---|---|
| Protocole | IMAP | SMTP |
| Port | **993** | **465** |
| Sécurité | **SSL/TLS** | **SSL/TLS** |
| Authentification | Mot de passe normal | Mot de passe normal |

Envoyez et recevez un message. Capturez une **nouvelle connexion** avec Wireshark :

```text
tcp.port == 465 || tcp.port == 993
```

Cette fois, **TLS commence dès l'établissement de la connexion applicative** : aucune commande `STARTTLS` ne doit apparaître.

!!! question "Comparer les deux modes"
    Quelle différence voyez-vous dans Wireshark entre STARTTLS et TLS implicite ? Les messages sont-ils chiffrés dans les deux cas ?

## 4. Remplacer le certificat autosigné

### 4.1 Obtenir un certificat signé par la CA intermédiaire

Réutilisez la procédure du [module PKI](../pki/02-tls-creation-ca.md) :

1. Sur le serveur mail, créez une **clé privée** et une **demande de signature (CSR)** pour `mail.ville.sportludique.fr`.
2. Vérifiez que ce nom figure dans le **SAN** de la demande.
3. Faites signer la CSR par **la CA intermédiaire de votre groupe**, déjà signée par la racine SportLudique.
4. Récupérez le certificat du serveur et le certificat public de la CA intermédiaire.

**La clé privée du serveur ne quitte jamais le serveur mail. La clé privée de la CA ne doit jamais être copiée sur Stalwart.**

Préparez un fichier PEM contenant les certificats **dans cet ordre** :

| Ordre | Certificat | Rôle |
|---|---|---|
| 1 | Certificat de `mail.ville.sportludique.fr` | Identifie le serveur |
| 2 | Certificat de la CA intermédiaire | Permet de construire la chaîne de confiance |

Le certificat de la **CA racine** sera installé comme autorité de confiance sur le poste client ; il n'est pas nécessaire de l'ajouter au fichier présenté par le serveur.

### 4.2 Installer le certificat dans Stalwart

Dans **Settings › TLS › Certificates › Create** :

| Champ | Valeur |
|---|---|
| **Certificate** | **Text value** : contenu PEM du certificat serveur suivi de celui de la CA intermédiaire |
| **Private Key** | **Secret value** : clé privée du serveur mail |

Enregistrez avec **Save**. Dans **Settings › Network › General**, sélectionnez ce certificat dans **Default Certificate**, puis enregistrez et redémarrez Stalwart :

```bash
sudo systemctl restart stalwart
```

### 4.3 Faire reconnaître la CA par Thunderbird

Téléchargez le [certificat public de la racine SportLudique](../../../medias/certificats/sportludique-root.crt.pem), puis **vérifiez son empreinte** avec celle fournie dans le module PKI.

Dans Thunderbird : **Paramètres › Vie privée et sécurité › Certificats › Gérer les certificats › Autorités › Importer**. Importez la **CA racine** et autorisez-la à identifier les serveurs TLS. Supprimez les éventuelles exceptions liées à l'ancien certificat autosigné, puis relancez Thunderbird.

| Élément | Résultat attendu |
|---|---|
| Nom du serveur | `mail.ville.sportludique.fr` présent dans le SAN |
| Certificat serveur | Signé par la CA intermédiaire du groupe |
| Chaîne de confiance | Serveur → CA intermédiaire → racine SportLudique |
| Thunderbird | Connexion sans avertissement ni exception de certificat |

Refaites les tests d'envoi et de réception en **STARTTLS**, puis en **TLS implicite**.

## 5. Interdire l'authentification sans TLS

Le Socle autorisait volontairement l'authentification IMAP en clair. Il faut maintenant supprimer cette possibilité.

| Emplacement dans Stalwart | Réglage attendu |
|---|---|
| **Settings › Network › IMAP › Authentication settings** | **Allow plain text authentication** : désactivé (`false`) |
| **Settings › SMTP › AUTH Stage › Allowed Mechanisms** | Autoriser les mécanismes d'authentification uniquement lorsque `is_tls` est vrai |
| **Settings › SMTP › AUTH Stage › Require Authentication** | `local_port != 25` |
| **Settings › SMTP › AUTH Stage › Must match sender** | `true` |

Pour **Allowed Mechanisms**, reprenez la règle du Socle et conservez uniquement :

| Condition | Mécanismes autorisés |
|---|---|
| `local_port != 25 && is_tls` | `plain`, `login`, `oauthbearer`, `xoauth2` |
| Valeur par défaut | `false` |

Enregistrez, puis **redémarrez Stalwart**. Testez à nouveau l'envoi et la réception avec Thunderbird, en STARTTLS puis en TLS implicite.

!!! danger "Ne pas ouvrir le relais SMTP"
    Conservez la restriction **Allow Relaying** du Socle. Ne la remplacez surtout pas par `true` : un client non authentifié ne doit pas pouvoir utiliser votre serveur comme relais vers des domaines externes.

## 6. Validation de l'Avancé

- [ ] Les listeners **587/143** fonctionnent en STARTTLS.
- [ ] Les listeners **465/993** fonctionnent en TLS implicite.
- [ ] Deux captures Wireshark montrent clairement la différence entre les deux modes.
- [ ] Le certificat serveur est signé par la CA intermédiaire du groupe et contient le bon SAN.
- [ ] La racine SportLudique est reconnue par Thunderbird, sans exception de certificat.
- [ ] Les messages sont envoyés et reçus en TLS ; l'authentification en clair n'est plus autorisée côté serveur.

## Dépannage — uniquement en cas de problème

Commencez par vérifier le service et les ports :

```bash
sudo systemctl status stalwart --no-pager
sudo ss -lntp | grep -E ':143|:587|:465|:993'
```

Pour diagnostiquer une négociation TLS, remplacez `ville` par votre site :

| Protocole | Commande |
|---|---|
| SMTP STARTTLS | `openssl s_client -starttls smtp -connect mail.ville.sportludique.fr:587 -servername mail.ville.sportludique.fr` |
| IMAP STARTTLS | `openssl s_client -starttls imap -connect mail.ville.sportludique.fr:143 -servername mail.ville.sportludique.fr` |
| SMTP implicite | `openssl s_client -connect mail.ville.sportludique.fr:465 -servername mail.ville.sportludique.fr` |
| IMAP implicite | `openssl s_client -connect mail.ville.sportludique.fr:993 -servername mail.ville.sportludique.fr` |

Ces commandes permettent de voir le certificat présenté et les éventuelles erreurs TLS. Elles ne remplacent pas les tests Thunderbird. Pour les erreurs du service :

```bash
sudo journalctl -u stalwart -n 80 --no-pager
```

**Documentation :** [listeners Stalwart](https://stalw.art/docs/server/listener/){:target="_blank"}, [certificats TLS](https://stalw.art/docs/server/tls/certificates/){:target="_blank"}, [authentification](https://stalw.art/docs/auth/authentication/){:target="_blank"}.

Poursuivez avec le module [**SPF, DKIM et DMARC**](03-spf-dkim-dmarc.md)  consacré à la protection contre l'usurpation des adresses électroniques.