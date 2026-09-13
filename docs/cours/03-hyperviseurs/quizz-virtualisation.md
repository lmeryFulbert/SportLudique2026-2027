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
* [ ] Xen

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
Quelle solution de stockage distribué est mise en avant avec Proxmox dans ce chapitre ?

* [ ] vSAN
* [ ] NTFS
* [ ] LXC
* [x] Ceph

Ceph permet d’agréger les disques présents dans plusieurs nœuds afin de fournir un stockage distribué et résilient.
</quiz>

<quiz>
Que signifie la « scalabilité linéaire » d’une infrastructure hyperconvergée ?

* [ ] Il faut remplacer tous les serveurs lorsqu’on manque de ressources
* [ ] Il suffit d’ajouter des disques à un serveur central
* [x] On peut ajouter des nœuds pour augmenter progressivement la capacité
* [ ] Le nombre de machines virtuelles diminue automatiquement

Une architecture hyperconvergée peut évoluer par ajout de nœuds, ce qui permet d’augmenter progressivement les ressources disponibles.
</quiz>

<quiz>
Quelle technologie Proxmox VE utilise-t-il pour la virtualisation matérielle ?

* [ ] VirtualBox
* [ ] Xen
* [x] KVM
* [ ] VMware Workstation

Proxmox VE s’appuie sur KVM (*Kernel-based Virtual Machine*) pour la virtualisation matérielle.
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

KVM utilise les extensions matérielles Intel VT-x ou AMD-V afin d’exécuter les machines virtuelles avec des performances proches du natif.
</quiz>

<quiz>
Quelle fonctionnalité permet de déplacer une machine virtuelle en fonctionnement d’un nœud vers un autre ?

* [ ] Le DHCP Relay
* [ ] La réplication DNS
* [x] La migration en direct
* [ ] La paravirtualisation

La migration en direct permet de déplacer une machine virtuelle entre des hôtes sans devoir arrêter préalablement la machine virtuelle.
</quiz>

<quiz>
Quelle solution d’hyperconvergence est associée à VMware dans le chapitre ?

* [ ] Ceph
* [x] VMware vSAN
* [ ] Azure Stack HCI
* [ ] LXC

VMware vSAN combine stockage et calcul sur un même cluster de serveurs.
</quiz>

<quiz>
Quelle solution hyperconvergée est associée à Microsoft dans le chapitre ?

* [ ] VMware vSAN
* [ ] Nutanix AHV
* [x] Azure Stack HCI
* [ ] VirtualBox Cluster

Le chapitre présente Azure Stack HCI comme la solution hyperconvergée proposée par Microsoft.
</quiz>

<quiz>
Quel est le nom de l’hyperviseur propre à Nutanix ?

* [ ] ESXi
* [ ] KVM
* [ ] Dom0
* [x] AHV

Nutanix intègre son propre hyperviseur, appelé Acropolis Hypervisor (AHV).
</quiz>

<quiz>
Dans l’architecture Xen, quel domaine privilégié gère les interactions avec le matériel et les pilotes ?

* [ ] DomU
* [x] Dom0
* [ ] HVM
* [ ] LXC

Dans Xen, Dom0 est le domaine privilégié chargé notamment de la gestion du matériel et des pilotes. Les domaines invités sont appelés DomU.
</quiz>

<quiz>
Quelle affirmation décrit correctement la paravirtualisation (PV) présentée avec Xen ?

* [ ] Elle impose l’utilisation de Windows
* [ ] Elle repose obligatoirement sur Intel VT-x ou AMD-V
* [x] Elle nécessite un système d’exploitation invité modifié
* [ ] Elle interdit l’utilisation de plusieurs machines virtuelles

Dans le mode PV de Xen, le système d’exploitation invité doit être modifié pour fonctionner efficacement avec l’hyperviseur.
</quiz>

<quiz>
Un étudiant souhaite exécuter plusieurs systèmes d’exploitation de test sur son poste Windows. Il veut conserver Windows comme système principal. Quelle solution correspond le mieux à ce besoin ?

* [ ] Ceph
* [ ] Xen
* [x] VirtualBox
* [ ] Un cluster Nutanix

VirtualBox est un hyperviseur de type 2 particulièrement adapté au développement, au test et à l’apprentissage sur un poste disposant déjà d’un système d’exploitation.
</quiz>

<quiz>
Une entreprise souhaite regrouper calcul et stockage sur plusieurs serveurs, pouvoir ajouter progressivement des nœuds et améliorer la résilience de son infrastructure. Quel concept correspond le mieux à ce besoin ?

* [ ] La virtualisation de type 2
* [ ] La paravirtualisation
* [ ] Le stockage sur un poste local
* [x] L’hyperconvergence

L’hyperconvergence combine notamment calcul, stockage et réseau dans un cluster et permet de faire évoluer l’infrastructure par ajout de nœuds.
</quiz>