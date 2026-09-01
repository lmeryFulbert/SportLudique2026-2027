# VLSM - Dimensionner un plan d'adressage

## Pourquoi utiliser des sous-réseaux de tailles différentes ?

Lors de la conception d'un réseau, tous les sous-réseaux n'ont généralement pas les mêmes besoins.

Un réseau destiné à 100 postes utilisateurs n'a pas besoin du même nombre d'adresses qu'un réseau contenant 10 serveurs.

Il serait pourtant possible d'attribuer, par exemple, un `/24` à chacun de ces réseaux.

Techniquement, cela fonctionnerait.

Mais ce choix réserverait 254 adresses utilisables aussi bien au réseau de 100 postes qu'au réseau de 10 serveurs.

Le **VLSM (Variable Length Subnet Mask)** consiste à utiliser des préfixes de tailles différentes afin d'adapter chaque sous-réseau à ses besoins.

À l'inverse, avec le **FLSM (Fixed Length Subnet Mask)**, les sous-réseaux créés utilisent tous le même préfixe.

!!! example "Un exemple simple"
    Deux réseaux doivent accueillir respectivement :

    * 100 équipements ;
    * 10 équipements.

    Il n'est pas nécessaire de leur réserver la même quantité d'adresses.

    Le premier pourrait nécessiter un `/25`, alors qu'un `/28` peut accueillir le second.

L'objectif n'est cependant pas de choisir systématiquement le plus petit sous-réseau possible. Un plan d'adressage doit également prévoir une **marge d'évolution raisonnable**.

## Rappel : combien d'hôtes dans un sous-réseau ?

Une adresse IPv4 contient **32 bits**.

Si `n` bits sont disponibles pour identifier les hôtes, le sous-réseau contient :

```text
2^n
```

adresses.

Dans un sous-réseau IPv4 classique, deux d'entre elles ne peuvent pas être attribuées aux équipements :

* l'adresse du réseau ;
* l'adresse de broadcast.

Le nombre d'adresses utilisables est donc :

```text
2^n - 2
```

### Quelques préfixes à connaître

| Préfixe | Adresses totales | Adresses utilisables |
| ------: | ---------------: | -------------------: |
|   `/24` |              256 |                  254 |
|   `/25` |              128 |                  126 |
|   `/26` |               64 |                   62 |
|   `/27` |               32 |                   30 |
|   `/28` |               16 |                   14 |
|   `/29` |                8 |                    6 |

Il n'est pas nécessaire d'apprendre ce tableau par cœur si vous savez retrouver les valeurs.

## Déterminer le préfixe nécessaire

Supposons qu'un réseau doive accueillir **50 équipements**.

Nous recherchons le plus petit nombre de bits permettant de disposer d'au moins 50 adresses utilisables.

Avec 5 bits :

```text
2^5 - 2 = 30
```

Ce n'est pas suffisant.

Avec 6 bits :

```text
2^6 - 2 = 62
```

Le besoin peut être satisfait.

Il faut donc conserver 6 bits pour les hôtes.

Une adresse IPv4 contenant 32 bits :

```text
32 - 6 = 26
```

Le sous-réseau nécessaire est donc un :

```text
/26
```

!!! question "Vérifiez avant de continuer"
    Un réseau doit accueillir **25 équipements**.

    Combien de bits faut-il conserver pour les hôtes ?

    Quel préfixe pouvez-vous en déduire ?

    Vérifiez ensuite que le nombre d'adresses utilisables couvre réellement le besoin.

## Construire un plan VLSM

Prenons le réseau suivant :

```text
192.168.1.0/24
```

Trois sous-réseaux doivent y être créés :

| Sous-réseau |   Besoin |
| ----------- | -------: |
| A           | 50 hôtes |
| B           | 25 hôtes |
| C           | 10 hôtes |

### 1. Trier les besoins

Avant d'attribuer la moindre adresse, classez les sous-réseaux **du plus grand au plus petit**.

Dans notre exemple, ils sont déjà correctement ordonnés :

```text
A : 50 hôtes
B : 25 hôtes
C : 10 hôtes
```

!!! warning "Pourquoi commencer par le plus grand ?"
    Les grands sous-réseaux ont davantage de contraintes de placement.

    Les placer en premier évite de fragmenter l'espace disponible et de se retrouver ensuite sans plage correctement alignée pour les accueillir.

### 2. Déterminer les préfixes

Pour le réseau A :

```text
50 hôtes
2^6 - 2 = 62

→ /26
```

Pour le réseau B :

```text
25 hôtes
2^5 - 2 = 30

→ /27
```

Pour le réseau C :

```text
10 hôtes
2^4 - 2 = 14

→ /28
```

Nous savons maintenant **quelle taille réserver à chaque réseau**.

Il reste à déterminer où les placer.

### 3. Placer le premier sous-réseau

Le réseau initial commence à :

```text
192.168.1.0
```

Le réseau A utilise un `/26`, soit un bloc de :

```text
2^6 = 64 adresses
```

Il occupe donc les adresses :

```text
192.168.1.0
        ↓
192.168.1.63
```

On obtient :

```text
Adresse réseau     : 192.168.1.0
Première adresse   : 192.168.1.1
Dernière adresse   : 192.168.1.62
Broadcast          : 192.168.1.63
```

Le prochain espace disponible commence donc à :

```text
192.168.1.64
```

### 4. Continuer avec les réseaux suivants

Le réseau B nécessite un `/27`, soit 32 adresses.

Il commence à `192.168.1.64` et occupe donc :

```text
192.168.1.64 → 192.168.1.95
```

Le réseau suivant peut commencer à :

```text
192.168.1.96
```

Le réseau C utilise un `/28`, soit 16 adresses :

```text
192.168.1.96 → 192.168.1.111
```

Le résultat peut être documenté dans un tableau.

| Réseau | Besoin | Préfixe | Adresse réseau | Première adresse | Dernière adresse | Broadcast       |
| ------ | -----: | ------: | -------------- | ---------------- | ---------------- | --------------- |
| A      |     50 |   `/26` | `192.168.1.0`  | `192.168.1.1`    | `192.168.1.62`   | `192.168.1.63`  |
| B      |     25 |   `/27` | `192.168.1.64` | `192.168.1.65`   | `192.168.1.94`   | `192.168.1.95`  |
| C      |     10 |   `/28` | `192.168.1.96` | `192.168.1.97`   | `192.168.1.110`  | `192.168.1.111` |

## La méthode à retenir

Pour construire un plan d'adressage VLSM :

1. **Lister les réseaux nécessaires et leurs besoins.**
2. **Prévoir la marge d'évolution nécessaire.**
3. **Trier les réseaux du plus grand au plus petit.**
4. **Déterminer le préfixe adapté à chaque besoin.**
5. **Placer le plus grand réseau en premier.**
6. **Continuer à partir de la première adresse disponible.**
7. **Vérifier l'ensemble du plan d'adressage.**
8. **Documenter le résultat.**

!!! danger "Une erreur peut se propager"
    Une erreur sur la taille ou les limites d'un sous-réseau peut entraîner un chevauchement avec les réseaux suivants.

    Ne vous contentez donc pas d'obtenir un résultat : **vérifiez-le**.

## Vérifier son plan d'adressage

Pour chaque sous-réseau, vous devez être capables de déterminer :

* son adresse réseau ;
* son préfixe ;
* son nombre d'adresses utilisables ;
* sa première adresse utilisable ;
* sa dernière adresse utilisable ;
* son adresse de broadcast.

Vous devez également vérifier que :

* le réseau peut accueillir tous les équipements prévus ;
* une marge d'évolution suffisante est disponible ;
* aucun sous-réseau ne chevauche un autre sous-réseau ;
* tous les sous-réseaux restent à l'intérieur du bloc d'adresses qui vous a été attribué.

## Application à SportLudique

Vous disposez maintenant de la méthode permettant de dimensionner les différents réseaux de votre infrastructure.

Pour SportLudique, vous ne recevrez cependant pas directement une liste telle que :

```text
Réseau A : 50 hôtes
Réseau B : 25 hôtes
Réseau C : 10 hôtes
```

Vous disposez de la **volumétrie réelle des différents sites et services de l'entreprise**.

À partir de ces informations, vous devrez commencer par déterminer vous-mêmes :

* les réseaux dont votre site a besoin ;
* les équipements qu'ils devront accueillir ;
* leur taille actuelle ;
* la marge d'évolution à conserver.

Vous pourrez seulement ensuite construire votre plan d'adressage.

!!! question "Du besoin métier au réseau"
    Pour votre site SportLudique, commencez par produire un tableau contenant au minimum :


| Usage ou service | Équipements actuels | Marge prévue | Besoin retenu | Préfixe |
| --- | ---: | ---: | ---: | --- |
| ... | ... | ... | ... | ... |

**Ne configurez encore aucun équipement.**

Votre première tâche consiste à proposer et à justifier votre plan d'adressage.


## Vérifiez votre compréhension

<quiz>
Un sous-réseau doit accueillir 50 équipements. Quel est le plus petit préfixe permettant de répondre à ce besoin ?

* [ ] `/27`
* [x] `/26`
* [ ] `/25`
* [ ] `/24`

Un `/27` ne fournit que 30 adresses utilisables.

Un `/26` contient 64 adresses, soit **62 adresses utilisables** après retrait de l'adresse réseau et de l'adresse de broadcast. Il permet donc d'accueillir les 50 équipements. </quiz>

<quiz>
Pourquoi commence-t-on généralement un plan VLSM par les sous-réseaux ayant les besoins les plus importants ?

* [ ] Parce que les grands réseaux doivent obligatoirement avoir les adresses les plus basses.
* [ ] Parce que cela améliore les performances du routage.
* [x] Pour placer d'abord les réseaux ayant les contraintes de taille les plus importantes et éviter de fragmenter l'espace disponible.
* [ ] Parce que les petits réseaux ne possèdent pas d'adresse de broadcast.

Les grands sous-réseaux sont les plus difficiles à placer.

Les traiter en premier permet ensuite d'utiliser les espaces restants pour les réseaux plus petits et réduit le risque de se retrouver sans bloc suffisamment grand. </quiz>

<quiz>
Un administrateur doit créer un réseau pour 25 équipements. Il choisit un `/28`. Son choix est-il correct ?

* [ ] Oui, un `/28` fournit 28 adresses utilisables.
* [ ] Oui, car 25 est inférieur à 28.
* [x] Non, un `/28` ne fournit que 14 adresses utilisables.
* [ ] Non, il faut obligatoirement utiliser un `/24`.

Un `/28` conserve 4 bits pour les hôtes :

`2^4 - 2 = 14`

Ce réseau est donc trop petit pour 25 équipements.

Il faut rechercher le préfixe suivant capable de satisfaire le besoin. </quiz>

<quiz>
Le réseau `192.168.1.0/26` a déjà été attribué. Quelle est la première adresse réseau pouvant être utilisée immédiatement après ce bloc ?

* [ ] `192.168.1.1`
* [ ] `192.168.1.62`
* [ ] `192.168.1.63`
* [x] `192.168.1.64`

Un `/26` contient 64 adresses.

Le réseau `192.168.1.0/26` occupe donc toute la plage allant de `192.168.1.0` à `192.168.1.63`.

La première adresse disponible après ce bloc est `192.168.1.64`. </quiz>

<quiz>
Un plan d'adressage contient les deux sous-réseaux suivants :

`192.168.1.0/26`

`192.168.1.32/27`

Quel est le problème ?

* [ ] Le `/27` est plus petit que le `/26`.
* [x] Les deux sous-réseaux se chevauchent.
* [ ] Il est interdit d'utiliser plusieurs préfixes dans le même plan d'adressage.
* [ ] Le deuxième réseau devrait obligatoirement commencer par `.33`.

Le réseau `192.168.1.0/26` occupe les adresses de `192.168.1.0` à `192.168.1.63`.

`192.168.1.32` appartient donc déjà à ce sous-réseau.

Les deux plages se **chevauchent** : ce plan d'adressage est incorrect. </quiz>

<quiz>
Deux réseaux doivent accueillir respectivement 100 et 10 équipements. Quelle proposition correspond au principe du VLSM ?

* [ ] Attribuer obligatoirement un `/24` aux deux réseaux.
* [x] Adapter le préfixe de chaque réseau à son besoin.
* [ ] Utiliser le même préfixe pour garantir leur communication.
* [ ] Placer obligatoirement les deux populations dans le même sous-réseau.

Le principe du VLSM consiste précisément à utiliser des **préfixes de longueurs différentes** en fonction des besoins.

Le choix final doit également prendre en compte une marge d'évolution raisonnable. </quiz>


