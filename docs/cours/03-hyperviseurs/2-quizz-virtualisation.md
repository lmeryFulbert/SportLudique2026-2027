# Quiz — Virtualisation

<quiz>
Quelle est la principale caractéristique d’un hyperviseur de type 1 ?

* [ ] Il fonctionne obligatoirement dans une machine virtuelle
* [ ] Il s’exécute au-dessus d’un système d’exploitation hôte
* [x] Il s’exécute directement sur le matériel physique
* [ ] Il ne peut exécuter que des systèmes Linux

Un hyperviseur de type 1, ou *bare-metal*, s’exécute directement sur le matériel physique, sans système d’exploitation hôte intermédiaire.
</quiz>

<quiz>
Parmi les solutions suivantes, laquelle est un hyperviseur de type 2 ?

* [ ] Proxmox VE
* [ ] KVM
* [x] VirtualBox
* [ ] VMware ESXi

VirtualBox est un hyperviseur de type 2 : il s’exécute au-dessus d’un système d’exploitation hôte comme Windows, Linux ou macOS.
</quiz>

<quiz>
Pourquoi les hyperviseurs de type 1 sont-ils généralement privilégiés en production ?

* [ ] Ils ne nécessitent aucune ressource matérielle
* [x] Ils offrent généralement de meilleures performances et sont adaptés aux infrastructures de production
* [ ] Ils sont toujours plus simples à installer
* [ ] Ils fonctionnent uniquement sur des postes clients

Leur accès plus direct aux ressources matérielles les rend particulièrement adaptés aux datacenters et aux environnements de production.
</quiz>

<quiz>
Dans un hyperviseur de type 2, quelle couche se trouve entre l’hyperviseur et le matériel physique ?

* [ ] Un SAN
* [ ] Un autre hyperviseur
* [x] Un système d’exploitation hôte
* [ ] Un contrôleur de domaine

Un hyperviseur de type 2 repose sur un système d’exploitation hôte, qui constitue une couche supplémentaire entre l’hyperviseur et le matériel.
</quiz>

<quiz>
Un étudiant souhaite exécuter plusieurs systèmes d’exploitation de test sur son poste Windows tout en conservant Windows comme système principal. Quelle solution est la plus adaptée ?

* [ ] Ceph
* [ ] Proxmox VE
* [x] VirtualBox
* [ ] Nutanix

VirtualBox est un hyperviseur de type 2 particulièrement adapté au développement, au test et à l’apprentissage sur un poste disposant déjà d’un système d’exploitation.
</quiz>

<quiz>
Quels sont les trois piliers intégrés dans une architecture hyperconvergée ?

* [ ] DNS, DHCP et routage
* [ ] Utilisateurs, applications et bases de données
* [x] Calcul, stockage et réseau
* [ ] Sauvegarde, antivirus et pare-feu

L’hyperconvergence regroupe dans une même plateforme le calcul, le stockage et le réseau.
</quiz>

<quiz>
Quel principe de stockage est généralement associé à une infrastructure hyperconvergée ?

* [ ] Le stockage doit obligatoirement être placé sur un SAN externe
* [x] Les disques de plusieurs nœuds peuvent être agrégés et gérés par logiciel
* [ ] Chaque machine virtuelle doit disposer de son propre disque physique
* [ ] Le stockage ne peut pas être réparti entre plusieurs serveurs

L’hyperconvergence s’appuie notamment sur le stockage défini par logiciel (SDS) afin de mutualiser les ressources de stockage du cluster.
</quiz>

<quiz>
Que signifie la « scalabilité » d’une infrastructure hyperconvergée ?

* [ ] Il faut remplacer tous les serveurs lorsqu’on manque de ressources
* [ ] Il suffit d’ajouter des disques à un serveur central
* [x] On peut ajouter des nœuds pour augmenter progressivement la capacité
* [ ] Le nombre de machines virtuelles diminue automatiquement

Une infrastructure hyperconvergée peut évoluer par ajout de nœuds afin d’augmenter progressivement les ressources disponibles.
</quiz>

<quiz>
Quelle solution de stockage distribué peut être utilisée avec Proxmox VE pour construire une infrastructure hyperconvergée ?

* [ ] ZFS local uniquement
* [ ] NTFS
* [ ] LXC
* [x] Ceph

Ceph agrège les disques de plusieurs nœuds afin de fournir un stockage distribué et résilient. Proxmox VE peut utiliser Ceph, mais son utilisation n’est pas obligatoire.
</quiz>

<quiz>
Quelle solution de stockage défini par logiciel est proposée par VMware pour construire une infrastructure hyperconvergée ?

* [ ] Ceph
* [x] VMware vSAN
* [ ] LXC
* [ ] ZFS

VMware propose vSAN pour mutualiser les ressources de stockage des serveurs d’un cluster.
</quiz>

<quiz>
Quel est le nom de l’hyperviseur proposé par Nutanix ?

* [ ] ESXi
* [ ] KVM
* [ ] LXC
* [x] AHV

Nutanix propose son propre hyperviseur, appelé AHV (*Acropolis Hypervisor*).
</quiz>

<quiz>
Pourquoi Nutanix constitue-t-il un exemple d’infrastructure hyperconvergée ?

* [ ] Il fonctionne uniquement sur un poste de travail
* [ ] Il utilise obligatoirement VMware Workstation
* [x] Il regroupe notamment les ressources de calcul et de stockage de plusieurs serveurs dans un même cluster
* [ ] Il ne permet pas de créer de machines virtuelles

Nutanix est une plateforme HCI qui regroupe notamment les ressources de calcul et de stockage de plusieurs serveurs dans un cluster administré comme un ensemble cohérent.
</quiz>

<quiz>
Quelle infrastructure de virtualisation est actuellement utilisée pour les services pédagogiques du BTS SIO au lycée ?

* [ ] Nutanix
* [ ] VMware vSphere
* [ ] Hyper-V
* [x] Un cluster Proxmox

L’ancienne infrastructure Nutanix a été remplacée par un cluster Proxmox, notamment pour des raisons de coût.
</quiz>

<quiz>
Quelle technologie Proxmox VE utilise-t-il principalement pour exécuter des machines virtuelles ?

* [ ] VirtualBox
* [ ] Xen
* [x] KVM
* [ ] VMware Workstation

Proxmox VE s’appuie sur KVM (*Kernel-based Virtual Machine*) pour exécuter les machines virtuelles.
</quiz>

<quiz>
Quelle technologie Proxmox VE utilise-t-il pour exécuter des conteneurs Linux ?

* [ ] Docker exclusivement
* [x] LXC
* [ ] Hyper-V
* [ ] vSAN

Proxmox VE prend en charge les conteneurs Linux grâce à LXC.
</quiz>

<quiz>
À quoi servent notamment les extensions Intel VT-x et AMD-V utilisées par KVM ?

* [ ] À accélérer les communications réseau
* [ ] À créer un stockage distribué
* [x] À fournir une assistance matérielle à la virtualisation
* [ ] À chiffrer les sauvegardes

KVM utilise les extensions matérielles Intel VT-x ou AMD-V pour permettre l’exécution efficace des machines virtuelles.
</quiz>

<quiz>
Quelle fonctionnalité permet de déplacer une machine virtuelle en fonctionnement d’un nœud vers un autre ?

* [ ] La réplication ZFS
* [ ] La haute disponibilité
* [x] La migration en direct
* [ ] La sauvegarde

La migration en direct permet de déplacer une machine virtuelle en fonctionnement entre deux nœuds du cluster.
</quiz>

<quiz>
Quel système de stockage est utilisé sur les nœuds de notre cluster Proxmox ?

* [ ] Ceph
* [ ] VMware vSAN
* [x] ZFS
* [ ] NTFS

Notre infrastructure pédagogique n’utilise pas Ceph. Chaque nœud Proxmox dispose de son propre stockage local basé sur ZFS.
</quiz>

<quiz>
À quoi sert la réplication ZFS dans notre infrastructure Proxmox ?

* [ ] À partager en permanence le même stockage entre tous les nœuds
* [x] À copier périodiquement les données d’une VM vers un autre nœud
* [ ] À remplacer le mécanisme de haute disponibilité
* [ ] À déplacer une VM en fonctionnement

La réplication ZFS copie périodiquement les données d’une machine virtuelle vers un autre nœud afin qu’une copie récente soit disponible.
</quiz>

<quiz>
Quel est le rôle de la haute disponibilité (HA) dans notre cluster Proxmox ?

* [ ] Répliquer périodiquement les données ZFS
* [ ] Transformer le stockage ZFS en stockage Ceph
* [ ] Déplacer systématiquement toutes les VM entre les nœuds
* [x] Redémarrer une VM sur un autre nœud lorsqu’un nœud devient indisponible

La HA surveille les ressources du cluster et permet de redémarrer une machine virtuelle sur un autre nœud en cas d’indisponibilité de son nœud d’origine.
</quiz>

<quiz>
Un nœud Proxmox tombe brutalement en panne. Une VM configurée en HA possède une réplication ZFS sur un autre nœud. Que peut-il se passer ?

* [ ] La VM continue à fonctionner sur le serveur en panne
* [ ] La VM est automatiquement transformée en conteneur LXC
* [x] La VM peut être redémarrée sur un autre nœud à partir des données répliquées
* [ ] Aucune donnée ne peut être perdue

La HA peut redémarrer la VM sur un autre nœud. Cependant, la réplication ZFS étant périodique, les modifications effectuées depuis la dernière réplication peuvent être perdues.
</quiz>

<quiz>
Quelle différence essentielle existe entre Ceph et le stockage utilisé dans notre cluster Proxmox ?

* [ ] Ceph est un hyperviseur alors que ZFS est un système d’exploitation
* [ ] ZFS permet uniquement de stocker des conteneurs
* [x] Ceph fournit un stockage distribué entre les nœuds, tandis que notre infrastructure utilise des stockages ZFS locaux avec réplication
* [ ] Il n’existe aucune différence pour le fonctionnement du cluster

Avec Ceph, le stockage est distribué entre plusieurs nœuds. Dans notre infrastructure, chaque nœud possède son stockage ZFS local et certaines données sont répliquées périodiquement vers d’autres nœuds.
</quiz>

<quiz>
Une entreprise souhaite regrouper calcul et stockage sur plusieurs serveurs, pouvoir ajouter progressivement des nœuds et améliorer la résilience de son infrastructure. Quel concept correspond le mieux à ce besoin ?

* [ ] La virtualisation de type 2
* [ ] La sauvegarde locale
* [ ] La réplication DNS
* [x] L’hyperconvergence

L’hyperconvergence combine notamment calcul, stockage et réseau dans un cluster et permet de faire évoluer l’infrastructure par ajout de nœuds.
</quiz>