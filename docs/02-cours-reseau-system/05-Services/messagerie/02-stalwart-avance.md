# TP Stalwart — Avancé : sécuriser les connexions ou intégrer Active Directory

## Objectifs

À partir du serveur Stalwart fonctionnel réalisé au niveau socle **sans TLS**, vous devez mettre en œuvre **l’un des deux objectifs indépendants** suivants :

- **Objectif A :** sécuriser les connexions de messagerie avec TLS et STARTTLS à partir d’une PKI interne.
- **Objectif B :** permettre aux utilisateurs Active Directory d’utiliser leur messagerie avec leurs identifiants du domaine.

Vous devez rechercher les procédures dans la documentation officielle, adapter les paramètres à votre site et apporter les preuves du fonctionnement obtenu.

## Objectif A — Sécuriser les connexions avec une PKI interne

### Résultat attendu

Les utilisateurs doivent pouvoir envoyer et consulter leurs messages au moyen de connexions chiffrées. Les clients doivent reconnaître le certificat présenté par Stalwart et vérifier l’identité du serveur.

### Cahier des charges

- Utiliser un certificat serveur délivré par une **autorité de certification interne**.
- Le certificat doit couvrir le nom DNS utilisé pour joindre le serveur : `mail.ville.sportludique.fr`.
- Configurer la soumission SMTP avec **STARTTLS** et la consultation IMAP avec **STARTTLS ou TLS implicite**.
- Exiger le chiffrement avant la transmission des identifiants sur les services destinés aux utilisateurs.
- Installer le certificat d’autorité dans les magasins de confiance nécessaires sur les postes clients.
- Transmettre le **certificat public de l’autorité** et son empreinte aux autres équipes pour leur permettre d’établir la confiance.
- Conserver les clés privées sur les systèmes auxquels elles appartiennent : elles ne doivent pas être transmises aux autres équipes.
- Maintenir le fonctionnement des boîtes et des échanges réalisés au socle.

!!! warning "Chiffrer et vérifier l’identité"

    Une connexion chiffrée ne suffit pas à démontrer que le client communique avec le bon serveur. La validation doit porter également sur le nom DNS, les dates de validité et la chaîne de confiance. Une exception permanente aux avertissements de certificat n’est pas une solution attendue.

### Validation attendue

Vous devez démontrer :

- Un échange de messages entre deux utilisateurs avec les nouvelles connexions sécurisées.
- La reconnaissance du certificat avec avertissement sur les postes configurés.
- Le refus d’une authentification sans chiffrement sur les services utilisateurs concernés.
- Une connexion TLS validée depuis un poste d’une autre équipe ayant reçu votre certificat d’autorité.

### Livrables

- Tableau des services, ports et modes de chiffrement retenus.
- Présentation de la chaîne de confiance et des noms couverts par le certificat.
- Certificat public de l’autorité accompagné de son empreinte.
- Preuves des tests et explication d’un incident de confiance rencontré ou provoqué.

## Objectif B — Intégrer les utilisateurs Active Directory

### Résultat attendu

Les utilisateurs autorisés doivent pouvoir envoyer et consulter leurs messages dans Stalwart avec leurs **identifiants Active Directory**, sans création manuelle d’un second mot de passe dans Stalwart.

Les messages et les boîtes restent stockés sur le serveur de messagerie ; Active Directory fournit les identités et vérifie les mots de passe.

### Cahier des charges

- Utiliser le contrôleur de domaine du site comme source d’identités au moyen de LDAP.
- Définir un périmètre explicite d’utilisateurs autorisés : OU dédiée ou groupe de messagerie.
- Utiliser un compte de service disposant des seuls droits de lecture nécessaires, sans privilèges d’administration AD.
- Identifier les attributs servant à la connexion, à l’adresse électronique et au nom affiché.
- Renseigner une adresse unique de la forme `utilisateur@ville.sportludique.fr` pour chaque utilisateur concerné.
- Définir et documenter la forme de l’identifiant à saisir dans Thunderbird.
- Permettre l’accès à au moins **deux utilisateurs AD**.
- Limiter les communications entre Stalwart en DMZ et l’annuaire interne aux flux nécessaires.
- Prévoir un moyen de retrouver l’accès administratif en cas d’erreur de configuration de l’annuaire.
- Conserver les boîtes locales du socle ; ne pas supposer qu’une adresse identique fusionne automatiquement un compte local et un compte AD.

!!! note "Deux objectifs indépendants"

    Le déploiement de la PKI de l’objectif A n’est pas un prérequis à cet objectif. Si des connexions restent en clair dans la maquette, utiliser exclusivement des comptes et des mots de passe pédagogiques dédiés, jamais réutilisés sur un autre service.

### Validation attendue

Vous devez démontrer :

- La connexion des deux utilisateurs avec leurs identifiants AD.
- L’envoi, la réception et la réponse à un message.
- Le refus d’un utilisateur extérieur au périmètre autorisé.
- La prise en compte d’un changement de mot de passe AD lors d’une nouvelle authentification.
- Le refus d’une nouvelle authentification après désactivation d’un compte, en tenant compte des éventuels caches.
- La conservation des données de messagerie après désactivation du compte AD.

Une session déjà ouverte ne constitue pas une preuve de nouvelle authentification : les tests doivent distinguer ces deux situations.

### Livrables

- Preuves des tests d’authentification et d’échange de messages.
- Explication du comportement observé après changement de mot de passe et désactivation.

## Documentation officielle

- [Configuration des listeners et des modes TLS](https://stalw.art/docs/server/listener/){ target="_blank" rel="noopener" }
- [Gestion des certificats](https://stalw.art/docs/server/tls/certificates/){ target="_blank" rel="noopener" }
- [Authentification SMTP](https://stalw.art/docs/mta/inbound/auth/){ target="_blank" rel="noopener" }
- [Intégration LDAP et Active Directory](https://stalw.art/docs/auth/backend/ldap/){ target="_blank" rel="noopener" }