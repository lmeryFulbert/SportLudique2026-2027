# 1 — Couche physique et accès aux équipements

[Retour au référentiel](cybersecu.md)

## Socle obligatoire

### Physical Access Attack — attaque par accès physique

**Mécanisme et conditions.** Un individu accède à une station, une baie, une prise réseau, un disque ou une console. Il exploite une protection matérielle insuffisante ou une session déjà ouverte. L’accès peut permettre le vol, la modification ou l’interruption, mais son résultat dépend des protections actives : un disque chiffré et verrouillé reste différent d’un poste ouvert.

**Risques C/I/D.** Vol d’informations, installation d’un dispositif malveillant, changement de configuration, coupure d’alimentation ou destruction. Une session abandonnée relève aussi du contrôle d’accès au système.

**Protections expliquées.** Fermer salles et baies, contrôler et tracer les accès ; la vidéosurveillance contribue à la dissuasion et à l’enquête, elle n’interdit pas matériellement l’accès. Verrouiller automatiquement les sessions. Protéger les accès console et administratifs avec authentification et droits adaptés.

Désactiver les ports inutilisés et les placer dans un VLAN de stationnement sans service utile. Ce VLAN n’est **pas un honeypot** : un honeypot est un système conçu pour observer des interactions suspectes. Éviter VLAN 1 pour les usages utilisateurs et l’administration est une pratique de durcissement, pas une garantie de sécurité. Un VLAN invité doit être filtré vis-à-vis du réseau interne.

**Exemple SportLudique.** Une personne branche un portable sur une prise disponible. Un port désactivé bloque cet accès ; un port actif dans le VLAN d’administration lui donne une exposition beaucoup plus sensible. L’existence du VLAN ne prouve pas que ses ports sont protégés.

### Supports et périphériques

Chiffrer les disques (par exemple BitLocker) limite la lecture hors ligne après vol, sous réserve de protéger les clés de récupération. Cela ne protège pas les données d’une session déverrouillée. Restreindre le démarrage externe et protéger les réglages BIOS/UEFI ; compléter par Secure Boot lorsque possible. Un mot de passe firmware ne suffit pas contre toute manipulation matérielle.

Les politiques GPO de restriction des supports amovibles contrôlent les usages autorisés. Désactiver le montage automatique sous Linux réduit les traitements automatiques mais n’interdit ni le montage manuel ni un périphérique USB simulant un clavier. Gérer les types de périphériques admis et les droits.

## Concepts avancés — contrôle d’accès au réseau

**Port Security** limite les adresses MAC apprises ou autorisées sur un port. Il réduit certains abus, mais une adresse MAC peut être copiée ; ce n’est pas une authentification forte.

Exemple Cisco IOS indicatif, à adapter au modèle et à la topologie ; une station unique est supposée, sans téléphone ni hyperviseur :

```text
interface FastEthernet0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 1
 switchport port-security violation shutdown
```

Le dépassement provoque un état de violation pouvant désactiver le port. Sans adresse configurée, le premier équipement appris peut être l’intrus. Vérifier avec `show port-security interface FastEthernet0/1`. La remise en service doit suivre la recherche de cause.

**802.1X** fait dialoguer un supplicant, un authentificateur (switch) et un serveur d’authentification, souvent RADIUS. Avec EAP-TLS, la confiance repose sur les certificats et leur validation. Les modes de secours, notamment MAB basé sur la MAC, n’apportent pas la même assurance. Étudier le mécanisme ne suppose pas de le déployer dans SportLudique.

## Expertise — scénario de conception

Une salle contient postes partagés, téléphones et ports inutilisés. Justifier une politique d’accès qui prévoit les équipements sans supplicant, les pannes RADIUS, la gestion des certificats et la séparation invités/administration. Définir comment vérifier le refus d’un équipement inconnu sans interrompre toute la salle.

## Référence

[ANSSI — Guide d’hygiène informatique](https://messervices.cyber.gouv.fr/guides/guide-dhygiene-informatique).
