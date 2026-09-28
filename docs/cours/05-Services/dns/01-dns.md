# DNS — Principes et architecture

## Le rôle du DNS

Le **DNS (Domain Name System)** permet d'associer des **noms** à des ressources réseau.

Il permet par exemple de retrouver l'adresse IPv4 correspondant à un nom :

```text
www.ville.sportludique.fr  →  adresse IPv4 du serveur Web
```

Sans DNS, les utilisateurs devraient connaître les adresses IP des différents services qu'ils souhaitent utiliser.

!!! info "DNS et adresse IP"
    Le DNS ne remplace pas l'adressage IP.

    Il permet d'utiliser des **noms** pour désigner les ressources et fournit les informations nécessaires pour les localiser.

---

## Deux rôles à ne pas confondre

Dans une infrastructure DNS, il faut distinguer deux fonctions essentielles :

- le **résolveur DNS** ;
- le **serveur DNS faisant autorité**.

Ces deux fonctions peuvent parfois être assurées par une même machine, mais elles répondent à des besoins différents.

### Le résolveur DNS

Le **résolveur** est le serveur interrogé par les postes clients lorsqu'ils cherchent à résoudre un nom.

Par exemple, un poste souhaite connaître l'adresse de :

```text
www.ville.sportludique.fr
```

Il interroge le serveur DNS configuré sur son interface réseau.

Le résolveur recherche alors la réponse ou transmet la demande à un autre serveur DNS capable de la fournir.

```text
Poste client
     │
     │ Où se trouve www.ville.sportludique.fr ?
     ▼
Résolveur DNS
     │
     │ recherche la réponse
     ▼
Infrastructure DNS
```

Le résolveur peut également conserver temporairement les réponses obtenues dans un **cache** afin d'accélérer les requêtes suivantes.

### Le serveur DNS faisant autorité

Un serveur DNS **fait autorité** lorsqu'il est responsable d'une **zone DNS**.

Par exemple, un serveur peut être responsable de la zone :

```text
ville.sportludique.fr
```

Il connaît alors les enregistrements appartenant à cette zone et peut répondre directement pour ceux-ci.

!!! warning "Résolveur ≠ autorité"
    Un serveur qui **cherche une réponse pour un client** joue le rôle de résolveur.

    Un serveur qui **détient les informations officielles d'une zone** fait autorité sur cette zone.

    Une même machine peut techniquement assurer les deux fonctions, mais les deux rôles doivent être distingués.

---

## Les zones DNS

L'espace de noms DNS est organisé de manière **hiérarchique**.

Dans le projet SportLudique, on peut par exemple rencontrer :

```text
sportludique.fr
│
├── chartres.sportludique.fr
├── tours.sportludique.fr
├── orleans.sportludique.fr
├── bourges.sportludique.fr
└── blois.sportludique.fr
```

Une partie de cet espace peut être confiée à un serveur DNS particulier.

Cette partie constitue une **zone DNS**.

Ainsi, le serveur DNS d'un site peut recevoir la responsabilité de :

```text
ville.sportludique.fr
```

Il devient alors **serveur d'autorité** pour cette zone.

---

## Les principaux enregistrements DNS

Une zone contient des **enregistrements DNS** (*Resource Records*).

Parmi les plus courants :

| Type | Rôle | Exemple |
|---|---|---|
| `A` | associer un nom à une adresse IPv4 | `www → 192.0.2.10` |
| `AAAA` | associer un nom à une adresse IPv6 | `www → 2001:db8::10` |
| `PTR` | associer une adresse IP à un nom (résolution inverse) | `192.0.2.10 → www.ville.sportludique.fr` |
| `CNAME` | créer un alias vers un autre nom | `intranet → www` |
| `MX` | désigner les serveurs de messagerie | `mail.ville.sportludique.fr` |
| `NS` | désigner un serveur DNS responsable d'une zone | `ns1.ville.sportludique.fr` |
| `SOA` | fournir les informations principales concernant une zone | serveur principal, numéro de série... |

!!! info "Résolution directe et résolution inverse"
    Les enregistrements `A` permettent une résolution **nom → adresse IPv4**.

    Les enregistrements `PTR` permettent l'opération inverse : **adresse IP → nom**.

    La mise en œuvre des zones de recherche inverse sera étudiée dans l'approfondissement du parcours avancé.

Vous rencontrerez d'autres types d'enregistrements au fur et à mesure de la mise en place des différents services.

---

## La délégation DNS

Un serveur DNS n'est pas obligé de gérer lui-même tous les sous-domaines situés sous sa zone.

Il peut **déléguer** une partie de l'espace de noms à un autre serveur DNS.

Par exemple :

```text
sportludique.fr
       │
       │ délégation
       ▼
ville.sportludique.fr
       │
       │ délégation
       ▼
lan.ville.sportludique.fr
```

Chaque serveur devient alors responsable de sa propre zone.

La délégation permet donc de **répartir l'administration du DNS** entre plusieurs serveurs.

!!! example "Application à Active Directory"
    Active Directory utilise fortement le DNS et crée de nombreux enregistrements nécessaires à son fonctionnement.

    Il est donc préférable de laisser le **serveur DNS associé à Active Directory** gérer lui-même la zone qui lui est confiée plutôt que de reproduire manuellement ces enregistrements sur un autre serveur.

---

## Les redirecteurs DNS

Un serveur DNS ne possède pas nécessairement lui-même la réponse à toutes les requêtes.

Il peut transmettre certaines requêtes à un autre serveur DNS : celui-ci est alors utilisé comme **redirecteur** (*forwarder*).

```text
Client
   │
   ▼
Résolveur local
   │
   │ redirection
   ▼
Autre serveur DNS
```

La redirection peut concerner :

- toutes les requêtes que le serveur ne sait pas résoudre ;
- uniquement certaines zones DNS.

!!! example "SportLudique"
    L'enseignant met à disposition un serveur DNS gérant le domaine :

    ```text
    sportludique.fr
    ```

    Votre infrastructure devra être capable de l'interroger lorsque cela sera nécessaire.

---

# DNS public et DNS interne

Toutes les informations d'une entreprise n'ont pas vocation à être accessibles depuis l'extérieur.

Un serveur DNS accessible depuis Internet doit principalement publier les noms des **services publics**.

Par exemple :

```text
www.ville.sportludique.fr
mail.ville.sportludique.fr
vpn.ville.sportludique.fr
```

L'infrastructure interne peut avoir besoin de noms supplémentaires :

```text
srv-fichiers...
srv-supervision...
srv-admin...
```

Ces informations ne doivent pas nécessairement être publiées à l'extérieur.

Il faut donc distinguer :

- les **enregistrements publics**, accessibles depuis l'extérieur ;
- les **enregistrements internes**, réservés au système d'information.

!!! warning "Un DNS n'est pas un annuaire public de l'infrastructure"
    Publier inutilement les noms et adresses des ressources internes fournit des informations sur l'organisation du système d'information.

    Seules les informations nécessaires au fonctionnement des services publics doivent être exposées.

---

# Une même zone, des réponses différentes

Dans certaines architectures, un même nom DNS peut retourner une réponse différente suivant l'origine de la requête.

Par exemple :

```text
www.ville.sportludique.fr
```

peut désigner :

```text
Depuis Internet → adresse publique
Depuis le LAN   → adresse privée
```

Cette technique est appelée **DNS partagé**, **Split DNS** ou **Split-Horizon DNS**.

Elle permet notamment de conserver les mêmes noms de services à l'intérieur et à l'extérieur tout en fournissant des informations adaptées à chaque réseau.

Sa mise en œuvre dépend cependant de l'architecture et du logiciel DNS retenus.

---

# Cahier des charges DNS de SportLudique

Chaque site SportLudique doit disposer d'une infrastructure DNS répondant aux besoins de son système d'information.

Votre solution devra permettre :

1. aux utilisateurs du LAN de résoudre les noms nécessaires à leur travail ;
2. de publier les enregistrements correspondant aux services accessibles depuis l'extérieur ;
3. de conserver les informations purement internes à l'intérieur du système d'information ;
4. de gérer la zone :

    ```text
    ville.sportludique.fr
    ```

5. d'utiliser le serveur DNS mis à disposition par l'enseignant pour le domaine :

    ```text
    sportludique.fr
    ```

6. de laisser au serveur DNS Active Directory la responsabilité de l'espace DNS qui lui sera confié ;
7. de ne pas permettre depuis l'extérieur l'utilisation du serveur DNS interne comme résolveur.

!!! question "Avant de configurer"
    Avant toute installation ou configuration, vous devez être capable d'identifier :

    - quel serveur joue le rôle de **résolveur** ;
    - quel serveur fait **autorité** sur chaque zone ;
    - quelles informations DNS sont **publiques** ;
    - quelles informations restent **internes** ;
    - quelles zones doivent être **redirigées** ou **déléguées**.

---

# Choisissez votre parcours

Deux architectures permettent de répondre au cahier des charges.

## Parcours Socle

Ce parcours privilégie une architecture simple permettant de mettre en œuvre correctement les fonctions DNS essentielles.

Vous mettrez notamment en place :

- un serveur DNS d'autorité destiné aux informations publiques ;
- un serveur DNS d'autorité interne ;
- la résolution DNS pour les utilisateurs du LAN ;
- la séparation des informations publiques et internes ;
- la délégation de l'espace DNS réservé à Active Directory.

**Windows Server ou Linux peuvent être utilisés.**

[Accéder au parcours Socle](02-dns-socle.md)

---

## Parcours Avancé

Ce parcours impose une séparation plus importante des rôles et une maîtrise plus approfondie du fonctionnement du DNS.

Vous mettrez notamment en place :

- un **résolveur DNS interne dédié** avec `unbound` ;
- un **serveur DNS d'autorité sous Linux dans la DMZ** géré avec `bind9` ;
- une séparation des réponses internes et externes avec un **Split DNS** ;
- les redirections nécessaires ;
- la délégation de l'espace DNS réservé à Active Directory.

**Les services DNS principaux devront être mis en œuvre sous Linux.**

[Accéder au parcours Avancé](03-dns-avance.md)

---

## Pour aller plus loin

Le protocole DNS comporte également des mécanismes permettant d'améliorer sa sécurité, sa résilience et ses fonctionnalités.

Ces éléments sont étudiés à la fin du parcours avancé :

 - DNSSEC, qui permet de vérifier l'authenticité et l'intégrité des informations DNS ;

 - la mise en place de serveurs DNS secondaires pour améliorer la disponibilité du service ;

 - les transferts de zone entre serveurs DNS ;

 - la résolution inverse, permettant de retrouver un nom à partir d'une adresse IP très utilisé avec lea commande `traceroute`;

 - la sécurisation des transferts de zone.