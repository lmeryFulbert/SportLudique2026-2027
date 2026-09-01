# Fiche de recette

## Objectif

Cette fiche de recette permet de **valider le bon fonctionnement de l'infrastructure réseau et des services** depuis différents points du réseau.

Les tests permettront notamment de vérifier :

* la connectivité IP ;
* la résolution des noms DNS ;
* l'accès aux services attendus sur les ports correspondants.

Les tests devront être réalisés depuis différents emplacements de l'infrastructure : réseau de transport, DMZ, réseau interne, VLAN serveurs et VLAN utilisateurs.

!!! important "Tester progressivement"
    Un service inaccessible ne signifie pas nécessairement que le service lui-même ne fonctionne pas.

    Les tests doivent être réalisés progressivement afin d'identifier l'origine d'un éventuel dysfonctionnement :

    **connectivité IP → résolution DNS → accès au service**

## Matériel requis

* un ordinateur portable ou un poste de travail pouvant être brassé aux différents niveaux du réseau ;
* les outils de diagnostic nécessaires : `ping`, `nslookup`, navigateur Web, client SSH ou tout autre outil adapté au service testé.

## Tests

Complétez le tableau en indiquant précisément la **source**, la **destination** et le **service testé**.

Pour le test d'un service, précisez également le **protocole et le numéro de port** utilisés, par exemple `TCP/22` pour SSH.

| Source | Destination | Connectivité IP | Résolution DNS | Service testé (protocole/port) |
| ------ | ----------- | --------------- | -------------- | ------------------------------ |
|        |             | [ ]             | [ ]            | [ ]                            |
|        |             | [ ]             | [ ]            | [ ]                            |
|        |             | [ ]             | [ ]            | [ ]                            |
|        |             | [ ]             | [ ]            | [ ]                            |
|        |             | [ ]             | [ ]            | [ ]                            |
|        |             | [ ]             | [ ]            | [ ]                            |

## Validation

La recette ne consiste pas uniquement à obtenir des réponses positives à tous les tests.

Le résultat attendu doit correspondre aux **règles de fonctionnement et de sécurité définies pour l'infrastructure**. Un accès volontairement interdit par une règle de filtrage doit donc être considéré comme valide si le comportement observé correspond au comportement attendu.

En cas d'échec d'un test, identifiez la cause du dysfonctionnement avant de modifier la configuration.
