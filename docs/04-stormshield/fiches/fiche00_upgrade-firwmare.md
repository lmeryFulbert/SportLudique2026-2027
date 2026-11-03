# Fiche 00 - Mise à jour des pare-feu Stormshield

Les pare-feu Stormshield utilisés dans l'infrastructure SportLudique disposent d'une **licence permettant de continuer à utiliser les équipements**.

En revanche, le **droit de maintenance est limité dans le temps**. Pour les équipements pédagogiques concernés, cette période est de **5 ans**.

La maintenance donne notamment accès aux **mises à jour du firmware SNS**.

!!! warning "Fin de maintenance"

    Les boîtiers utilisés dans le cadre de SportLudique ont désormais dépassé leur période de maintenance.

    Ils peuvent continuer à être utilisés, mais **ils ne bénéficieront plus des futures mises à jour du firmware**.

    La procédure ci-dessous permet donc d'effectuer une **dernière mise à jour** avec le firmware disponible pour ces équipements.

---

## Principe de la procédure

Lorsque la date du boîtier est postérieure à la période de maintenance, l'installation du firmware peut être refusée.

La procédure consiste donc à :

1. modifier temporairement la date du boîtier ;
2. utiliser une date située en **2025** ;
3. redémarrer le boîtier ;
4. effectuer la mise à jour du firmware ;
5. rétablir la date actuelle.

!!! danger "Attention"

    La modification de la date est **temporaire**.

    Après la mise à jour, il est indispensable de rétablir une date correcte.  
    Une date incorrecte peut perturber les journaux, les certificats, les connexions TLS et différents mécanismes de sécurité.

---

## 1. Modifier temporairement la date

Depuis l'interface d'administration du Stormshield, modifiez la date du système.

Choisissez une date située en **2025**.

!!! info "Pourquoi 2025 ?"

    Cette date replace temporairement le système dans une période compatible avec le droit de maintenance associé au boîtier.

---

## 2. Redémarrer le boîtier

Après avoir modifié la date, **redémarrez complètement le pare-feu**.

Cette étape est nécessaire afin que l'ensemble des services du Stormshield prenne en compte la nouvelle date système.

Après le redémarrage, reconnectez-vous à l'interface d'administration et vérifiez la date affichée.

---

## 3. Installer la mise à jour

Procédez ensuite à l'installation du firmware prévu pour le boîtier.

!!! warning "Avant la mise à jour"

    Vérifiez impérativement :

    - le modèle du boîtier ;
    - la version SNS actuellement installée ;
    - la compatibilité de la version cible ;
    - la présence d'une sauvegarde récente de la configuration.

Lancez la mise à jour et laissez le boîtier effectuer son redémarrage.

Ne coupez pas son alimentation pendant cette opération.

---

## 4. Rétablir la date actuelle

Une fois la mise à jour terminée et le boîtier redémarré :

1. reconnectez-vous à l'interface d'administration ;
2. rétablissez **la date et l'heure actuelles** ;
3. vérifiez éventuellement la configuration de la synchronisation **NTP** ;
4. contrôlez que la date affichée par le système est correcte.

!!! success "Contrôle final"

    Le boîtier doit maintenant :

    - fonctionner avec le nouveau firmware ;
    - conserver sa configuration ;
    - afficher la date et l'heure actuelles ;
    - avoir retrouvé un fonctionnement normal de ses services.

---

## Et pour les prochaines années ?

Ces équipements restent utilisables dans l'infrastructure pédagogique.

En revanche, leur période de maintenance étant terminée, **aucune nouvelle mise à jour de firmware ne sera désormais réalisée sur ces boîtiers**.

Ils doivent donc être considérés comme des équipements pédagogiques en **fin de cycle de maintenance**.

Cette situation n'empêche pas leur utilisation pour travailler les notions de :

- routage ;
- NAT ;
- filtrage ;
- VLAN ;
- DMZ ;
- VPN ;
- haute disponibilité ;
- administration d'un pare-feu.

!!! note "Contexte pédagogique"

    L'objectif n'est pas d'utiliser ces équipements comme pare-feu de production exposés à Internet, mais comme supports d'apprentissage dans l'infrastructure pédagogique SportLudique.