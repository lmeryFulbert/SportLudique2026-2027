# Mission Messagerie

## Contexte et objectif

Votre groupe doit déployer un service de messagerie pour son site SportLudique, en cohérence avec son domaine DNS et son infrastructure réseau. Le service doit permettre l'envoi et la réception de messages entre au moins **deux comptes utilisateurs**, en plus du compte d'administration, depuis **Thunderbird**.

**Il s'agit d'une mission, pas d'un tutoriel.** Vous devez rechercher les informations nécessaires, vous appuyer sur les **documentations officielles**, faire des choix techniques, les justifier et démontrer le bon fonctionnement de votre solution. Les supports de cours existants restent disponibles : **aucun fichier de TP d'origine n'est remplacé ou modifié**.

## Missions selon le niveau

### Niveau Socle — hMailServer sous Windows

Déployez **hMailServer (branche historique originale, version stable)** sur un serveur Windows et mettez en service une messagerie SMTP/IMAP.

- Installer et configurer le serveur pour le domaine de votre site.
- Créer au moins deux boîtes aux lettres utilisateurs, en plus du compte administrateur.
- Configurer Thunderbird et démontrer des échanges de messages.
- Identifier les protocoles, ports et mécanismes d'authentification utilisés.
- Observer les échanges réseau et expliquer ce qui est protégé ou non, notamment selon l'utilisation de TLS.

**Source de téléchargement :** [hMailServer — versions publiées par le projet historique](https://github.com/hmailserver/hmailserver/releases). Utilisez une **version stable de la branche originale**, et non un fork homonyme.

**Documentation :** [hMailServer — documentation officielle historique](https://www.hmailserver.com/documentation/).

### Niveau Avancé — Stalwart sous Debian

Déployez **Stalwart Mail Server** sur un serveur Debian et intégrez-le à votre infrastructure DNS et à la PKI SportLudique.

- Installer et configurer les services SMTP et IMAP.
- Créer au moins deux boîtes aux lettres utilisateurs, en plus du compte administrateur.
- Tester l'envoi et la réception avec Thunderbird.
- Comparer les connexions non chiffrées, **STARTTLS** et **TLS implicite**, lorsque les configurations le permettent, et justifier les choix retenus.
- Remplacer le certificat initial par un **certificat délivré par la PKI intermédiaire** et vérifier sa reconnaissance côté client.
- Examiner les échanges réseau pour mettre en évidence l'apport de TLS.

**Documentation officielle :** [Stalwart](https://stalw.art/docs/).

### Niveau Expert — Postfix + Dovecot sous Debian

Déployez une solution de messagerie reposant sur **Postfix et Dovecot, installés sur une seule et même VM Debian**.

> **Attention : une seule VM !** Postfix et Dovecot sont deux composants logiciels complémentaires d'un même serveur de messagerie. Il n'est pas demandé de créer une VM pour Postfix et une autre pour Dovecot.

- Configurer **Postfix** pour le transport des messages par SMTP.
- Configurer **Dovecot** pour l'accès aux boîtes aux lettres par IMAP.
- Assurer l'intégration des deux services sur le **même système Debian** (comptes, stockage des messages et authentification selon l'architecture retenue).
- Créer au moins deux comptes utilisateurs et démontrer l'envoi et la réception de messages avec Thunderbird.
- Mettre en œuvre TLS avec un certificat issu de la **PKI intermédiaire SportLudique**.
- Justifier les choix d'architecture, de sécurité et de configuration, puis analyser les flux réseau.

**Documentations officielles :** [Postfix](https://www.postfix.org/documentation.html) et [Dovecot](https://doc.dovecot.org/).

## Cybersécurité pour tous — SPF, DKIM et DMARC

**Cette partie est obligatoire pour les trois niveaux, y compris le Socle.** Elle ne constitue pas une option Expert.

Chaque groupe doit :

1. Expliquer le rôle respectif de **SPF**, **DKIM** et **DMARC**, ainsi que leurs limites dans la lutte contre l'usurpation d'adresse et de domaine.
2. Identifier les enregistrements DNS nécessaires et proposer une configuration adaptée à son domaine SportLudique.
3. Publier les enregistrements pertinents dans sa zone DNS et **mettre en œuvre les mécanismes pris en charge par sa solution** ; si une fonction n'est pas disponible, documenter précisément la limite et présenter la configuration attendue.
4. Vérifier les enregistrements DNS et, lorsque c'est possible, tester le résultat sur des messages échangés. Dans Thunderbird, utiliser **Ctrl+U** pour afficher la source du message et examiner ses en-têtes. **Ne pas confondre présence d'un enregistrement DNS et validation effective d'un message par un serveur destinataire.**

## Livrables et validation

Chaque groupe remet :

- Un **schéma simple** de l'architecture, indiquant le serveur, les composants, les protocoles et les ports utilisés.
- Les **paramètres DNS** utiles à la messagerie (notamment MX et les enregistrements liés à SPF, DKIM et DMARC).
- Des **preuves de fonctionnement** : comptes créés, messages envoyés et reçus avec Thunderbird, vérifications DNS et tests de sécurité.
- Une **courte analyse** des protections mises en place, des limites rencontrées et des choix techniques effectués.

La validation se fera par une **démonstration du service** et des **questions orales** : chaque membre du groupe doit être capable d'expliquer ce qu'il a configuré et pourquoi.
