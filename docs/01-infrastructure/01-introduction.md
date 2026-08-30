# Organisation de l'infrastructure

Cette page présente les règles communes utilisées pour construire l'infrastructure de **SportLudique**.

Contrairement aux services et aux réseaux locaux que vous allez mettre en place au cours de l'année, certaines parties de l'infrastructure sont déjà fournies et administrées par vos enseignants. Elles permettent notamment d'interconnecter les différents groupes et de fournir les services communs nécessaires à vos travaux.

## Répartition des sites

SportLudique est organisée autour de cinq sites :

* **Chartres**
* **Orléans**
* **Tours**
* **Bourges**
* **Blois**

Chaque groupe est responsable de l'infrastructure d'un site.

Vous disposez donc de votre propre réseau local, de vos équipements et de vos serveurs. Vous êtes responsables de leur installation, de leur configuration et de leur administration.

L'infrastructure permettant de relier les différents sites entre eux est en revanche **gérée par vos enseignants**.

!!! info "Répartition des responsabilités"
    **Vous administrez :** <br/>
    - le réseau local de votre site ;<br/>
    - vos équipements réseau ;<br/>
    - vos hyperviseurs et machines virtuelles ;<br/>
    - vos serveurs Windows et Linux ;<br/>
    - vos services ;<br/>
    - votre domaine Active Directory ;<br/>
    - la sécurité de votre infrastructure.<br/>

    **Vos enseignants administrent :**<br/>
    - l'infrastructure d'interconnexion entre les sites ;<br/>
    - la zone DNS principale `sportludique.fr` ;<br/>
    - les services communs nécessaires au fonctionnement de l'environnement.


## Organisation DNS

Le domaine utilisé par l'entreprise est :

```text
sportludique.fr
```

La zone principale `sportludique.fr` est administrée par vos enseignants.

Chaque site dispose ensuite de sa propre **sous-zone DNS déléguée** :

```text
chartres.sportludique.fr
orleans.sportludique.fr
tours.sportludique.fr
bourges.sportludique.fr
blois.sportludique.fr
```

Vous êtes responsables de l'administration de la zone correspondant à votre site.

### Services accessibles depuis l'extérieur

Les services publiés devront respecter la convention de nommage suivante :

```text
<service>.<ville>.sportludique.fr
```

Par exemple :

```text
www.chartres.sportludique.fr
ftp.blois.sportludique.fr
mail.tours.sportludique.fr
```

Le nom utilisé doit permettre d'identifier facilement le service proposé.

Quelques conventions classiques pourront être utilisées :

| Service    | Exemple |
| ---------- | ------- |
| Web        | `www`   |
| DNS        | `ns`    |
| Envoi mail | `smtp`  |

## Domaine Active Directory

Chaque site construira son propre domaine Active Directory.

L'utilisation d'un domaine inventé comme `sportludique.local` est à éviter.

Le suffixe `.local` est notamment utilisé par mDNS (Multicast DNS) et son utilisation comme domaine Active Directory peut provoquer des conflits avec certains systèmes et services.

!!! warning "Attention aux tutoriels"
    De nombreux tutoriels disponibles sur Internet utilisent encore des domaines comme `entreprise.local`, `mondomaine.local` ou proposent leur propre convention de nommage.

    Ces tutoriels peuvent parfaitement vous aider à comprendre et à réaliser une installation, mais **vous ne devez pas reproduire leur configuration à l'identique**.

    Vous intervenez dans une infrastructure existante qui possède ses propres contraintes et conventions. Vous devrez donc adapter les procédures trouvées à l'organisation DNS de SportLudique.

Nous utiliserons des sous-domaines appartenant au domaine `sportludique.fr` et respectant la convention de nommage définie pour chaque site.

### Convention de nommage

Il faut également tenir compte du nom **NetBIOS** généré lors de la création du domaine Active Directory.

Si tous les groupes utilisent :

```text
lan.<ville>.sportludique.fr
```

le label situé à gauche sera toujours `lan`. Plusieurs domaines se retrouveraient alors avec un nom `NetBIOS` identique, ce qui rendrait leur identification inutilement compliquée.

??? tip "C'est quoi un nom NetBIOS ?"
    **NetBIOS** est un ancien protocole utilisé historiquement dans les réseaux Windows. Il est aujourd'hui considéré comme **dépassé** et les environnements modernes reposent principalement sur DNS.

    Active Directory conserve néanmoins, notamment pour des raisons de compatibilité, un **nom NetBIOS associé au domaine**.

    Ce nom est encore utilisé par certains mécanismes d'authentification et certaines applications. Vous rencontrerez ainsi deux formes courantes d'identification d'un utilisateur Active Directory :

    - le User Principal Name (UPN)

    - le format historique NETBIOS\sAMAccountName.

    Selon l'application utilisée, l'une ou l'autre de ces formes pourra être attendue.


!!! info "Exemple d'authentification"

    Le **nom NetBIOS** est un nom court permettant notamment d'identifier un domaine Active Directory.

    Par exemple, pour le domaine :

    ```
    cha.chartres.sportludique.fr
    ```

    nous utiliserons le nom NetBIOS :

    ```text
    CHA
    ```

    Dans Active Directory, un utilisateur pourra alors être identifié principalement sous deux formes.

    **Avec son User Principal Name (UPN)** :

    ```text
    utilisateur@cha.chartres.sportludique.fr
    ```

    **Avec son `sAMAccountName` associé au nom NetBIOS du domaine** :

    ```text
    CHA\utilisateur
    ```

Le premier format, basé sur l'**UPN**, ressemble à une adresse électronique et est aujourd'hui généralement privilégié.

Le second est le format historique de connexion Windows, souvent appelé **Down-Level Logon Name**. Il reste néanmoins très présent.

Vous rencontrerez les deux au cours de l'année : **selon les systèmes, les applications et les méthodes d'authentification utilisées, l'identifiant attendu pourra être l'UPN ou le `sAMAccountName`.**

Il faudra donc être capable de reconnaître ces deux formes et de fournir celle attendue par le service que vous configurez.

----

Chaque site utilisera donc un préfixe qui lui est propre.

| Site     | Domaine Active Directory       | NetBIOS |
| -------- | ------------------------------ | ------- |
| Chartres | `cha.chartres.sportludique.fr` | `CHA`   |
| Orléans  | `orl.orleans.sportludique.fr`  | `ORL`   |
| Tours    | `trs.tours.sportludique.fr`    | `TRS`   |
| Bourges  | `brg.bourges.sportludique.fr`  | `BRG`   |
| Blois    | `blo.blois.sportludique.fr`    | `BLO`   |

L'organisation obtenue est donc la suivante :

```text
sportludique.fr
│
├── chartres.sportludique.fr
│   └── cha.chartres.sportludique.fr
│       └── NetBIOS : CHA
│
├── orleans.sportludique.fr
│   └── orl.orleans.sportludique.fr
│       └── NetBIOS : ORL
│
├── tours.sportludique.fr
│   └── trs.tours.sportludique.fr
│       └── NetBIOS : TRS
│
├── bourges.sportludique.fr
│   └── brg.bourges.sportludique.fr
│       └── NetBIOS : BRG
│
└── blois.sportludique.fr
    └── blo.blois.sportludique.fr
        └── NetBIOS : BLO
```

!!! important "Une convention commune"
    Ces noms ne sont pas des exemples.

    Ils constituent la **convention de nommage de l'infrastructure SportLudique** et devront être respectés dans les différentes situations professionnelles.

!!! danger "Convention de nommage obligatoire ☠️"
    Le préfixe correspondant à votre site devra également être utilisé pour **nommer toutes vos machines virtuelles** : `CHA-`, `ORL-`, `TRS-`, `BRG-` ou `BLO-`.

    Par exemple : `CHA-DC01`, `BLO-WEB01`, `TRS-DEBIAN01`.

    Toute VM ne respectant pas cette convention pourra être considérée comme non identifiée et **supprimée de l'infrastructure sans préavis**.

---

## Une infrastructure commune

Même si chaque groupe administre son propre site, vous ne travaillez pas sur cinq infrastructures totalement indépendantes.

Au cours de l'année, certaines situations professionnelles nécessiteront donc de faire communiquer vos infrastructures, d'échanger des services ou de mettre en place des mécanismes communs.

Une mauvaise configuration sur votre site pourra alors avoir des conséquences sur les autres.

**Vous êtes administrateurs de votre site, mais votre site fait partie d'une infrastructure plus grande.**
