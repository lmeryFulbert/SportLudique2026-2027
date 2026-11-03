# 00 - Premiers paramétrage des boîtiers Stormshield SN210

Cette page regroupe quelques réglages et précautions à connaître lors de
l'utilisation des boîtiers **Stormshield SN210** dans le cadre des
travaux pratiques.

!!! warning "Attention à l'IP spoofing"
    Les mécanismes de protection
    contre l'**IP spoofing** peuvent bloquer des communications lors des
    modifications de topologie ou d'adressage effectuées pendant les TP.
    Si le boîtier se retrouve dans une situation de blocage liée à l'anti-spoofing, **un redémarrage du SN210 peut être nécessaire pour retrouver un fonctionnement normal**.

## Interfaces virtuelles

Lorsqu'une **interface virtuelle** est utilisée sur une interface
physique du SN210, penser à **désactiver l'interface physique
correspondante** si celle-ci ne doit pas être utilisée directement.

Cela évite des comportements inattendus dans le traitement et le routage
des paquets.

## Configuration pour les tests

Pour les phases de mise au point et de diagnostic, commencer avec une
configuration de filtrage volontairement simple :

-   appliquer le profil **Pass All** ;
-   **désactiver l'IPS** ;
-   utiliser le mode **FW (Firewall)** pour les tests.

L'objectif est de valider d'abord le fonctionnement de l'architecture
réseau, du routage et des services **sans ajouter immédiatement les
mécanismes d'inspection et de filtrage avancés**.

!!! info "Méthode conseillée" 
    **1.** Valider l'adressage et le routage.</br>
    **2.** Tester les communications avec le profil **Pass All** en mode
    **FW**.</br>
    **3.** Vérifier les chemins avec `ping` et `traceroute`.</br>
    **4.** Une fois l'infrastructure fonctionnelle, activer progressivement</br>
    les règles de filtrage et les mécanismes de protection.

## Désactiver le mode furtif

Par défaut, le mode furtif peut perturber le diagnostic réalisé avec
`traceroute` ou `tracert`.

Dans l'interface d'administration :

**Configuration → Protections → Protocoles → IP**

Désactiver la case :

> **Mode furtif**

Cette désactivation permet notamment au pare-feu de **décrémenter
normalement le TTL** des paquets IP et donc d'obtenir un diagnostic
cohérent avec `traceroute`.

!!! tip "Pour les diagnostics réseau" 
    Si un routeur ou un pare-feu intermédiaire semble « disparaître » d'un `traceroute`, vérifier en premier lieu que le **mode furtif est désactivé**.
