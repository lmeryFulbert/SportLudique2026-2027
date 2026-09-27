# Activité notée — Concevoir les DMZ

!!! info "Votre mission"
    L'infrastructure réseau de **SportLudique** évolue.

    Chaque site doit désormais disposer de sa **propre DMZ** afin d'héberger et de publier des services tout en protégeant le réseau interne du site.

    Vous devez **faire évoluer l'architecture que vous avez déjà conçue**, puis convaincre l'enseignant de la pertinence de vos choix.

    Il ne s'agit pas de reproduire une architecture fournie : **vous prenez les décisions et vous les défendez**.

---

## Contexte

SportLudique dispose de plusieurs sites interconnectés.

Vous travaillez sur **le site dont vous avez déjà la responsabilité** et conservez le plan d'adressage, les réseaux et les contraintes définis lors des activités précédentes.

La DMZ doit s'intégrer au **SI existant du site** et aux VLAN de l'infrastructure SIO mis à votre disposition.

Les services à étudier sont au minimum :

- un **service Web** ;
- un service de **messagerie** ;
- un service **DNS public**.

Cette liste constitue un **minimum**. À vous d'identifier si d'autres services, équipements ou fonctions sont nécessaires ou pertinents.

Tout élément ajouté devra être **positionné et justifié**.

!!! warning "Chaque choix doit pouvoir être défendu"
    Pour chaque élément de votre architecture, vous devez être capable de justifier :

    1. **son emplacement** ;
    2. **les flux** qu'il doit émettre ou recevoir ;
    3. **les conséquences** de sa compromission.

    Il n'existe pas nécessairement une seule solution correcte : un choix différent peut être pertinent s'il est techniquement cohérent et argumenté.

---

## Matériel et logiciels disponibles pour l'implémentation

Une fois votre architecture validée, vous disposerez notamment de :

- boîtiers **Stormshield SN210** ;
- machines physiques ou virtuelles permettant d'installer **pfSense** ou **OPNsense**.

Pour les pare-feux logiciels, **Linux est interdit dans cette activité** : vous utiliserez une solution reposant sur **BSD**.

Ce choix imposé devra néanmoins être **justifié techniquement lors de l'oral**.

---

## Contraintes communes

Quel que soit le niveau choisi, votre proposition doit :

- intégrer une **DMZ au site SportLudique existant** ;
- concevoir l'infrastructure réseau permettant d'accueillir ultérieurement les services ;
- isoler cette zone du réseau interne ;
- conserver les communications nécessaires avec le reste de l'infrastructure SportLudique ;
- permettre l'administration des équipements ;
- prendre en compte le routage, le NAT éventuel et le filtrage ;
- rester compatible avec l'adressage, les VLAN et les équipements disponibles.

!!! info "Faire évoluer l'existant"
    L'objectif de cette activité est précisément d'étudier **les conséquences de l'intégration d'une DMZ sur l'infrastructure existante**.

    Votre proposition doit identifier les évolutions nécessaires et expliquer leurs conséquences, notamment sur :

    - l'adressage ;
    - le routage ;
    - le filtrage ;
    - les interfaces réseau ;
    - l'administration ;
    - l'architecture physique et le brassage.

    Ces modifications font partie de votre travail de conception : elles doivent être **identifiées, représentées et justifiées**.

### Administration

Les équipements doivent pouvoir être administrés depuis le **réseau d'administration prévu dans l'infrastructure SportLudique**.

Vous ne disposez pas nécessairement d'une interface physique supplémentaire dédiée à cet usage.

À vous de déterminer comment les flux d'administration atteignent les équipements concernés **sans remettre en cause l'isolation des autres flux**.

!!! tip "Vous avez déjà rencontré ce problème"
    Vous avez déjà rencontré une problématique comparable lors de la configuration d'autres équipements réseau.

    À vous de réutiliser vos connaissances.

---

## Choisissez votre niveau

Vous choisissez **vous-mêmes** le niveau que vous souhaitez défendre.

Le niveau fixe les contraintes minimales de conception. **Il ne fournit pas la solution.**

### Socle — un pare-feu

La DMZ de votre site doit être construite autour d'**un seul pare-feu**.

Vous devez l'intégrer à l'infrastructure existante et être capables d'identifier les limites de votre proposition.

### Avancé — deux pare-feux

La DMZ doit reposer sur **deux pare-feux** et constituer un véritable **sas de sécurité** entre les réseaux exposés et le système d'information interne.

Votre proposition doit respecter les principes recommandés par l'ANSSI pour la protection d'une zone exposée à Internet.

À vous de concevoir ce sas et de l'intégrer au réseau existant.

### Expert — haute disponibilité

Votre proposition doit satisfaire les exigences du niveau **Avancé** et maintenir les fonctions essentielles de la DMZ en cas de **panne d'un pare-feu**.

Vous devrez notamment prendre en compte les conséquences de cette exigence sur l'adressage, le routage, le réseau physique et le brassage, ainsi que les éventuels nouveaux points uniques de défaillance.

!!! warning "Redondance ≠ haute disponibilité"
    Ajouter des équipements ne suffit pas.

    Vous devez être capables d'expliquer **ce qui se passe réellement lors d'une panne** et pourquoi les communications nécessaires peuvent continuer à fonctionner.

---

## Travail à préparer

Avant l'oral, votre architecture doit être **entièrement conçue théoriquement**.

Vous devez avoir préparé :

1. un **schéma logique** avec le plan d'adressage ;
2. l'analyse du **routage et du NAT** ;
3. une **matrice de flux** et les règles de filtrage envisagées ;
4. la solution retenue pour l'**administration** ;
5. un **schéma physique** ;
6. un **plan de brassage**.

### Schéma logique et adressage

Le schéma doit permettre de comprendre les zones, les équipements, les services, les réseaux, les passerelles et les interfaces utiles.

Les choix d'adressage doivent être cohérents avec le plan existant de SportLudique.

### Routage et NAT

Vous devez être capables d'expliquer le chemin suivi par les paquets et les éventuelles traductions d'adresses.

Vous devrez notamment savoir expliquer un accès depuis Internet vers un service publié, une communication nécessaire avec le réseau interne, un accès du LAN vers Internet et un flux d'administration.

!!! warning "NAT et routage ne sont pas la même chose"
    Vous devez distinguer **l'acheminement d'un paquet** de **la modification éventuelle de son adressage**.

### Matrice de flux et filtrage

Votre matrice doit identifier les communications nécessaires et permettre d'en déduire les règles de filtrage.

| Source | Destination | Service / protocole | Autorisé ? | Justification |
|---|---|---|:---:|---|
| ... | ... | ... | ... | ... |

Chaque autorisation doit correspondre à un **besoin identifié**.

!!! danger "Principe de moindre privilège"
    Tout flux qui n'est pas nécessaire doit être considéré comme **interdit**.

    `ANY → ANY` (PASS ALL) n'est pas une stratégie de sécurité.

### Schéma physique et plan de brassage

Le schéma physique doit représenter les **équipements réellement utilisés, leurs interfaces et leurs connexions**.

Le plan de brassage doit permettre à une autre personne de réaliser le câblage **sans avoir à interpréter votre architecture**.

Il peut être présenté :

- sous la forme d'un **tableau de brassage** ;
- ou directement sur un **schéma physique suffisamment précis**, faisant apparaître clairement le nom des équipements, les interfaces utilisées et les liaisons entre eux.

Dans les deux cas, on doit pouvoir déterminer sans ambiguïté :

**quel équipement → quelle interface → vers quel équipement → quelle interface.**


---

## Modalités de l'évaluation orale

Cette activité constitue un **entraînement à l'épreuve E5**.

L'épreuve E5 prévoit **30 minutes de préparation puis 20 minutes d'interrogation**. Pour cette activité, l'oral est volontairement porté à **30 à 40 minutes si nécessaire** afin de permettre une analyse technique plus approfondie.

Vous commencez par annoncer le niveau choisi et présenter votre architecture. L'enseignant vous interrogera ensuite sur vos choix et pourra vous demander, par exemple, de suivre un paquet, de justifier une route ou une règle de filtrage, d'expliquer un flux d'administration, une liaison physique, une panne ou les conséquences de la compromission d'un élément.

### Vos supports

Tous les éléments doivent avoir été **préparés à l'avance**.

Vous pouvez venir avec des schémas préparés sur support numérique ou papier, ou choisir de **redessiner tout ou partie de votre architecture au tableau**.

!!! warning "Le jour J, vous n'aurez que des feutres et le tableau pour convaincre"
    Le tableau est un support d'explication, pas un temps de conception.

    Si vous choisissez de dessiner votre architecture pendant l'oral, vous devez pouvoir en représenter rapidement les éléments essentiels.

    **Un schéma simple, maîtrisé et expliqué vaut mieux qu'un schéma complexe que vous passez l'oral à dessiner.**

### Grille d'évaluation

Une **grille étudiant** est mise à votre disposition au format PDF. Elle présente les critères et le barème de l'évaluation.

L'enseignant dispose d'une **grille détaillée** lui permettant d'apprécier la maîtrise technique correspondant au niveau choisi.

L'évaluation porte sur votre capacité à **comprendre, expliquer et défendre** votre architecture, et pas uniquement sur la qualité graphique des documents produits.

---

## Validation avant implémentation

!!! danger "Aucune implémentation avant validation"
    Vous travaillez d'abord **uniquement sur la conception**.

    Vous ne devez modifier ni l'infrastructure existante ni la configuration des pare-feux avant l'oral.

    **L'implémentation ne commencera qu'après validation explicite de votre architecture par l'enseignant.**

    Si des corrections sont demandées, vos documents devront être mis à jour avant le déploiement.

> **Concevoir → Préparer → Présenter → Défendre → Faire valider → Implémenter**

