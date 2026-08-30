# Serveurs et services

Au cours de l'année, chaque groupe construira progressivement les serveurs et services nécessaires au fonctionnement de son site SportLudique.

Cette page présente les principaux **objectifs techniques à atteindre**. Elle ne constitue pas une liste de machines virtuelles à créer immédiatement : l'infrastructure sera construite et améliorée au fur et à mesure des situations professionnelles.

!!! important "Construire progressivement"
    Ne créez pas à l'avance des machines virtuelles dont vous ne connaissez pas encore le rôle ou les besoins.

    Une infrastructure évolue avec les besoins de l'organisation. De nouvelles contraintes pourront donc vous conduire à modifier une architecture ou à remettre en cause certains de vos choix.

## Services d'infrastructure

Chaque site disposera de son propre domaine **Active Directory**, conformément à la convention de nommage définie pour SportLudique.

L'infrastructure devra notamment assurer l'authentification des utilisateurs, la gestion centralisée des comptes et des postes, l'application des stratégies de groupe, la résolution des noms et l'attribution des paramètres réseau.

Les services **AD DS**, **DNS** et **DHCP** feront donc partie des premiers services à mettre en œuvre, une fois qu'un minimum d'**infrastructure réseau** aura été construit.

!!! info "Système et réseau"
    Les services système ont besoin du réseau pour communiquer et être accessibles aux utilisateurs. À l'inverse, une infrastructure réseau qui ne permet d'accéder à aucun service n'a que peu d'intérêt.

    **Système et réseau sont donc indissociables** : tout au long de l'année, la construction de l'un accompagnera et conditionnera la construction de l'autre.

La disponibilité de l'annuaire devra également être prise en compte, notamment grâce à la présence de plusieurs contrôleurs de domaine.

!!! warning "Contrôleurs de domaine"
    Dans un domaine Active Directory moderne, on ne distingue pas un contrôleur de domaine « principal » et des contrôleurs « secondaires ».

    Les contrôleurs de domaine répliquent entre eux les informations de l'annuaire. Certains assurent néanmoins des fonctions particulières appelées **rôles FSMO**, que vous découvrirez lors de l'étude d'Active Directory.

## Virtualisation

La majorité des serveurs sera déployée sous forme de **machines virtuelles** sur une infrastructure **Proxmox VE**.

Les ressources disponibles ne sont pas illimitées. Chaque machine devra donc être dimensionnée en fonction de ses besoins réels.

Lorsque cela est possible, les installations **Windows Server Core** seront privilégiées afin de limiter la consommation de ressources et de favoriser l'administration distante.

!!! danger "Convention de nommage obligatoire ☠️"
    Toutes les machines virtuelles devront commencer par le préfixe correspondant à votre site : `CHA-`, `ORL-`, `TRS-`, `BRG-` ou `BLO-`.

    Toute VM ne respectant pas cette convention pourra être considérée comme non identifiée et **supprimée de l'infrastructure sans préavis**.

## Gestion du parc informatique

La gestion du parc constitue une composante importante de votre infrastructure.

Une solution de **gestion de parc et de gestion des incidents** devra obligatoirement être mise en place. Elle permettra notamment d'inventorier les équipements, de suivre leur configuration et de gérer les incidents et demandes des utilisateurs.

Vous devrez également réfléchir à l'**industrialisation du déploiement des postes de travail et des machines virtuelles**.

Plusieurs approches pourront être étudiées :

* le **clonage et le déploiement d'images** ;
* les services de déploiement proposés par **Windows Server** ;
* le **provisionnement automatisé** avec des outils comme **Terraform** ou **Vagrant** ;
* toute autre solution que vous jugerez pertinente.

Ces approches répondent à des besoins différents. Leur étude, leur comparaison et la justification des solutions retenues font pleinement partie du travail attendu.

## Automatisation et gestion des configurations

Une fois les systèmes déployés, leur configuration et leur administration ne devront pas nécessairement être réalisées manuellement.

Vous utiliserez progressivement des outils permettant d'**automatiser la configuration et l'administration** des systèmes, notamment **Ansible**, **PowerShell** ou les **stratégies de groupe (GPO)**.

L'objectif sera de rendre les opérations répétitives plus rapides, mais surtout d'obtenir des configurations **cohérentes et reproductibles**.


## Supervision

Une solution de **supervision est indispensable** au fonctionnement de votre infrastructure.

Elle devra permettre de surveiller les équipements, les serveurs et les principaux services, de conserver un historique de leur fonctionnement et de générer des alertes lorsqu'une intervention est nécessaire.

Il vous appartiendra de déterminer **ce qui doit être supervisé et pourquoi**. Une supervision limitée à vérifier que les machines répondent au réseau ne sera pas suffisante pour connaître réellement l'état des services proposés aux utilisateurs.

## Services proposés

L'infrastructure devra progressivement héberger différents services répondant aux besoins de SportLudique.

Vous serez notamment amenés à mettre en œuvre des **services Web**, des services de **transfert et de partage de fichiers**, du **stockage réseau**, des **bases de données** ainsi que des services de **messagerie**.

Les technologies utilisées pourront varier selon les situations et les choix réalisés par chaque groupe. Vous devrez être capables d'administrer des environnements **Windows et Linux** et de justifier les solutions retenues.

Certains services seront accessibles depuis l'extérieur et devront alors être placés dans une **DMZ** et respecter la convention DNS définie pour SportLudique :

```text
<service>.<ville>.sportludique.fr
```

Les communications avec ces services devront être sécurisées lorsque cela est nécessaire, notamment avec **TLS**.

## Filtrage des communications

Les différentes zones de votre infrastructure ne devront pas pouvoir communiquer librement entre elles.

Les **pare-feux** mis en place au cours de l'année devront assurer un véritable filtrage des communications entre les réseaux, les serveurs et les services.

!!! danger "Pas de PASS ALL"
    Une règle autorisant tous les flux peut être pratique pour vérifier rapidement qu'un problème provient du pare-feu.

    Elle ne constitue pas une politique de sécurité.

    Les règles définitives devront autoriser **uniquement les flux nécessaires au fonctionnement des services**. Vous devrez donc être capables d'identifier, de documenter et de justifier les protocoles et les ports autorisés.

La segmentation en zones, notamment la **DMZ**, n'a de sens que si les communications entre ces zones sont effectivement contrôlées.

## Journaux, traçabilité et sécurité

Les serveurs, postes, équipements réseau, applications et dispositifs de sécurité génèrent des journaux qui devront être **conservés et exploités**.

La centralisation des événements devra permettre de rechercher les informations nécessaires au diagnostic d'un incident et de conserver une trace des événements importants survenus dans le système d'information.

Vous étudierez également l'utilisation d'un **SIEM (Security Information and Event Management)** afin d'aller au-delà de la simple conservation des journaux et de permettre leur recherche, leur analyse et leur corrélation.

Ces informations devront notamment pouvoir être utilisées lors d'un **audit de sécurité** ou de l'analyse d'un incident.

La sécurisation et la traçabilité des opérations d'administration devront également être prises en compte dans vos réflexions et pourront conduire à l'étude de mécanismes supplémentaires de contrôle des accès privilégiés.

## Sauvegarde

Les données et services importants devront pouvoir être restaurés à la suite d'une erreur, d'une panne ou d'un incident.

Une stratégie de **sauvegarde** devra donc être intégrée à l'infrastructure.

!!! warning "Une réplication n'est pas une sauvegarde"
    Disposer de plusieurs copies synchronisées d'une donnée améliore sa disponibilité, mais ne constitue pas nécessairement une sauvegarde.

    Une suppression ou une corruption peut également être répliquée.

    Vous devrez donc distinguer les mécanismes permettant d'assurer la **disponibilité** de ceux permettant la **restauration** des données.

## Haute disponibilité

Certains services deviendront suffisamment importants pour que leur indisponibilité ne soit plus acceptable.

Vous devrez donc réfléchir à la **haute disponibilité** de votre infrastructure et expérimenter différents mécanismes permettant de maintenir les services en fonctionnement malgré la défaillance d'un composant.

Selon les situations, cela pourra notamment passer par la redondance, la réplication, la haute disponibilité des machines virtuelles ou la répartition de charge.

??? info "Haute disponibilité et répartition de charge"
    La **haute disponibilité (HA)** cherche principalement à maintenir un service accessible lorsqu'un composant tombe en panne.

    La **répartition de charge (Load Balancing)** permet de distribuer les requêtes entre plusieurs ressources.

    Ces deux mécanismes peuvent être associés, mais ils ne répondent pas exactement au même besoin.

## L'objectif final

À la fin de l'année, votre infrastructure ne devra pas simplement contenir beaucoup de machines virtuelles.

Elle devra former un **système d'information cohérent, administrable, supervisé et sécurisé**.

Les utilisateurs devront disposer des services dont ils ont besoin, les incidents devront pouvoir être suivis, les services devront être supervisés, les flux réseau réellement filtrés, les événements importants conservés et exploitables, et les services critiques devront pouvoir résister à certaines défaillances.

L'objectif est ambitieux.

C'est volontaire.
