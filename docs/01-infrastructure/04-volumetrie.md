# Organisation des sites

## Organisation de l'entreprise et volumétrie des sites

SportLudique est organisé autour de plusieurs services métiers répartis sur ses différents sites.

Le site de **Chartres** constitue le siège de l'entreprise. Il concentre notamment la direction générale ainsi qu'une part importante des fonctions administratives et informatiques.

Les autres sites disposent des services nécessaires à leur activité et de relais locaux pour certaines fonctions.

### Répartition des utilisateurs

| Service                     | Chartres |   Tours | Orléans | Bourges |  Blois |
| --------------------------- | -------: | ------: | ------: | ------: | -----: |
| Direction et administration |       12 |       5 |       4 |       4 |      3 |
| Ressources humaines         |       14 |       6 |       5 |       4 |      3 |
| Comptabilité et finance     |       24 |      10 |       8 |       7 |      5 |
| Commercial                  |       62 |      40 |      25 |      20 |     16 |
| Logistique                  |       78 |      55 |      30 |      25 |     20 |
| Informatique / DSI          |       26 |       8 |       5 |       4 |      3 |
| **Total**                   |  **216** | **124** |  **77** |  **64** | **50** |

Ces effectifs correspondent aux utilisateurs habituels de chaque site. Ils constituent une première donnée permettant d'évaluer les besoins de l'infrastructure.

!!! info "Un utilisateur n'est pas une adresse IP"
    Le nombre d'utilisateurs ne correspond pas nécessairement au nombre d'adresses IP nécessaires.

    Un utilisateur peut disposer de plusieurs équipements et certains équipements connectés au réseau ne sont associés à aucun utilisateur.

    Le dimensionnement du réseau devra donc prendre en compte l'ensemble des équipements à connecter.

### Parc informatique

Le parc utilisateur est constitué de postes fixes et d'ordinateurs portables.

| Site     | Postes fixes | Portables |   Total |
| -------- | -----------: | --------: | ------: |
| Chartres |          175 |        65 | **240** |
| Tours    |           95 |        40 | **135** |
| Orléans  |           60 |        25 |  **85** |
| Bourges  |           50 |        20 |  **70** |
| Blois    |           38 |        18 |  **56** |

À ces postes viennent s'ajouter différents équipements nécessitant eux aussi une connexion au réseau.

### Autres équipements

Chaque site dispose notamment :

* de serveurs physiques ou virtuels ;
* d'imprimantes et de copieurs réseau ;
* de téléphones IP ;
* de points d'accès Wi-Fi ;
* d'équipements réseau administrables ;
* de pare-feux et autres équipements de sécurité.

Le nombre exact de certains de ces équipements pourra évoluer au cours du projet.

Les équipements destinés aux visiteurs ou les équipements personnels autorisés à utiliser le Wi-Fi ne doivent pas être considérés comme appartenant au parc informatique interne de l'entreprise.

### Une infrastructure segmentée

Les différents services de l'entreprise n'ont pas les mêmes besoins et ne doivent pas nécessairement pouvoir communiquer librement entre eux.

Par exemple, les postes du service commercial n'ont aucune raison d'accéder directement aux postes du service comptabilité, tandis que certains serveurs doivent être accessibles depuis plusieurs services.

Vous devrez donc proposer une **segmentation logique du réseau**, notamment à l'aide de VLAN.

!!! question "Concevoir avant de configurer"
    Avant de créer vos VLAN ou de configurer vos commutateurs, vous devrez déterminer :

    * quels usages doivent être séparés ;
    * quels équipements appartiennent à chaque réseau ;
    * combien d'adresses sont nécessaires ;
    * quelle marge d'évolution doit être conservée ;
    * quelles communications devront ensuite être autorisées entre ces réseaux.

    Vos choix devront pouvoir être expliqués et justifiés.

## Plan d'adressage IP

SportLudique dispose pour ses réseaux internes du bloc d'adresses privées suivant :

```text
172.28.0.0/16
```

Ce bloc devra permettre d'adresser l'ensemble des sites et des différents réseaux nécessaires au fonctionnement de l'entreprise.

Chaque site devra disposer d'un espace d'adressage cohérent permettant d'identifier facilement son infrastructure et d'accueillir les différents sous-réseaux nécessaires.

Le plan d'adressage devra notamment prendre en compte :

* les différents services métiers ;
* les serveurs ;
* les équipements d'administration ;
* la téléphonie IP ;
* les réseaux Wi-Fi employés et visiteurs ;
* les équipements d'infrastructure ;
* les éventuels besoins spécifiques qui apparaîtront au cours du projet.

Vous êtes libres de proposer le découpage qui vous semble le plus pertinent à condition de respecter le bloc d'adressage attribué à SportLudique.

Deux groupes peuvent donc proposer des plans différents et obtenir tous les deux une solution techniquement correcte.

### Adresses statiques et dynamiques

Tous les équipements ne nécessitent pas le même mode d'adressage.

Les équipements d'infrastructure et les serveurs nécessitant une adresse stable devront disposer d'une adresse déterminée conformément au plan d'adressage.

Les postes utilisateurs et les équipements pour lesquels une configuration dynamique est pertinente pourront obtenir leur configuration à travers le service DHCP.

Les plages réservées aux équipements configurés statiquement seront placées dans les **adresses les plus hautes des sous-réseaux concernés**.

!!! tip "Votre plan d'adressage est une documentation"
    Une adresse IP choisie aujourd'hui devra encore pouvoir être comprise plusieurs mois plus tard par un autre administrateur.

    Votre plan doit permettre de déterminer rapidement **où se trouve un équipement, à quel réseau il appartient et quelle est la fonction de ce réseau**.

### Documentation dans phpIPAM

La gestion du plan d'adressage devra être tenue à jour dans la solution [**phpIPAM**](https://ipam.sio.lyceefulbert.fr/index.php?page=login) mise à disposition par vos enseignants.

La documentation du plan d'adressage fait partie intégrante de l'administration de l'infrastructure.

Une adresse utilisée dans l'infrastructure mais absente de l'IPAM pourra être considérée comme une adresse dont l'utilisation n'est pas maîtrisée.

!!! question "Vérifiez votre conception"
    Pour chaque sous-réseau que vous proposez, vous devez être capables de répondre aux questions suivantes :

    * Quelle est son adresse réseau ?
    * Quel est son préfixe ?
    * Combien d'adresses utilisables offre-t-il ?
    * Combien d'équipements doit-il accueillir actuellement ?
    * Quelle marge reste disponible ?
    * Quelle est la première adresse utilisable ?
    * Quelle est la dernière adresse utilisable ?
    * Quelle est son adresse de broadcast ?
    * À quel usage ou service ce réseau est-il destiné ?

    Si vous ne pouvez pas répondre à ces questions, votre plan d'adressage n'est probablement pas encore terminé.


## Vérifiez votre compréhension

<quiz>
Un sous-réseau IPv4 en `/24` permet classiquement d'attribuer combien d'adresses à des hôtes ?

* [ ] 256
* [x] 254
* [ ] 252
* [ ] 128

Un `/24` contient **256 adresses** au total.

Dans un sous-réseau IPv4 classique, l'adresse réseau et l'adresse de broadcast ne peuvent pas être attribuées à des hôtes. Il reste donc **254 adresses utilisables**. 
</quiz>


<quiz>
Pourquoi le nombre d'utilisateurs d'un site ne suffit-il pas à déterminer le nombre d'adresses IP nécessaires ?

* [ ] Chaque utilisateur doit obligatoirement disposer de plusieurs adresses IP.
* [x] Des équipements autres que les postes utilisateurs doivent également être connectés au réseau.
* [ ] Les serveurs n'utilisent pas le même système d'adressage que les postes utilisateurs.
* [ ] Le nombre d'adresses IP dépend uniquement du nombre de services de l'entreprise.

Le réseau doit également accueillir des serveurs, des imprimantes, des téléphones IP, des bornes Wi-Fi ou encore des équipements réseau. De plus, un utilisateur peut disposer de plusieurs équipements.

Le dimensionnement doit donc être réalisé à partir des **équipements à adresser**, et non du seul nombre d'utilisateurs. </quiz>

<quiz>
Le site de Chartres possède 240 postes de travail. Peut-on en conclure qu'un réseau `/24` sera suffisant pour accueillir son infrastructure ?

* [ ] Oui, car un `/24` permet d'utiliser 256 adresses pour les équipements.
* [ ] Oui, puisque 240 est inférieur à 254.
* [x] Non, le nombre de postes ne représente qu'une partie des équipements qui devront être adressés.
* [ ] Non, car un `/24` ne permet d'adresser que 128 équipements.

Un `/24` offre **254 adresses utilisables pour des hôtes**, mais les postes de travail ne constituent qu'une partie de l'infrastructure.

Il faut également prendre en compte les autres équipements, la segmentation du réseau et la marge d'évolution avant de choisir les préfixes adaptés. </quiz>

<quiz>
Pourquoi peut-il être pertinent de placer les services RH, Comptabilité et Commercial dans des réseaux différents ?

* [ ] Pour permettre aux postes de communiquer plus rapidement avec Internet.
* [ ] Parce qu'un VLAN ne peut contenir que les machines d'un seul bureau.
* [x] Pour segmenter le réseau et contrôler les communications entre des populations ayant des besoins différents.
* [ ] Parce que chaque service doit obligatoirement posséder son propre serveur DHCP.

La segmentation permet de **maîtriser les communications entre les différentes parties du système d'information**.

Créer un VLAN par service n'est cependant pas une règle absolue : le découpage retenu doit correspondre aux besoins de l'organisation et pouvoir être justifié. </quiz>

<quiz>
Deux administrateurs proposent des plans d'adressage différents pour un même site. Lequel des deux plans est nécessairement incorrect ?

* [ ] Celui qui utilise plusieurs tailles de sous-réseaux.
* [ ] Celui qui conserve une marge d'évolution.
* [ ] Celui qui utilise plusieurs VLAN.
* [x] Aucun : plusieurs plans différents peuvent répondre correctement aux mêmes besoins.

Il n'existe pas nécessairement une seule solution correcte.

Un plan d'adressage est pertinent s'il **respecte les contraintes, couvre les besoins, utilise raisonnablement l'espace disponible et reste compréhensible et administrable**. </quiz>

