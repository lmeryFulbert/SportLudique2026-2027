# 3 — Réseau : IP, ICMP, routage et IPv6

[Retour au référentiel](cybersecu.md)

## Socle obligatoire

### IP Spoofing — usurpation d’adresse IP

L’attaquant choisit une adresse source qui n’est pas la sienne. IP ne prouve pas l’identité de l’émetteur. Il faut pouvoir injecter ces paquets sur un chemin qui ne les filtre pas. Les réponses vont normalement vers l’adresse usurpée : falsifier une source ne suffit pas à établir une connexion TCP complète.

**Risques.** Contournement de règles trop confiantes dans la source, réflexion vers une victime, perturbation (I/D ; C si le scénario permet réellement de recevoir le trafic).

**Protection.** Filtrer les sources incohérentes à l’entrée et à la sortie, selon le plan d’adressage. IP Source Guard traite certains ports d’accès ; des ACL ou contrôles uRPF traitent les chemins routés. Un pare-feu n’est efficace que si ces contrôles sont configurés. La segmentation limite l’exposition sans authentifier les sources.

**SportLudique.** Un paquet reçu depuis Internet annonce une source privée du réseau interne : rechercher et filtrer cette incohérence sur la frontière.

### ICMP Flood / Ping Flood — saturation ICMP

Des Echo Requests nombreuses consomment lien ou ressources. L’attaque est un **DoS** ; elle devient **DDoS** si plusieurs sources participent. Elle ne nécessite pas toujours une source usurpée.

Limiter les débits et protéger le plan de contrôle peut préserver un équipement. Si la liaison est déjà saturée, le filtrage local arrive trop tard : une protection en amont est nécessaire. Ne pas bloquer tout ICMP : les messages d’erreur et la découverte de MTU sont utiles.

### Smurf — réflexion ICMP par diffusion

L’attaquant envoie un Echo Request à une adresse de diffusion dirigée en usurpant l’IP de la victime. Si un routeur relaie cette diffusion et si les hôtes répondent, leurs réponses convergent vers elle (D).

Ce scénario historique dépend de comportements aujourd’hui souvent désactivés. Empêcher le transfert des diffusions dirigées et filtrer les sources usurpées traite ses conditions ; limiter ICMP seul ne supprime pas toute réflexion.

### ICMP Redirect — redirection ICMP falsifiée

Un routeur IPv4 peut indiquer à un hôte qu’un meilleur prochain saut existe sur son réseau local. Le message n’est pas une authentification cryptographique de ce routeur. Un attaquant local tente d’imiter la passerelle et de faire accepter un prochain saut hostile.

**Conditions.** Le système doit accepter la redirection et ses contrôles de cohérence doivent être satisfaits ; l’effet dépend de l’OS. **Risques :** détourner, intercepter ou couper une partie du trafic (C/I/D), sans modifier nécessairement toute la table de routage affichée.

**Protection.** Désactiver l’acceptation des Redirect sur les hôtes lorsqu’ils ne sont pas nécessaires ; filtrer les messages non souhaités. Désactiver leur émission sur les routeurs évite les Redirect légitimes inutiles mais **ne suffit pas** contre les messages forgés. Prévoir un routage correct : routes appropriées ou passerelle ayant elle-même un chemin vers la destination.

**SportLudique.** Une station reçoit un Redirect proposant un poste du VLAN comme routeur vers une autre zone. Vérifier origine, prochain saut et paramètres d’acceptation ; ne pas considérer toute modification de chemin comme légitime.

## Concepts avancés

### Attaques des protocoles de routage dynamique

Un participant hostile ou compromis injecte des informations RIP/OSPF trompeuses. Selon le protocole et la topologie, il doit atteindre les échanges, établir un voisinage ou compromettre un voisin. Les conséquences sont un trou noir, un détour ou une instabilité.

Limiter les interfaces participant au protocole, employer des interfaces passives appropriées, authentifier les échanges lorsque disponible et filtrer les routes attendues. L’authentification n’empêche pas un voisin légitime compromis d’annoncer une mauvaise route. Surveiller voisinages, changements et routes inattendues.

### uRPF et chemins asymétriques

Le mode strict vérifie que le meilleur chemin de retour vers la source utilise l’interface d’arrivée. Il peut rejeter un trafic légitime asymétrique. Le mode loose vérifie l’existence d’une route vers la source et peut donc laisser passer des sources usurpées routables. Justifier le choix en fonction de l’architecture.

### IPv6 : faux RA et usurpation NDP

IPv6 utilise Neighbor Discovery sur ICMPv6, pas ARP. Un faux **Router Advertisement** peut faire choisir un routeur hostile ou modifier des paramètres, y compris en double pile si IPv6 fonctionne alors que seul IPv4 a été sécurisé. Une annonce NDP falsifiée peut détourner l’association IPv6/MAC.

RA Guard filtre les annonces de routeur sur les ports non autorisés ; il ne traite pas à lui seul tout NDP. Les fonctions IPv6 First-Hop Security adaptées au modèle peuvent contrôler davantage d’associations. Les anciennes implémentations de RA Guard ont des limites avec les en-têtes d’extension : vérifier capacités et versions.

DHCPv6 Guard traite les serveurs DHCPv6 non autorisés ; la passerelle IPv6 est normalement annoncée par RA, pas par DHCPv6. Filtrer sélectivement ICMPv6 : un blocage total casse des fonctions indispensables, notamment découverte des voisins et MTU.

## Expertise — diagnostic d’un détour

La route affichée paraît correcte, mais le prochain saut change et le chemin est asymétrique. Comparer routes, voisins ARP/NDP, Redirect, RA et captures sur plusieurs points. Justifier les contrôles IPv4 **et** IPv6, leur emplacement et les exceptions nécessaires. Un traceroute anormal ne démontre pas à lui seul une attaque.

## Références

- [RFC 1122, §3.2.2.2 — ICMP Redirect côté hôte](https://www.rfc-editor.org/rfc/rfc1122.html).
- [RFC 2827 — filtrage des sources](https://www.rfc-editor.org/rfc/rfc2827.html) ; [RFC 3704 — multihoming et filtrage](https://www.rfc-editor.org/rfc/rfc3704.html).
- [RFC 6105 — RA Guard](https://www.rfc-editor.org/info/rfc6105/) ; [RFC 7113 — limites et recommandations](https://www.rfc-editor.org/info/rfc7113/).
