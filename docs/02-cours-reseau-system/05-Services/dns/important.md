
# Important - délégations de la zone sportludique.fr

## Délégations DNS des villes SportLudique

Le domaine parent `sportludique.fr` délègue la gestion de chaque sous-domaine à deux serveurs DNS faisant autorité.

Chaque délégation comprend :

- **Deux enregistrements NS** : ils désignent les serveurs DNS responsables du sous-domaine.
- **Deux enregistrements A (glue records)** : ils indiquent les adresses IPv4 de ces serveurs DNS.

!!! important "Configuration obligatoire"
    Les noms des serveurs DNS et leurs adresses IPv4 sont imposés par l'infrastructure SportLudique.

    Vous devez respecter exactement les informations ci-dessous.

    Les enregistrements de délégation **NS** et les enregistrements **glue A** sont configurés dans la zone parente `sportludique.fr`.

### Tableau des délégations

| Ville | Serveur DNS | Adresse IPv4 |
|---|---|---|
| Chartres | `ns1.chartres.sportludique.fr` | `183.44.28.2` |
| Chartres | `ns2.chartres.sportludique.fr` | `221.87.128.1` |
| Tours | `ns1.tours.sportludique.fr` | `183.44.37.2` |
| Tours | `ns2.tours.sportludique.fr` | `221.87.137.1` |
| Orléans | `ns1.orleans.sportludique.fr` | `183.44.45.2` |
| Orléans | `ns2.orleans.sportludique.fr` | `221.87.145.1` |
| Châteauroux | `ns1.chateauroux.sportludique.fr` | `183.44.36.2` |
| Châteauroux | `ns2.chateauroux.sportludique.fr` | `221.87.136.1` |
| Bourges | `ns1.bourges.sportludique.fr` | `183.44.18.2` |
| Bourges | `ns2.bourges.sportludique.fr` | `221.87.118.1` |
| Blois | `ns1.blois.sportludique.fr` | `183.44.41.2` |
| Blois | `ns2.blois.sportludique.fr` | `221.87.141.1` |

### Extrait de la zone DNS parente

Les enregistrements suivants sont configurés dans la zone `sportludique.fr`.

```bind
; =====================================================
; CHARTRES
; =====================================================
chartres.sportludique.fr. IN NS ns1.chartres.sportludique.fr.
chartres.sportludique.fr. IN NS ns2.chartres.sportludique.fr.
ns1.chartres.sportludique.fr. IN A 183.44.28.2
ns2.chartres.sportludique.fr. IN A 221.87.128.1

; =====================================================
; TOURS
; =====================================================
tours.sportludique.fr. IN NS ns1.tours.sportludique.fr.
tours.sportludique.fr. IN NS ns2.tours.sportludique.fr.
ns1.tours.sportludique.fr. IN A 183.44.37.2
ns2.tours.sportludique.fr. IN A 221.87.137.1

; =====================================================
; ORLEANS
; =====================================================
orleans.sportludique.fr. IN NS ns1.orleans.sportludique.fr.
orleans.sportludique.fr. IN NS ns2.orleans.sportludique.fr.
ns1.orleans.sportludique.fr. IN A 183.44.45.2
ns2.orleans.sportludique.fr. IN A 221.87.145.1

; =====================================================
; CHATEAUROUX
; =====================================================
chateauroux.sportludique.fr. IN NS ns1.chateauroux.sportludique.fr.
chateauroux.sportludique.fr. IN NS ns2.chateauroux.sportludique.fr.
ns1.chateauroux.sportludique.fr. IN A 183.44.36.2
ns2.chateauroux.sportludique.fr. IN A 221.87.136.1

; =====================================================
; BOURGES
; =====================================================
bourges.sportludique.fr. IN NS ns1.bourges.sportludique.fr.
bourges.sportludique.fr. IN NS ns2.bourges.sportludique.fr.
ns1.bourges.sportludique.fr. IN A 183.44.18.2
ns2.bourges.sportludique.fr. IN A 221.87.118.1

; =====================================================
; BLOIS
; =====================================================
blois.sportludique.fr. IN NS ns1.blois.sportludique.fr.
blois.sportludique.fr. IN NS ns2.blois.sportludique.fr.
ns1.blois.sportludique.fr. IN A 183.44.41.2
ns2.blois.sportludique.fr. IN A 221.87.141.1
```

!!! note "Pourquoi les glue records sont-ils nécessaires ?"
    Pour trouver l'adresse de `ns1.chartres.sportludique.fr`, un résolveur pourrait devoir interroger le serveur DNS de Chartres.

    Mais pour interroger ce serveur, il doit déjà connaître son adresse IP !

    Les enregistrements **glue A**, fournis par la zone parente, permettent de résoudre cette dépendance circulaire.

    Ils sont indispensables ici puisque les serveurs DNS portent des noms appartenant aux sous-domaines qu'ils gèrent.

### Vérification de la délégation

Depuis un poste disposant de `dig`, vérifier les serveurs DNS déclarés pour Chartres :

```bash
dig chartres.sportludique.fr NS
```

Interroger directement le premier serveur DNS de Chartres :

```bash
dig @183.44.28.2 chartres.sportludique.fr SOA
```

Interroger le second serveur :

```bash
dig @221.87.128.1 chartres.sportludique.fr SOA
```

!!! warning "Attention"
    Déclarer une délégation dans la zone parente ne suffit pas.

    Chaque ville doit également configurer ses serveurs DNS pour qu'ils soient **autoritaires sur leur propre zone**.

    La configuration doit être cohérente entre le domaine parent et les serveurs DNS délégués.

    Les adresses indiquées appartiennent au réseau extérieur simulé SportLudique. Les tests doivent être réalisés depuis l'infrastructure pédagogique.
