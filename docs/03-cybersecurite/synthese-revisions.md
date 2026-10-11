# Révisions — comprendre, qualifier, protéger

[Retour au référentiel](cybersecu.md) · [Tableau complet](tableau-attaques.md)

## La méthode pour une étude de cas

1. Identifier l’actif et le fonctionnement normal du protocole.
2. Relever la faiblesse et les conditions dont l’attaquant a besoin.
3. Décrire ce qu’il fait accepter au système et pourquoi cela fonctionne.
4. Expliquer les conséquences C/I/D et leur impact métier.
5. Proposer une protection à l’endroit utile, puis préciser sa limite.
6. Choisir une observation pour vérifier l’hypothèse et l’efficacité du contrôle.

## Les mécanismes à reconnaître

| Indice du scénario | Hypothèse à examiner | Réponse essentielle |
| --- | --- | --- |
| MAC de passerelle remplacée | ARP spoofing | DAI ; segmentation ; TLS protège le contenu |
| Offres DHCP inattendues | Faux DHCP | DHCP Snooping et chemin trusted maîtrisé |
| Plus de baux disponibles | Starvation ou capacité insuffisante | Débit DHCP, accès et supervision |
| Prochain saut local inhabituel | Redirect ou faux RA | Contrôle Redirect/RA et routage valide |
| Nombreux SYN sans ACK final | SYN Flood ou panne du chemin | États TCP, cookies/proxy, diagnostic réseau |
| Lien saturé | Flood / DDoS | Mitigation en amont si le lien est le goulot |
| Session utilisée sans nouveau login | Jeton volé | Révocation, protection cookies et poste |
| Multiples connexions échouées | Force brute, stuffing ou spraying | MFA, secrets uniques, limitation et corrélation |
| Nom résolu vers une IP inattendue | Falsification DNS, cache ou vue légitime | Comparer sources ; DNSSEC ; validation TLS |
| Donnée modifie une requête SQL | SQLi | Requêtes paramétrées |
| Donnée devient code navigateur | XSS | Encodage contextuel / API sûres |
| Action déclenchée depuis un autre site | CSRF | Jeton et contrôle d’origine |
| Dossier d’un autre utilisateur accessible | Contrôle d’accès défaillant | Autorisation côté serveur sur chaque objet |
| Fichiers chiffrés et copies supprimées | Rançongiciel et droits excessifs | Contenir ; copies protégées ; restauration vérifiée |

## Les limites à savoir expliquer

- Un VLAN cloisonne ; une ACL ou un pare-feu filtre les échanges entre zones.
- Port Security limite des MAC ; 802.1X peut authentifier un accès.
- DHCP Snooping contrôle DHCP ; DAI contrôle ARP ; IP Source Guard contrôle les sources IP.
- HTTPS protège le trajet, pas le code vulnérable ni le poste compromis.
- HSTS doit être connu du navigateur ; la première visite demande une attention particulière.
- DNSSEC authentifie des données signées ; DoH/DoT protège un trajet vers un résolveur.
- MFA réduit le vol de compte ; un jeton de session déjà volé peut rester exploitable.
- WAF et SIEM complètent la défense ; ils ne remplacent pas correctifs et contrôle d’accès.
- Sauvegarder réduit les pertes si les copies sont protégées et restaurables ; cela n’empêche pas une fuite.

## Réponse modèle courte

« Le poste accepte une annonce ARP non authentifiée associant l’IP de la passerelle à la MAC de l’intrus. Celui-ci doit atteindre le domaine Ethernet. Il peut détourner ou couper le trafic ; lire HTTPS exige encore de contourner sa protection. DAI contrôle les associations ARP, sous réserve de bindings valides et du traitement des adresses statiques. Je vérifie les caches ARP et les compteurs d’inspection. »
