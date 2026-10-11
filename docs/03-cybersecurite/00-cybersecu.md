# 00-Cybersécurité — SportLudique 2026-2027

Ce référentiel centralise les connaissances utiles au projet SIO2, aux études de cas et aux révisions de l’épreuve E6. Il ne constitue pas une liste de TP à réaliser. Une protection étudiée ici n’est pas nécessairement déployée dans SportLudique.

## Socle obligatoire

### Menace, vulnérabilité, risque et impact

| Notion | Sens | Exemple |
| --- | --- | --- |
| Actif | Élément ayant une valeur pour l’organisation | Annuaire AD et comptes |
| Menace | Cause potentielle d’un incident | Individu cherchant à voler un compte |
| Vulnérabilité | Faiblesse exploitable | Mot de passe réutilisé |
| Risque | Possibilité d’un scénario dommageable, appréciée selon sa vraisemblance et sa gravité | Compromission d’un compte permettant l’accès aux dossiers |
| Impact | Conséquence sur l’organisation | Fuite de données, interruption, coût de restauration |

Un risque ne se résume pas au nom d’une attaque. Décrire l’actif, l’exposition, les conditions d’exploitation et les dommages. Une panne ou une erreur humaine peut aussi produire un incident de sécurité. Une formule « probabilité × gravité » est un outil de classement, pas une mesure universelle exacte.

### Confidentialité, intégrité, disponibilité

- La **confidentialité** limite la connaissance des informations aux acteurs autorisés.
- L’**intégrité** protège contre les modifications non autorisées et permet de détecter une altération. 
- La **disponibilité** rend les services accessibles au moment requis.
- L’**authenticité** permet de vérifier une identité ou une origine ;
- la **traçabilité** aide à établir ce qui s’est passé. Un journal n’est une preuve fiable que si sa collecte, son horodatage et sa protection sont maîtrisés.

### Défense en profondeur et moindre privilège

Accorder uniquement les droits et flux nécessaires, pour la durée nécessaire. Séparer comptes usuels et administratifs. Combiner prévention, limitation de propagation, détection et restauration : chaque mesure peut échouer.

Un VLAN sépare des domaines Ethernet ; le filtrage inter-VLAN contrôle les échanges routés. HTTPS protège un échange et authentifie normalement le serveur ; il ne corrige pas une application vulnérable. Un SIEM rapproche des événements ; il ne bloque pas automatiquement une attaque. Une sauvegarde aide à restaurer ; elle n’empêche ni l’infection ni l’exfiltration.

### Lire le référentiel

| Repère | Attendu |
| --- | --- |
| Socle obligatoire | Expliquer mécanisme, conditions, vulnérabilité, conséquences C/I/D et protection essentielle dans un cas inédit |
| Concepts avancés | Interpréter observations et configurations, expliquer le fonctionnement et les limites des protections |
| Expertise | Diagnostiquer une chaîne d’attaque et justifier une architecture défensive et sa validation |

La progression varie selon les briques. Toutes les attaques n’ont pas trois niveaux. L’OSI est un **repère pédagogique**, pas une attribution exclusive : DHCP et DNS sont applicatifs ; leurs attaques peuvent modifier le fonctionnement du réseau local. Les sessions web et TLS ne correspondent pas strictement aux couches 5 et 6 du modèle théorique.

## Parcours par couches

- [1 — Accès physique](couche1.md)
- [2 — Ethernet, ARP, DHCP et commutation](couche2.md)
- [3 — IP, routage, ICMP et IPv6](couche3.md)
- [4 — TCP, UDP et reconnaissance](couche4.md)
- [5 — Sessions, authentification et rejeu](couche5.md)
- [6 — TLS, HTTPS et confiance](couche6.md)
- [7 — DNS, applications et compromission](couche7.md)
- [Tableau général](tableau-attaques.md) et [fiche de révision](synthese-revisions.md)

## Concepts avancés — raisonner sur une observation

Distinguer une attaque, une **technique de reconnaissance** (scan), une **vulnérabilité** (contrôle d’accès absent) et une **mauvaise configuration** (interface d’administration exposée). Une anomalie n’est pas à elle seule une preuve : une table MAC instable peut aussi résulter d’une boucle.

Dans SportLudique, rechercher les observations adaptées : table MAC et ARP, baux DHCP, routes et ACL, journaux Stormshield, requêtes DNS, événements AD, journaux du reverse proxy, Graylog et SIEM. Vérifier que les événements sont effectivement collectés et horodatés ; ne pas supposer qu’un outil voit tous les flux.

## Expertise — architecture et gestion d’incident

Pour un scénario combiné, identifier l’entrée, la persistance éventuelle, l’élévation de privilèges, le déplacement latéral et l’objectif. Associer à chaque étape un contrôle préventif et une observation possible. En incident : contenir selon la procédure, préserver les traces, analyser le périmètre, éradiquer la cause puis restaurer et vérifier. Une remise en service sans correction peut conduire à une nouvelle compromission.

### Exemple transversal

Un compte VPN volé donne accès à un poste ; des droits excessifs ouvrent ensuite les sauvegardes. Le VPN chiffre la connexion de l’attaquant comme celle d’un utilisateur légitime. MFA, restriction des accès VPN, séparation des comptes d’administration et sauvegardes protégées répondent à des étapes différentes. Le projet n’exige pas de reproduire cette attaque : une analyse argumentée suffit.

## Références

- [ANSSI — Guide d’hygiène informatique](https://messervices.cyber.gouv.fr/guides/guide-dhygiene-informatique) : principes d’administration et de protection.
- [ANSSI — Sauvegarde des systèmes d’information](https://messervices.cyber.gouv.fr/guides/fondamentaux-sauvegarde-systemes-dinformation) : restauration et protection des copies.
- [CERT-FR](https://www.cert.ssi.gouv.fr/) : veille sur les vulnérabilités et incidents ; vérifier produit et version avant de conclure à une exposition.
