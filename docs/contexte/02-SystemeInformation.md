# Le système d'information

## L'infrastructure de SportLudique

SportLudique dispose de cinq sites géographiques : **Chartres, Orléans, Tours, Bourges et Blois**.

Ces différents sites sont reliés par une infrastructure opérateur permettant leur interconnexion. Cette partie du réseau est déjà en place et ne relève pas de votre responsabilité.

Pour le reste, **tout est à construire**.

Au cours de l'année, vous allez progressivement concevoir, déployer et administrer l'infrastructure informatique de SportLudique : réseau local, serveurs, services, sécurité, supervision et outils nécessaires au fonctionnement du système d'information.

## Un système d'information hétérogène

L'infrastructure que vous allez construire reposera sur plusieurs environnements.

Les serveurs utiliseront principalement **Windows Server** et **Linux**. La virtualisation sera assurée par une infrastructure basée sur **Proxmox VE**.

Vous serez progressivement amenés à mettre en œuvre les différents services nécessaires au fonctionnement de l'entreprise : authentification des utilisateurs, résolution de noms, attribution des paramètres réseau, partage de ressources, applications web, supervision, assistance aux utilisateurs ou encore sauvegarde.

Ces services ne sont pas déjà installés.

**C'est à vous de les mettre en place.**

Il en va de même pour les réseaux locaux des différents sites : leur architecture, leur segmentation et leur configuration seront réalisées progressivement au cours de l'année.

!!! info "Ce qui est déjà en place"
    L'infrastructure permettant l'interconnexion des différents sites de SportLudique est gérée par l'opérateur.

    Elle est mise à votre disposition et administrée par vos enseignants.

    Tout ce qui se trouve derrière cette infrastructure constitue votre environnement de travail.

## Votre environnement d'administration

Vous disposez d'un poste de travail Linux à partir duquel vous administrerez les différents équipements et serveurs de l'entreprise.

L'administration se fera autant que possible **à distance**, en utilisant les protocoles et les outils adaptés.

Pour les systèmes Linux, vous utiliserez principalement **SSH** :

```bash
ssh utilisateur@serveur
```

Les serveurs Windows pourront également être administrés à distance, notamment avec **winRM**, et lorsque l'utilisation d'une interface graphique est nécessaire, avec le protocole **RDP**.

Depuis un poste Linux, une connexion RDP peut par exemple être établie avec `xfreerdp` :

```bash
xfreerdp /u:utilisateur@domaine /v:serveur
```

Vous pourrez également utiliser **Remmina**, qui permet de gérer graphiquement différentes connexions distantes.

!!! tip "Administrer plutôt que manipuler"
    Un serveur n'a pas vocation à être administré en permanence depuis son interface graphique.

Lorsque cela est possible, on privilégiera donc les installations **Windows Server Core**, plus légères et moins consommatrices de ressources. L'objectif est notamment d'éviter de surcharger inutilement les hyperviseurs avec des interfaces graphiques rarement utilisées.

## Votre mission

Vous ne récupérez donc pas un système d'information déjà construit.

Vous allez partir d'une infrastructure minimale et mettre progressivement en place les différents éléments nécessaires au fonctionnement de SportLudique.

Chaque nouvelle situation professionnelle viendra ajouter une brique : réseau, virtualisation, services Windows et Linux, sécurité, supervision, sauvegarde, automatisation ou haute disponibilité.

À la fin de l'année, l'ensemble de ces réalisations devra former une infrastructure cohérente.

**Le système d'information de SportLudique sera celui que vous aurez construit.**
