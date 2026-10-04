# Validation des prérequis réseau

!!! info "Objectif"

    Ces quiz permettent de vérifier la maîtrise des **prérequis réseau de première année** nécessaires au projet SportLudique.

    En cas de difficulté, reprenez la page **Rappels réseau de première année** avant de poursuivre.

---

## VLAN et routage inter-VLAN

### VLAN et domaines de diffusion

<quiz>
Quel est le rôle principal d'un VLAN ?
- [ ] Permettre le routage entre plusieurs réseaux IP
- [x] Créer des domaines de diffusion Ethernet distincts
- [ ] Distribuer automatiquement des adresses IP
- [ ] Remplacer une ACL
> **Explication :** Un VLAN réalise une segmentation logique de niveau 2 et constitue un domaine de diffusion distinct.
</quiz>

<quiz>
Deux machines appartiennent à deux VLAN différents. Que faut-il pour permettre leur communication ?
- [ ] Un trunk uniquement
- [ ] Un serveur DHCP
- [x] Un équipement assurant le routage
- [ ] Une ACL obligatoirement
> **Explication :** Les VLAN séparent les domaines de niveau 2. Une communication entre deux VLAN nécessite donc du routage de niveau 3.
</quiz>

### Passerelle

<quiz>
Une machine du VLAN 20 doit envoyer un paquet vers une machine appartenant au VLAN 30. À quelle adresse MAC transmet-elle la trame Ethernet ?
- [ ] À l'adresse MAC de la machine du VLAN 30
- [x] À l'adresse MAC de sa passerelle par défaut
- [ ] À l'adresse MAC du serveur DHCP
- [ ] À l'adresse de broadcast Ethernet
> **Explication :** La destination IP appartient à un autre réseau. La station transmet donc la trame Ethernet à sa passerelle par défaut.
</quiz>

---

## DHCP

### Relais DHCP

<quiz>
Pourquoi un relais DHCP est-il nécessaire lorsque le serveur DHCP se trouve dans un autre réseau ?
- [ ] DHCP fonctionne uniquement dans le VLAN natif
- [x] Le DHCP Discover utilise une diffusion qui n'est normalement pas routée
- [ ] Un serveur DHCP ne possède pas d'adresse IP
- [ ] Une ACL bloque obligatoirement DHCP
> **Explication :** Le client utilise initialement une diffusion pour rechercher un serveur DHCP. Un routeur ne transmet normalement pas cette diffusion vers un autre réseau.
</quiz>

<quiz>
Les clients du VLAN 20 utilisent une SVI `Vlan20` comme passerelle. Le serveur DHCP se trouve dans un autre réseau. Où doit être configuré le relais DHCP ?
- [ ] Sur le serveur DHCP
- [ ] Sur tous les ports ACCESS
- [x] Sur l'interface `Vlan20`
- [ ] Sur le trunk
> **Explication :** Le relais doit être placé sur l'interface de niveau 3 recevant les diffusions DHCP émises par les clients.
</quiz>

---

## ACL

### Filtrage

<quiz>
Une ACL contient uniquement une règle autorisant HTTPS vers un serveur. Que deviennent les autres paquets ne correspondant à aucune règle ?
- [ ] Ils sont automatiquement autorisés
- [x] Ils sont rejetés par le `deny` implicite
- [ ] Ils utilisent automatiquement la route par défaut
- [ ] Ils sont transformés en broadcast
> **Explication :** Une ACL possède implicitement un `deny` à sa fin. Un paquet n'ayant rencontré aucune règle `permit` est donc rejeté.
</quiz>

### Sens d'application

<quiz>
Une ACL est appliquée avec le mot-clé `in`. Par rapport à quoi ce sens est-il déterminé ?
- [ ] À la machine cliente
- [ ] Au serveur
- [x] À l'interface sur laquelle l'ACL est appliquée
- [ ] Au VLAN possédant le numéro le plus faible
> **Explication :** Les directions `in` et `out` sont toujours considérées du point de vue de l'interface concernée.
</quiz>

---

## Routage statique

### Décision de routage

<quiz>
Un routeur reçoit un paquet destiné à `192.168.50.100`. Quelle information utilise-t-il principalement pour rechercher la route à utiliser ?
- [ ] L'adresse MAC source
- [ ] L'adresse IP source
- [x] L'adresse IP destination
- [ ] L'adresse MAC destination de la trame reçue
> **Explication :** La décision de routage est réalisée à partir de l'adresse IP destination du paquet.
</quiz>

### Flux aller et retour

<quiz>
R1 possède une route correcte vers le réseau de PC-B. La requête ICMP envoyée par PC-A arrive correctement jusqu'à PC-B. Le ping peut-il malgré tout échouer ?
- [ ] Non, puisque la requête est arrivée
- [x] Oui, si le chemin retour vers PC-A n'est pas correctement routé
- [ ] Non, ICMP ne nécessite pas de chemin retour
- [ ] Oui, mais uniquement si DHCP ne fonctionne pas
> **Explication :** PC-B doit pouvoir renvoyer sa réponse à PC-A. Une communication nécessite donc un chemin fonctionnel à l'aller et au retour.
</quiz>

<quiz>
R1 possède une route vers le réseau de destination, mais R2 ne possède aucune route permettant de revenir vers le réseau source. Quelle affirmation est correcte ?
- [ ] La communication fonctionne puisque le flux aller est routé
- [ ] R2 utilise automatiquement le chemin emprunté à l'aller
- [x] Le paquet peut atteindre sa destination mais la réponse risque de ne pas pouvoir revenir
- [ ] R1 transmet automatiquement sa table de routage à R2
> **Explication :** Chaque routeur prend indépendamment ses décisions à partir de sa propre table de routage.
</quiz>

---

## Routes globalisantes

### Agrégation des routes

<quiz>
Un routeur possède les routes `192.168.64.0/20` vers R2 et `192.168.70.0/24` vers R3. Où sera envoyé un paquet destiné à `192.168.70.50` ?
- [ ] Vers R2 car `/20` couvre davantage d'adresses
- [x] Vers R3 car `/24` est la route la plus précise
- [ ] Vers R2 et R3 simultanément
- [ ] Vers la route par défaut
> **Explication :** Les deux routes correspondent à l'adresse destination `192.168.70.50`, mais `/24` possède le préfixe le plus long. Le routeur utilise donc la route `192.168.70.0/24`.
</quiz>

### Route la plus précise

<quiz>
Un routeur possède les routes `192.168.64.0/20` vers R2 et `192.168.70.0/24` vers R3. Où sera envoyé un paquet destiné à `192.168.70.50` ?
- [ ] Vers R2 car `/20` couvre davantage d'adresses
- [x] Vers R3 car `/24` est la route la plus précise
- [ ] Vers R2 et R3 simultanément
- [ ] Vers la route par défaut
> **Explication :** Les deux routes correspondent à la destination, mais `/24` possède le préfixe le plus long. Le routeur utilise donc cette route.
</quiz>

### Route par défaut

<quiz>
À quoi correspond la route `0.0.0.0/0` ?
- [ ] Au réseau directement connecté
- [x] À la route utilisée lorsqu'aucune route plus précise ne correspond
- [ ] Uniquement à Internet
- [ ] À une route de broadcast
> **Explication :** `/0` correspond à toutes les destinations. La route par défaut est utilisée lorsqu'aucune route plus précise ne correspond.
</quiz>

---

## Diagnostic réseau

### Méthode

<quiz>
Une machine arrive à joindre sa passerelle mais pas un serveur situé sur un autre site. Quelle est la meilleure démarche ?
- [ ] Ajouter immédiatement une route par défaut
- [ ] Désactiver toutes les ACL
- [x] Suivre le paquet routeur par routeur à l'aller puis effectuer le même raisonnement au retour
- [ ] Modifier le serveur DHCP
> **Explication :** Le diagnostic doit permettre de déterminer précisément où le flux est interrompu, aussi bien à l'aller qu'au retour.
</quiz>

<quiz>
Une communication entre deux réseaux échoue. Les tables de routage contiennent pourtant les routes nécessaires dans les deux sens. Quelle vérification est ensuite pertinente ?
- [ ] Ajouter d'autres routes statiques
- [x] Vérifier les ACL et les pare-feu traversés
- [ ] Modifier le masque du serveur DHCP
- [ ] Transformer les ports ACCESS en trunks
> **Explication :** Lorsque le routage est correct dans les deux sens, le filtrage constitue l'une des causes suivantes à vérifier.
</quiz>

<quiz>
Un étudiant constate qu'un ping ne fonctionne pas et ajoute immédiatement plusieurs routes statiques. Quelle démarche aurait-il dû adopter ?
- [ ] Ajouter également une route par défaut
- [ ] Redémarrer les équipements
- [x] Examiner les tables de routage et déterminer où le flux aller ou retour est interrompu
- [ ] Ajouter un relais DHCP sur chaque interface
> **Explication :** Une modification doit répondre à un diagnostic. Il faut identifier le problème avant de modifier la configuration.
</quiz>

---

## Validation du Socle

### Bilan

<quiz>
Parmi les propositions suivantes, laquelle décrit le mieux une démarche correcte de diagnostic réseau ?
- [ ] Modifier la configuration jusqu'à obtenir une réponse au ping
- [ ] Commencer systématiquement par ajouter une route par défaut
- [x] Déterminer le chemin attendu du flux, vérifier l'aller et le retour, puis contrôler le filtrage et le service
- [ ] Désactiver temporairement tous les mécanismes de sécurité
> **Explication :** Le diagnostic doit être méthodique : adressage, décision locale ou distante, routage aller, routage retour, filtrage puis fonctionnement du service.
</quiz>

!!! success "Socle validé"

    Ces notions correspondent aux **acquis de première année nécessaires à SportLudique**.

    Si plusieurs réponses vous posent problème, reprenez les rappels correspondants avant de poursuivre la configuration de votre infrastructure.