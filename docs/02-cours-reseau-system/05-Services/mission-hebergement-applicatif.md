# Mission — Concevoir une infrastructure d'hébergement applicatif sécurisée

## 1. Contexte professionnel

L'entreprise **SportLudique** est spécialisée dans la commercialisation de produits sportifs et ludiques.

Dans le cadre du développement de son activité, elle souhaite mettre à disposition sur Internet plusieurs applications métiers, notamment celles développées par son équipe de développeurs (SLAM).

Ces applications peuvent répondre à différents besoins : gestion du catalogue de produits, commandes, stocks, clients, ventes et autres services numériques.

À terme, l'infrastructure devra également pouvoir accueillir de nouvelles applications, éventuellement développées par des prestataires externes.

Les applications ne reposent pas nécessairement sur les mêmes technologies :

- Applications PHP hébergées sur Apache ou Nginx ;
- Applications ASP.NET hébergées sur IIS ;
- Applications Node.js ;
- Autres technologies susceptibles d'être retenues par les développeurs.

Certaines applications utilisent une base de données relationnelle pour conserver les informations nécessaires à leur fonctionnement.

**Votre mission consiste à proposer une architecture d'hébergement permettant de publier ces applications de manière sécurisée, tout en conservant la possibilité de faire évoluer l'infrastructure.**

## 2. Problématique

L'entreprise dispose d'une contrainte importante : **une seule adresse IPv4 publique est disponible pour publier l'ensemble des applications.**

Pourtant, chaque application doit pouvoir être accessible par un nom DNS distinct, par exemple :

- `boutique.sportludique.fr`
- `stocks.sportludique.fr`
- `gestion.sportludique.fr`

Les applications peuvent être hébergées sur des serveurs différents et utiliser des technologies et des ports distincts.

Par ailleurs, les données manipulées par ces applications doivent être protégées. Il n'est notamment pas acceptable qu'un serveur de bases de données soit directement accessible depuis Internet.

L'entreprise attend une proposition répondant aux problématiques suivantes :

1. Comment publier plusieurs applications avec une seule adresse IPv4 publique ?
2. Comment permettre la coexistence d'applications utilisant différentes technologies ?
3. Comment garantir la confidentialité et l'intégrité des communications ?
4. Comment organiser les différentes zones réseau afin de limiter les risques de compromission ?
5. Comment protéger les serveurs de bases de données et contrôler les accès à leurs services ?
6. Comment administrer et faire évoluer cette infrastructure sans compromettre sa sécurité ?

## 3. Travail demandé

### 3.1. Étudier les solutions d'hébergement

Vous devez rechercher et comparer les solutions techniques permettant de répondre aux besoins de SportLudique.

Votre étude doit notamment prendre en compte :

- La publication de plusieurs applications derrière une seule adresse IPv4 publique ;
- L'orientation des requêtes vers le serveur applicatif concerné ;
- La prise en charge de plusieurs technologies de développement ;
- La gestion des noms DNS ;
- La possibilité d'ajouter de nouvelles applications sans modifier profondément l'architecture.

**Aucune technologie particulière n'est imposée.** Vous devrez justifier les solutions retenues et expliquer leur rôle dans l'infrastructure.

### 3.2. Sécuriser les communications

Les applications publiées doivent être accessibles au moyen de connexions HTTPS.

Vous devez proposer une stratégie de gestion des certificats numériques et du chiffrement TLS.

Plusieurs approches peuvent être envisagées, notamment :

- L'utilisation d'un certificat générique (wildcard) pour les applications d'un même domaine ;
- La gestion de certificats propres à chaque application ;
- Le chiffrement des communications entre les différents composants de l'infrastructure.

Votre proposition doit préciser où les connexions TLS sont établies et éventuellement terminées, ainsi que les conséquences de ce choix sur la sécurité.

Le chiffrement des communications internes devra être étudié et justifié en fonction des risques identifiés.

### 3.3. Concevoir la segmentation réseau

L'infrastructure doit distinguer les composants exposés à Internet des ressources qui ne doivent pas être directement accessibles depuis l'extérieur.

Vous devez déterminer :

- Les zones réseau nécessaires ;
- Le positionnement des différents serveurs ;
- Les équipements assurant le routage et le filtrage ;
- Les communications autorisées entre les zones ;
- Les moyens d'administration sécurisée.

**Une attention particulière doit être portée à l'emplacement des serveurs de bases de données.**

Vous devrez notamment expliquer comment une application publiée sur Internet peut accéder à ses données sans rendre le serveur de bases de données accessible depuis Internet.

### 3.4. Protéger les bases de données

Les bases de données constituent une ressource critique de l'entreprise.

Votre étude devra aborder :

- L'isolation réseau des serveurs de bases de données ;
- La limitation des flux aux seules applications autorisées ;
- L'authentification des applications auprès du SGBD ;
- La gestion des comptes et des privilèges ;
- La protection des communications entre applications et SGBD ;
- La sauvegarde et la restauration des données ;
- Les conséquences de la compromission d'un serveur applicatif.

Vous devez proposer des mesures permettant de limiter les conséquences d'un incident de sécurité.

Il n'est pas demandé de déployer immédiatement un SGBD. Vous devez d'abord **concevoir et justifier son intégration dans l'architecture**.

## 4. Proposition d'architecture

À l'issue de votre étude, vous devez présenter une solution complète répondant aux besoins de SportLudique.

Votre proposition comprendra obligatoirement les éléments suivants.

### Schéma d'architecture

Un schéma logique faisant apparaître :

- Internet et l'adresse IPv4 publique ;
- Les différentes zones de sécurité ;
- Les équipements de filtrage ;
- Les composants assurant la publication des applications ;
- Les serveurs applicatifs ;
- Les serveurs de bases de données ;
- Les principaux flux de communication.

### Plan d'adressage

Un plan d'adressage IPv4 cohérent avec les zones réseau proposées.

Pour chaque réseau, précisez son adresse, son masque, sa passerelle et son rôle.

### Matrice de filtrage

Une matrice décrivant les communications nécessaires au fonctionnement de l'infrastructure.

| Source | Destination | Protocole / Port | Justification |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

La politique de filtrage doit reposer sur le principe du **moindre privilège** : seuls les flux nécessaires sont autorisés.

### Choix technologiques

Pour chaque solution retenue, précisez :

- Son rôle ;
- Les raisons de votre choix ;
- Les solutions alternatives envisagées ;
- Ses avantages et ses limites.

### Analyse de sécurité

Identifiez les principales menaces pesant sur l'infrastructure et expliquez comment votre architecture permet d'en réduire les risques.

Vous étudierez notamment les conséquences possibles de la compromission d'une application exposée à Internet.

## 5. Validation obligatoire — Soutenance orale

**Aucune installation ni configuration ne doit être entreprise avant la validation de votre proposition d'architecture.**

Chaque groupe présentera son étude lors d'une soutenance orale devant le responsable de l'infrastructure.

La présentation devra permettre de :

1. Expliquer l'architecture proposée et le rôle de chaque composant ;
2. Justifier la publication de plusieurs applications avec une seule adresse IPv4 publique ;
3. Présenter la stratégie de sécurisation des communications ;
4. Justifier la segmentation réseau et le positionnement des serveurs ;
5. Expliquer les mécanismes de protection des bases de données ;
6. Présenter le plan d'adressage et les règles de filtrage ;
7. Défendre les choix techniques face à des scénarios d'incident ou de compromission.

**Vous devez être capables de justifier vos choix, et pas uniquement de présenter un schéma fonctionnel.**

À l'issue de la soutenance, trois décisions sont possibles :

- **Architecture validée :** la mise en œuvre peut commencer.
- **Architecture validée sous réserve :** certaines corrections sont exigées avant le déploiement.
- **Architecture refusée :** une nouvelle proposition doit être présentée.

## 6. Mise en œuvre

Après validation de l'architecture, vous pourrez procéder au déploiement de l'infrastructure.

La mise en œuvre devra respecter les choix validés et comprendre des tests démontrant :

- L'accès aux différentes applications par leurs noms DNS ;
- Le fonctionnement de plusieurs applications partageant une seule adresse IPv4 publique ;
- La validité des connexions HTTPS ;
- Le bon fonctionnement des communications entre applications et bases de données ;
- L'impossibilité d'accéder directement aux bases de données depuis Internet ;
- Le respect des règles de filtrage entre les différentes zones.

Les tests devront également vérifier qu'une communication non autorisée est effectivement bloquée.

## 7. Résultat attendu

L'objectif n'est pas simplement de rendre plusieurs sites web accessibles depuis Internet.

Vous devez concevoir une **véritable infrastructure d'hébergement applicatif**, capable d'accueillir des applications hétérogènes, de protéger les données de l'entreprise et de limiter les conséquences d'une compromission.

Votre proposition doit être techniquement réalisable, sécurisée, documentée et évolutive.

**La qualité de l'architecture et la pertinence des justifications priment sur le nombre de technologies déployées.**