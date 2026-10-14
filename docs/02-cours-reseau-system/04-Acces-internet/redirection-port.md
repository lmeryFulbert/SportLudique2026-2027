# Cisco IOS — Redirection de ports (NAT/PAT statique)

## Objectif

Publier un service hébergé dans la **DMZ SportLudique** afin qu'il soit accessible depuis le **réseau extérieur simulant Internet**.

Une **redirection de port** (ou *PAT statique*) permet de faire correspondre un port de l'adresse extérieure du routeur à un port d'un serveur situé derrière celui-ci.

!!! example "Exemple — Publier un serveur Apache"
    - **Routeur Cisco (côté extérieur)** : `198.51.100.2/30`
    - **Routeur Cisco (côté DMZ)** : `192.168.20.1/24`
    - **Serveur Apache dans la DMZ** : `192.168.20.10/24`, passerelle `192.168.20.1`
    - **Objectif** : `http://198.51.100.2:8080` → `http://192.168.20.10:80`

    Les adresses sont des **exemples à adapter** au plan d'adressage du projet. `198.51.100.0/24` est une plage réservée à la documentation.

## 1. Identifier les interfaces NAT

Sur le routeur Cisco, repérer l'interface vers la DMZ (`inside`) et celle vers le réseau extérieur (`outside`).

```cisco
conf t
interface GigabitEthernet0/1
 description Vers la DMZ
 ip nat inside
 exit
interface GigabitEthernet0/0
 description Vers le reseau exterieur
 ip nat outside
 exit
```

!!! note
    Les interfaces doivent déjà disposer de leurs adresses IPv4 et le **routage** doit fonctionner. Adaptez les noms `GigabitEthernet0/0` et `GigabitEthernet0/1` à votre routeur.

## 2. Configurer la redirection

```cisco
! Port TCP 8080 exterieur -> port TCP 80 du serveur Apache
ip nat inside source static tcp 192.168.20.10 80 198.51.100.2 8080
```

**Lecture de la commande :** `tcp` indique le protocole ; `192.168.20.10 80` désigne le serveur et son port interne ; `198.51.100.2 8080` désigne l'adresse et le port visibles depuis l'extérieur.

Pour publier **HTTPS** sur son port habituel :

```cisco
ip nat inside source static tcp 192.168.20.10 443 198.51.100.2 443
end
write memory
```

Le même principe s'applique à un service **UDP** (par exemple OpenVPN) :

```cisco
! Exemple : OpenVPN sur 192.168.20.20, port UDP 1194
ip nat inside source static udp 192.168.20.20 1194 198.51.100.2 1194
```

!!! warning "NAT ≠ pare-feu"
    Une redirection de port **ne constitue pas une mesure de sécurité**. Vérifiez les **ACL du routeur**, les règles des pare-feux traversés et la sécurité du serveur. N'exposez que les services nécessaires. Une DMZ n'est pas automatiquement accessible depuis l'extérieur.

## 3. Tester et diagnostiquer

Depuis un poste situé **sur le réseau extérieur** :

```bash
curl -I http://198.51.100.2:8080
```

Sur le routeur Cisco :

```cisco
show ip nat translations
show ip nat statistics
show running-config | include ip nat
```

Si le service est inaccessible, vérifier dans cet ordre : **service Apache actif** → **adresse/passerelle du serveur** → **routage aller-retour** → **interfaces `inside`/`outside`** → **règle NAT** → **ACL et pare-feux**.

!!! tip "À retenir"
    - Le client contacte l'**IP extérieure** et le **port publié**.
    - Le routeur redirige vers l'**IP du serveur** et son **port réel**.
    - Le **protocole compte** : une règle TCP ne redirige pas l'UDP.
    - Un `ping` ne valide **pas** une redirection TCP : utilisez une requête sur le port concerné.
    - Testez d'abord depuis l'extérieur : un accès via l'adresse extérieure depuis la DMZ peut nécessiter un traitement NAT supplémentaire (*hairpin NAT*).

Pour supprimer la redirection HTTP :

```cisco
conf t
no ip nat inside source static tcp 192.168.20.10 80 198.51.100.2 8080
end
```

**Référence :** [Documentation Cisco — NAT et traductions statiques](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-addressing/b-ip-addressing/m_iadnat-addr-consv-xe.html).
