# Mission — Fournir un service d'hébergement aux équipes SLAM

## 1. Contexte professionnel

**SportLudique** commercialise des produits de sport ludiques sur plusieurs sites (Chartres, Orléans, Tours, Bourges et Blois).

Chaque équipe **SISR** assure l'hébergement et l'exploitation des services informatiques de son site. Les équipes **SLAM** développent des applications qu'elles souhaitent publier et maintenir à distance.

Votre mission est de devenir leur **fournisseur de services d'hébergement** : fournir les ressources, sécuriser les accès, publier les applications, assurer le support et respecter des engagements négociés avec vos clients. Vous devez également choisir et exploiter vos propres outils de support, indépendamment des ressources hébergées pour les SLAM.

!!! info "Périmètre"
    L'« extérieur » désigne les réseaux extérieurs à votre site dans l'infrastructure pédagogique. Chaque site dispose de **deux adresses IPv4 publiques simulées**. Aucune publication sur Internet réel n'est demandée.

Les notions de DMZ, DNS, reverse proxy, TLS et hébergement web ont déjà été étudiées. Il ne s'agit pas de refaire ces cours ni de suivre une procédure d'installation.

## Organisation par niveaux — isolation des services

La mission est **cumulative** : les trois niveaux fournissent **les mêmes services** aux SLAM (hébergement, services de données demandés, accès SFTP/SSH, **VPN client**, HTTPS, ticketing, SLA et sauvegardes). La différence entre les niveaux concerne **l'architecture et le degré d'isolation des environnements**. Aucune soutenance orale n'est prévue : les SLAM évaluent le service par leurs demandes, leurs tests et leurs incidents.

| Niveau | Architecture et isolation attendues |
| --- | --- |
| 🟢 **Socle** | Séparation des rôles sur des serveurs distincts : applications SLAM, services de données clients demandés, ticketing prestataire et données du prestataire. Protection des données par les comptes, les droits et les flux nécessaires. |
| 🔵 **Avancé** | Socle + **zones réseau distinctes** pour les services et données des clients et ceux du prestataire ; filtrage explicite entre les zones et réduction des communications transversales. |
| 🟣 **Expert** | Avancé + **isolation plus fine des environnements clients** (par application, groupe ou fonction selon la solution), contrôle des communications latérales et démonstration des limites d'une compromission. |

!!! note "Choix techniques"
    Les niveaux ne prescrivent ni un logiciel de ticketing ni une technologie de virtualisation : VM ou Docker sont possibles après étude. Un conteneur ne constitue pas, à lui seul, une zone de sécurité réseau. Le **VPN d'accès client est obligatoire à tous les niveaux**.

## 2. Concevoir l'offre d'hébergement

Vous devez proposer une infrastructure capable de publier **plusieurs applications en disposant de deux adresses IPv4 publiques**, tout en accueillant différentes technologies (PHP, Node.js, ASP.NET, etc.). Chaque service doit être accessible avec son propre FQDN et, pour les services web, en HTTPS.

Votre architecture doit prévoir :

- un mécanisme de publication et d'orientation des requêtes vers les applications concernées ;
- une stratégie TLS précisant l'emplacement des certificats, des clés privées et de la terminaison du chiffrement ;
- une **zone d'hébergement** pour les applications et une **zone privée** pour les éventuels services de données, non accessibles directement depuis l'extérieur ;
- des règles de filtrage limitant les communications aux seuls besoins identifiés ;
- une solution de sauvegarde et de restauration des fichiers, configurations et données ;
- des moyens d'administration distincts des accès accordés aux clients SLAM.

La terminaison TLS sur le reverse proxy est acceptable. Le chiffrement entre celui-ci et les serveurs applicatifs constitue une évolution à étudier selon les risques.

**Vous devez notamment déterminer si les serveurs de bases de données des clients et ceux du prestataire doivent être placés dans des zones de sécurité distinctes.** Un simple découpage en bases ou en comptes SQL sur un même serveur ne répond pas nécessairement aux exigences de cloisonnement. Étudiez les conséquences de la compromission d’une application cliente ou de l’outil de support.

**Travail attendu :** un schéma logique, un plan d'adressage, les FQDN, les principaux choix techniques et une **matrice des flux** (source, destination, protocole/port, action et justification). Ces documents doivent être tenus à jour au fil du déploiement ; **aucune soutenance orale n'est prévue**.

## 3. Fournir une plateforme aux développeurs SLAM

### Répartition des responsabilités

| Équipe SISR — fournisseur | Équipe SLAM — cliente |
| --- | --- |
| Fournit la VM et le système d'exploitation, les services et dépendances convenus | Installe, configure et maintient WordPress et ses applications |
| Met à disposition l'environnement web et sa publication HTTPS | Déploie et teste son code, ses extensions et ses mises à jour |
| Fournit un accès de dépôt SFTP restreint | Utilise cet accès dans les limites autorisées |
| Étudie les demandes de SGBD (PostgreSQL, MariaDB, SQL Server ou autre), leur faisabilité et fournit les services acceptés avec les droits adaptés | Précise ses besoins techniques, utilise le service fourni et gère les évolutions de schéma applicatif |
| Sécurise les accès, les flux et l'infrastructure ; réalise les sauvegardes convenues | Signale les incidents, documente les besoins et valide les corrections |

### Dépôt applicatif

Chaque équipe SLAM doit disposer d'une **VM d'hébergement** et d'un accès **SFTP reposant sur SSH**, avec un confinement (*chroot*) et des permissions limitant l'accès à son espace de dépôt.

Les comptes de dépôt doivent être individuels et ne doivent pas donner de shell interactif par défaut, ni d'accès aux répertoires des autres groupes. Les opérations d'administration du système restent sous la responsabilité des SISR.

!!! warning "Attention au confinement"
    Un chroot SFTP restreint le parcours des fichiers **pendant le transfert** ; il ne garantit pas à lui seul l'isolation du code **pendant son exécution**. Vous devez tenir compte des droits des processus applicatifs, des fichiers et des secrets.

### Services de données à la demande

**Aucun SGBD n'est imposé aux équipes SLAM.** Les développeurs formulent leurs besoins par ticket : moteur souhaité (PostgreSQL, MariaDB, SQL Server ou autre), version, capacité, comptes, accès, dépendances et contraintes de disponibilité.

Les SISR réalisent une **étude de faisabilité** (compatibilité, licences, ressources, sécurité, sauvegardes et maintenance), puis acceptent la demande, proposent une alternative argumentée ou motivent un refus. Ils mettent à disposition les services convenus, sur une infrastructure distincte de celle des applications, avec des comptes et privilèges adaptés. Les services de données des clients restent isolés des données internes du prestataire.

Les SLAM doivent pouvoir gérer leurs données à distance au moyen d'un **accès sécurisé et limité**, sans exposition directe du port du SGBD sur le réseau extérieur. Selon le moteur et le besoin, ils peuvent utiliser un client SQL via VPN, un tunnel SSH ou une autre méthode justifiée. Un accès SSH au serveur de données ne doit pas être accordé systématiquement s'il n'est pas nécessaire.

Les paramètres non secrets peuvent figurer dans le ticket ; les identifiants et autres secrets sont transmis séparément par un moyen approprié.

### Première mise en service : une application SLAM

Les SLAM choisissent et installent eux-mêmes leur application, **WordPress pouvant constituer un premier cas de validation**. Ils précisent par ticket ses prérequis techniques, notamment le moteur de base de données compatible et les accès nécessaires. Les SISR fournissent les ressources convenues, sans installer ni maintenir l'application à la place des développeurs.

La plateforme doit pouvoir accueillir ensuite des applications de technologies différentes, sous réserve de faisabilité et des engagements négociés.

## 4. Concevoir les accès distants — obligatoire pour tous

Vous disposez de **deux adresses IPv4 publiques** par site. Le reverse proxy permet de publier plusieurs applications HTTP(S), mais **ne résout pas automatiquement le problème des connexions SSH**.

Dans un premier temps, étudiez comment les SLAM peuvent joindre :

- leur VM d'hébergement pour déposer les fichiers ;
- le service de données demandé, si une administration distante est nécessaire.

Plusieurs serveurs peuvent conduire à publier **plusieurs points d'entrée SSH, avec des ports externes différents**. Que se passe-t-il si vous accueillez cinq, dix ou vingt équipes et leurs applications ? Quels sont les risques, les difficultés d'exploitation et les conséquences sur les règles de filtrage ?

**Déployez un VPN d’accès client**, permettant aux SLAM de rejoindre uniquement les ressources qui leur sont autorisées, sans multiplier les services SSH publiés. Justifiez son point de terminaison, son authentification, son adressage et les règles de filtrage. La publication de plusieurs ports SSH peut servir de point de départ à l’étude, mais ne constitue pas l’architecture cible.

Distinguez clairement les accès **clients SLAM**, les accès **administrateurs SISR** et les accès **utilisateurs des applications**. Justifiez le cloisonnement entre les groupes et le maintien de la protection de la DMZ privée.

## 5. Choisir et exploiter une solution de gestion des tickets

En tant que prestataire, vous devez proposer aux équipes SLAM un **portail de support accessible en HTTPS** depuis l'extérieur du site. Le choix du logiciel vous appartient : il doit résulter d'une **étude de faisabilité**, et non d'une installation imposée.

### Étudier et choisir

Comparez brièvement plusieurs solutions possibles, par exemple :

| Solution | Pistes d'étude |
| --- | --- |
| **GLPI** | Gestion des services informatiques, tickets, engagements de service ; stack PHP et base SQL |
| **Zammad** | Helpdesk, échanges avec les clients ; stack et dépendances plus importantes à examiner |
| **osTicket** | Gestion de tickets ; stack PHP et base SQL |
| **FreeScout** | Support client ; stack PHP et base SQL |

D'autres solutions sont acceptées. Votre comparaison doit porter sur les **fonctionnalités**, la **compatibilité avec les SLA**, la **stack technique** (langages, serveur web, moteur de base de données, dépendances), les **ressources nécessaires**, la **sécurité**, la **maintenance** et les **modalités de sauvegarde**. Concluez par un choix justifié et réaliste.

### Choisir une architecture de déploiement

La solution de ticketing doit être installée **sur un serveur distinct de celui qui héberge les applications SLAM**. Un déploiement classique sur VM ou **dans un ou plusieurs conteneurs Docker** est possible : étudiez la faisabilité, les dépendances, les volumes persistants, le réseau et les mises à jour avant de choisir.

**Les bases de données du prestataire doivent être isolées de celles des clients SLAM.** Étudiez leur placement réseau, les éventuelles DMZ privées distinctes, les flux strictement nécessaires et les conséquences d'une compromission. Ne supposez pas qu'une séparation logique des bases sur un SGBD commun suffit. Le serveur de ticketing ne doit pas offrir de chemin d'accès non justifié vers les données des clients.

Vous devez proposer une architecture qui distingue :

- les services publics (applications des SLAM et portail de support) ;
- les serveurs et les données des clients hébergés ;
- les services et les données internes du prestataire ;
- les accès d'administration SISR et les accès des clients SLAM.

**À vous de déterminer le nombre et le rôle des zones de sécurité, leur implantation et les règles de filtrage.** Justifiez votre proposition dans le dossier d'architecture et la matrice des flux, en tenant compte des deux IPv4 publiques simulées.

### Mettre le service à disposition

Chaque SLAM doit pouvoir ouvrir une demande (hébergement, compte, ressource, évolution), signaler un incident, suivre les échanges et valider le rétablissement. Prévoyez des comptes individuels, les affectations aux techniciens, des droits empêchant la consultation des tickets d'autres groupes sans autorisation et une méthode de notification adaptée.

!!! tip "Des clients bien réels"
    Les équipes SLAM sont les **utilisateurs et les évaluateurs opérationnels** de votre service. Leurs demandes et incidents alimentent le travail des SISR. Toute erreur applicative n'est pas nécessairement imputable à l'hébergeur : qualifiez les tickets avant de conclure.

## 6. Définir des engagements de service (SLA)

Négociez avec les SLAM un **SLA (*Service Level Agreement*)**, court et réaliste, décrivant le service fourni et les responsabilités de chacun.

Votre accord doit préciser :

- les services inclus et les limites de l'offre ;
- les plages de support (qui ne sont pas nécessairement les heures de disponibilité des applications) ;
- les priorités selon l'impact et l'urgence ;
- les objectifs de **prise en charge**, de **rétablissement** et de **résolution** ;
- les modalités de communication, d'escalade et de validation des tickets ;
- les sauvegardes, les restaurations et les objectifs **RPO** (perte de données acceptable) et **RTO** (durée visée de rétablissement).

| Priorité | Critères d'impact et d'urgence | Prise en charge | Rétablissement visé | Information des SLAM |
| --- | --- | --- | --- | --- |
| À définir | À compléter | À compléter | À compléter | À compléter |
| À définir | À compléter | À compléter | À compléter | À compléter |
| À définir | À compléter | À compléter | À compléter | À compléter |

Configurez dans la solution de ticketing retenue les calendriers et les échéances qu’elle permet de suivre. Vérifiez le comportement d'un ticket créé **pendant** et **en dehors** des plages de support. Distinguez un accusé automatique d'une réelle prise en charge, et une remise en service provisoire d'une résolution définitive.

Les engagements doivent être **mesurables et tenables** dans les conditions du projet, pas inventés pour remplir un tableau.

## 7. Exigences d'isolation selon le niveau

Les fonctionnalités sont **communes aux trois niveaux**. Ce qui progresse est la façon d'organiser les serveurs, les zones de sécurité et les autorisations réseau.

### 🟢 Socle — Séparer les rôles et les données

- Fournir sur des **serveurs distincts** la VM d'hébergement des SLAM, les services de données clients demandés, le serveur de ticketing et les services de données du prestataire.
- Placer les services de données clients hors de portée directe du réseau extérieur ; n'autoriser que les flux nécessaires depuis les applications et les accès clients autorisés via VPN.
- Isoler les données du prestataire de celles des SLAM : serveurs ou environnements distincts, comptes dédiés, privilèges minimaux et sauvegardes séparées.
- Justifier l'emplacement des serveurs dans les zones existantes et documenter les flux ; ne pas confondre séparation des machines et segmentation réseau.

### 🔵 Avancé — Séparer les environnements réseau

- Organiser des **zones de sécurité distinctes** pour les services exposés et les ressources privées, en distinguant notamment les environnements **clients SLAM** et **prestataire**.
- Mettre en œuvre un filtrage interzones justifié : seules les communications nécessaires entre applications, bases, ticketing, VPN et administration sont autorisées.
- Vérifier qu'une compromission du serveur de ticketing n'ouvre pas un chemin injustifié vers les bases SLAM, et réciproquement.
- Documenter les flux refusés et tester les restrictions depuis les différentes zones.

### 🟣 Expert — Isoler les clients entre eux

- Étudier et mettre en œuvre un **cloisonnement renforcé entre les équipes SLAM**, adapté aux ressources : VM dédiées, segments réseau séparés, isolation des processus ou autre solution justifiée.
- Empêcher les communications latérales non nécessaires entre applications et entre environnements clients ; adapter les droits des comptes, processus et bases de données.
- Vérifier, avec des tests maîtrisés, qu'une application ou un compte client compromis ne permet pas d'accéder aux fichiers, secrets et données des autres clients ni aux services internes du prestataire.
- Expliquer les limites de l'isolation choisie, y compris lorsque Docker ou un hébergement mutualisé sont utilisés.

**À tous les niveaux**, le VPN client, le portail de tickets, le SLA, le dépôt SFTP, la publication HTTPS, les sauvegardes et les échanges avec les SLAM restent obligatoires. La qualité de la séparation doit être démontrée, pas simplement dessinée.

## 8. Exploiter et faire tester le service

La recette est réalisée **avec les SLAM**, depuis un réseau extérieur au site. Elle doit notamment vérifier :

| Vérification | Résultat attendu |
| --- | --- |
| Publication | Applications SLAM et portail de support accessibles par leurs FQDN en HTTPS sur les deux IPv4 publiques disponibles, selon la répartition retenue |
| Responsabilités | Applications installées et maintenues par les SLAM sur la plateforme fournie par les SISR |
| Dépôt | Transfert SFTP possible uniquement dans l'espace autorisé, sans shell non prévu |
| Base de données | L’application communique avec le SGBD demandé et accepté ; accès direct depuis l'extérieur refusé |
| Administration des données | Accès sécurisé selon le besoin validé, sans privilèges globaux |
| Cloisonnement | Un groupe ne peut pas consulter les fichiers, données ou tickets d'un autre groupe |
| Assistance | Demande et incident réels suivis dans l’outil retenu, avec échanges et validation des SLAM |
| SLA | Délais observables, échéances correctement calculées et retards expliqués |
| Sauvegarde | Restauration vérifiée d'une application et de ses données, comparée au RPO/RTO annoncés |

Les incidents réels constituent la principale matière de l'évaluation. Des tests contrôlés peuvent compléter les situations rencontrées, sans provoquer de panne sur les services des autres groupes.

## 9. Livrables et critères de réussite

Produisez des documents **courts, utiles et maintenus à jour** :

1. **Dossier d'architecture** : schéma, adressage, publication, segmentation, matrice de flux et justification du degré d’isolation correspondant au niveau réalisé.
2. **Fiche de service à destination des SLAM** : FQDN, modalités d'accès, périmètre fourni, responsabilités et procédure de demande, sans secrets.
3. **SLA convenu avec les SLAM** : engagements, calendrier, priorités, sauvegardes et restauration.
4. **Traces d'exploitation** : tickets réellement traités dans la solution choisie, preuves de fonctionnement de restauration, de VPN et des tests d’isolation correspondant au niveau ; corrections apportées.

**La réussite ne se mesure pas au nombre de serveurs installés, mais à la capacité des SLAM à utiliser, administrer leurs applications et faire évoluer un service d'hébergement sécurisé, documenté et effectivement maintenu par les SISR.**

## Ressources déjà étudiées

- [Hébergement mutualisé](web/01-hebergement-mutualise.md)
- [Reverse proxy](web/02-reverse-proxy.md)
- [Conception d'une DMZ](../06-Dmz/conception_dmz.md)
- [Présentation de TLS et de la PKI](pki/01-tls-presentation.md)
