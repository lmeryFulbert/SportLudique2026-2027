# Tableau général — attaques et protections

[Retour au référentiel](cybersecu.md)

C = confidentialité ; I = intégrité ; D = disponibilité. Les impacts dépendent des droits et du scénario. Le niveau indique le point d’entrée pédagogique ; l’Expertise analyse des combinaisons, elle ne rajoute pas une liste obligatoire.

| Attaque ou notion | Couche OSI / repère | Vulnérabilité ou condition | Risque | Contre-mesure essentielle | Niveau pédagogique |
| --- | --- | --- | --- | --- | --- |
| Accès physique | 1 / transversal | Accès matériel ou session non protégés | C/I/D | Contrôle physique, verrouillage, chiffrement | Socle |
| ARP spoofing | 2 | ARP non authentifié | C/I/D | DAI ; isolation ; TLS pour le contenu | Socle → Avancé |
| MAC flooding | 2 | Capacité limitée de table MAC | C/D | Limitation MAC, contrôle des unicast inconnus | Socle |
| MAC spoofing | 2 | Identité fondée sur une MAC copiable | C/I/D | 802.1X ; droits limités | Socle |
| DHCP starvation | 7, effet LAN 2/3 | Attribution abusive de baux | D | Limitation débit ; contrôle accès ; supervision | Socle |
| DHCP spoofing / rogue | 7, effet LAN 2/3 | Offres serveur non contrôlées | C/I/D | DHCP Snooping correctement placé | Socle → Avancé |
| VLAN hopping | 2 | Trunk négociable ou natif exploitable | C/I/D | Access fixe ; DTP ; trunks et natif maîtrisés | Avancé |
| BPDU spoofing | 2 | BPDU acceptées sur ports inappropriés | D, C selon chemin | BPDU Guard / Root Guard selon rôle | Avancé |
| IP spoofing | 3 | Source IP non vérifiée | I/D, C selon scénario | Filtrage sources ; IPSG ; uRPF adapté | Socle → Avancé |
| ICMP flood | 3 | Lien ou ressources saturables | D | Limitation ; protection en amont | Socle |
| Smurf | 3 | Diffusion dirigée et réponses autorisées | D | Bloquer diffusion dirigée ; anti-spoofing | Socle, historique |
| ICMP Redirect forgé | 3 | Acceptation de redirection non authentifiée | C/I/D | Refuser Redirect inutiles ; routage correct | Socle |
| Injection de routes | 3 / contrôle routage | Voisin ou annonces insuffisamment contrôlés | C/I/D | Voisinages, authentification, filtrage routes | Avancé |
| Faux RA / NDP | 3 sur LAN 2 | Découverte IPv6 insuffisamment contrôlée | C/I/D | RA Guard ; First-Hop Security adaptée | Avancé |
| SYN flood | 4 | États TCP en attente saturables | D | SYN cookies/proxy ; mitigation amont si besoin | Socle |
| UDP flood | 4 | Trafic coûteux sans ouverture préalable | D | Filtrage ; débit ; protection amont | Socle |
| Scan de ports — reconnaissance | 4, identification 7 | Services accessibles observables | Préparation ; D possible par tests | Exposition minimale ; correctifs ; détection | Socle |
| Injection TCP RST | 4 | Segment forgé accepté dans une connexion | D | Validation TCP ; protection chemin/sources | Avancé |
| Réflexion/amplification UDP | 4 + service 7 | Service réflecteur et source usurpée | D | Anti-spoofing ; accès service ; mitigation amont | Avancé |
| Détournement de session | 7, repère 5 | Jeton valide volé et réutilisable | C/I/D | TLS ; cookies ; révocation ; prévention XSS | Socle |
| Force brute / dictionnaire | 7, repère 5 | Secrets devinables et essais possibles | C/I/D | Secrets robustes ; MFA ; limitation essais | Socle |
| Credential stuffing / spraying | 7, repère 5 | Réutilisation / secrets fréquents | C/I/D | Secrets uniques ; MFA ; détection distribuée | Socle |
| Rejeu | Transversal, repère 5 | Absence de contrôle de fraîcheur | C/I/D selon opération | Nonce/séquence authentifiés et vérifiés | Avancé |
| Fixation de session | 7, repère 5 | Identifiant connu conservé après connexion | C/I/D | Régénération et invalidation | Avancé |
| SSL stripping | 7, repère 6 | Premier échange HTTP interceptable | C/I | HTTPS direct ; HSTS ; preload adapté | Socle |
| Validation TLS défaillante — vulnérabilité | Repère 6 | Identité serveur non vérifiée | C/I | Validation certificat ; PKI et clés protégées | Socle |
| DNS spoofing | 7 | Réponse DNS trompeuse acceptée | C/I/D | Résolveur maîtrisé ; DNSSEC ; validation TLS | Socle |
| DNS cache poisoning | 7 | Donnée trompeuse mémorisée | C/I/D | Durcissement résolveur ; DNSSEC validé | Avancé |
| SQLi | 7 | Donnée interprétée comme SQL | C/I/D | Paramétrage ; liste fermée ; droits SQL | Socle |
| XSS | 7 | Donnée interprétée comme code navigateur | C/I | Encodage contextuel ; API sûres ; CSP | Socle |
| CSRF | 7 | Session confondue avec intention | I/D | Jeton ; origine ; SameSite complémentaire | Socle |
| Contrôle accès défaillant / IDOR | 7 | Autorisation absente sur objet/fonction | C/I/D | Contrôle serveur systématique | Socle |
| Mauvaise configuration — vulnérabilité | Transversal | Exposition, secrets ou droits excessifs | C/I/D | Durcissement ; revue ; révocation secrets | Socle |
| Élévation de privilèges | Hôte / transversal | Faille, secret ou délégation excessive | C/I/D | Correctifs ; permissions ; comptes séparés | Avancé |
| Rançongiciel | Hôte / transversal, repère 7 | Accès initial et droits sur données | I/D, C si exfiltration | Prévention ; cloisonnement ; copies protégées | Socle |
| Hameçonnage | Humain / transversal | Confiance abusée | C/I/D selon suite | Vérification indépendante ; MFA adaptée | Avancé |
