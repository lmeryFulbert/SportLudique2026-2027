# DNS — Cheatsheet

Cette fiche regroupe les principales commandes utiles pour **configurer, tester et dépanner une infrastructure DNS**.

---

## Vérifier son résolveur DNS

### Linux

=== "Classique"

    ```bash
    cat /etc/resolv.conf
    ```

=== "systemd-resolved"

    ```bash
    resolvectl status
    ```

=== "NetworkManager"

    ```bash
    nmcli dev show | grep DNS
    ```

### Windows

```powershell
ipconfig /all
```

---

## Interroger un serveur DNS

### Avec `dig`

Utiliser le résolveur configuré sur la machine :

```bash
dig nom_a_tester
```

Interroger explicitement un serveur DNS :

```bash
dig @IP_SERVEUR_DNS nom_a_tester
```

Exemple :

```bash
dig @192.168.10.53 www.example.org
```

### Avec `nslookup`

=== "Mode direct"

    Utiliser le résolveur configuré :

    ```bash
    nslookup nom_a_tester
    ```

    Interroger explicitement un autre resolver :

    ```bash
    nslookup nom_a_tester IP_SERVEUR_DNS
    ```

=== "Mode interactif"

    Démarrer `nslookup` :

    ```bash
    nslookup
    ```

    Choisir le serveur DNS à interroger :

    ```text
    > server IP_SERVEUR_DNS
    ```

    Effectuer ensuite plusieurs recherches :

    ```text
    > www.ville.sportludique.fr
    > mail.ville.sportludique.fr
    ```

    Choisir un type d'enregistrement particulier :

    ```text
    > set type=MX
    > ville.sportludique.fr
    ```

    Revenir aux enregistrements IPv4 :

    ```text
    > set type=A
    ```

    Quitter :

    ```text
    > exit
    ```

---

# Demander un type d'enregistrement précis

## Hôtes et services

=== "A — IPv4"

    Rechercher l'adresse IPv4 associée à un nom :

    ```bash
    dig nom_a_tester A
    ```

=== "AAAA — IPv6"

    Rechercher l'adresse IPv6 associée à un nom :

    ```bash
    dig nom_a_tester AAAA
    ```

=== "CNAME — Alias"

    Rechercher l'alias associé à un nom :

    ```bash
    dig nom_a_tester CNAME
    ```

=== "PTR — Résolution inverse"

    Effectuer une résolution **adresse IP → nom** :

    ```bash
    dig -x IP_A_TESTER
    ```

    En interrogeant explicitement un serveur :

    ```bash
    dig @IP_SERVEUR_DNS -x IP_A_TESTER
    ```

## Zone et services DNS

=== "NS — Serveurs DNS"

    Afficher les serveurs DNS faisant autorité sur une zone :

    ```bash
    dig zone.tld NS
    ```

=== "MX — Messagerie"

    Afficher les serveurs de messagerie d'une zone :

    ```bash
    dig zone.tld MX
    ```

=== "SOA — Autorité"

    Afficher l'enregistrement `SOA` de la zone :

    ```bash
    dig zone.tld SOA
    ```

    Le `SOA` permet notamment de vérifier le **numéro de série** de la zone.

---

## Résolution inverse

| Résolution | Sens | Enregistrement | Exemple |
|---|---|---|---|
| **Directe** | Nom → adresse IPv4 | `A` | `www.example.fr → 192.168.10.25` |
| **Inverse** | Adresse IPv4 → nom | `PTR` | `192.168.10.25 → www.example.fr` |

Pour IPv4, les zones de résolution inverse utilisent le domaine **`in-addr.arpa`** et l'adresse est écrite dans l'ordre inverse :

```text
192.168.10.25 → 25.10.168.192.in-addr.arpa
```
---

## Observer une délégation

Afficher les serveurs faisant autorité :

```bash
dig zone.tld NS
```

Suivre la chaîne de délégation :

```bash
dig +trace sous-zone.zone.tld
```

!!! warning "Infrastructure SportLudique"
    `sportludique.fr` est utilisé dans l'infrastructure pédagogique et n'est pas publié dans le DNS public d'Internet.

    Un `dig +trace` utilisant les véritables serveurs DNS racine ne permettra donc pas de retrouver cette infrastructure.

---

## Vérifier primaire et secondaire

Afficher le `SOA` depuis le primaire :

```bash
dig @IP_DNS_PRIMAIRE zone.tld SOA
```

Puis depuis le secondaire :

```bash
dig @IP_DNS_SECONDAIRE zone.tld SOA
```

Comparez notamment le **numéro de série**.

Tester ensuite un même enregistrement sur les deux serveurs :

```bash
dig @IP_DNS_PRIMAIRE www.zone.tld
```

```bash
dig @IP_DNS_SECONDAIRE www.zone.tld
```

---

# BIND9 — Serveur

## État du service

```bash
systemctl status bind9
```

Redémarrer :

```bash
sudo systemctl restart bind9
```

Recharger la configuration :

```bash
sudo systemctl reload bind9
```

---

## Vérifier l'écoute sur le port 53

```bash
ss -ltunp | grep :53
```

DNS peut utiliser :

```text
UDP/53
TCP/53
```

---

## Vérifier la configuration BIND

Avant de redémarrer BIND :

```bash
sudo named-checkconf
```

Vérifier un fichier de zone :

```bash
sudo named-checkzone zone.tld /chemin/vers/fichier-zone
```

Exemple :

```bash
sudo named-checkzone example.org /etc/bind/db.example.org
```

!!! tip "Réflexe"
    Après une modification :

    **vérifier → recharger/redémarrer → tester**

---

## Consulter les journaux

```bash
journalctl -u bind9
```

Pour afficher les dernières erreurs :

```bash
journalctl -xeu bind9
```

Suivre les événements en temps réel :

```bash
journalctl -fu bind9
```

---

## Tester BIND localement

Depuis le serveur DNS lui-même :

```bash
dig @localhost zone.tld
```

Puis testez un enregistrement :

```bash
dig @localhost www.zone.tld
```

Cela permet de distinguer un problème **BIND** d'un problème de **réseau ou de pare-feu**.

---

# Unbound — Résolveur

## État du service

```bash
systemctl status unbound
```

## Vérifier la configuration

```bash
sudo unbound-checkconf
```

## Redémarrer

```bash
sudo systemctl restart unbound
```

## Journaux

```bash
journalctl -u unbound
```

## Tester directement le résolveur

```bash
dig @IP_UNBOUND nom_a_tester
```

---

# Cache DNS

## Linux avec systemd-resolved

Vider le cache :

```bash
sudo resolvectl flush-caches
```

## Windows

Vider le cache :

```powershell
ipconfig /flushdns
```

Afficher le cache :

```powershell
ipconfig /displaydns
```

---

# Attention au fichier `hosts`

Avant d'accuser le DNS, vérifiez qu'aucune résolution locale ne vient perturber vos tests.

### Linux

```text
/etc/hosts
```

### Windows

```text
C:\Windows\System32\drivers\etc\hosts
```

!!! danger "Le DNS n'est peut-être pas responsable"
    Une entrée présente dans le fichier `hosts` peut être utilisée localement avant une interrogation DNS.

    Vérifiez donc ce fichier lorsqu'un nom retourne une adresse inattendue.

---

# DNSSEC

Demander les informations DNSSEC :

```bash
dig nom_a_tester +dnssec
```

Interroger explicitement un résolveur :

```bash
dig @IP_RESOLVER nom_a_tester +dnssec
```

Vous pourrez notamment rencontrer :

```text
DNSKEY
RRSIG
DS
```

Sous Windows :

```powershell
Resolve-DnsName nom_a_tester -Server IP_RESOLVER -DnsSecOk
```

DNSSEC permet de vérifier **l'authenticité** et **l'intégrité** des données DNS.

Il n'assure pas leur **confidentialité**.