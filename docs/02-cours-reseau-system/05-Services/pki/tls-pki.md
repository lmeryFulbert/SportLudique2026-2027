# Travail à faire — HTTPS et infrastructure PKI

!!! info "SportLudique — Trois niveaux d'exigence"
    Ce travail pratique met en application le cours [Présentation de TLS](tls-presentation.md). Le but n'est **pas** de mémoriser toutes les commandes OpenSSL : il s'agit de comprendre **qui possède une clé privée, qui signe un certificat et pourquoi un navigateur fait confiance à une autorité**.

    - **Socle** — Une autorité de certification (CA) sur le serveur Apache : comprendre les étapes de création et de validation d'un certificat.
    - **Avancé** — Une CA indépendante, dans le VLAN de management : séparer les rôles et échanger une demande de certificat.
    - **Expert** — Une CA racine hors ligne et une CA intermédiaire : construire une chaîne de confiance hiérarchique.

!!! warning "Périmètre"
    Les noms et certificats concernent **l'Internet simulé SportLudique**. Adaptez le nom `www.chartres.sportludique.fr` à **votre** service DNS. N'ajoutez jamais une autorité pédagogique au magasin de confiance d'une machine personnelle non maîtrisée. **Ne transmettez ni clés privées ni phrases de passe.**

## Prérequis communs

Vous disposez déjà d'un **serveur Apache fonctionnel en HTTP**, d'un nom DNS qui résout vers ce serveur et d'un accès administrateur. Vérifiez les points suivants :

```bash
openssl version
apache2ctl -v
```

!!! question "Avant de commencer"
    Quelle est l'adresse IPv4 du serveur ? Quel nom DNS utiliserez-vous ? Quels équipements (routeur, pare-feu, redirection de port) séparent le navigateur du serveur ? **HTTPS ne corrige pas un problème DNS ou réseau.**

---

## Socle

### Une CA sur le serveur Apache

Pour éviter les transferts de fichiers entre machines, la CA est volontairement installée **sur le même serveur que le service web**. Cette organisation sert uniquement à découvrir le mécanisme de certification.

```mermaid
flowchart TB
    subgraph S[Serveur]
        CA[Autorité de certification locale]
        CSR[Demande de certificat CSR]
        CERT[Certificat serveur]
        WEB[Apache HTTPS]
        CSR -->|Signature par la CA| CA
        CA -->|Émet| CERT
        CERT --> WEB
    end
    CLIENT[Poste client] -->|HTTPS - TCP 443| WEB
    CA -.->|Certificat public de confiance| CLIENT
```

!!! warning "Limite de l'architecture Socle"
    Héberger la clé privée de la CA sur le serveur web est **une simplification pédagogique**, déconseillée sur un serveur exposé : un attaquant qui compromet ce serveur pourrait aussi s'emparer de cette clé.

### Étape 1 — Préparer le serveur

Vérifiez ou installez les outils nécessaires et activez le module SSL d'Apache :

```bash
sudo apt update
sudo apt install -y apache2 openssl ca-certificates curl
sudo a2enmod ssl
```

Ouvrez une session administrateur :

```bash
sudo -i
```

!!! info "Pourquoi travailler en root ?"
    `sudo -i` ouvre une session **root**. Nous allons stocker la clé privée de la CA dans `/root/pki-socle`, un répertoire réservé à l'administrateur. Cela évite de répéter `sudo` devant chaque commande. Soyez prudent : root peut modifier tout le système. En fin de TP, quittez cette session avec `exit`.

Créez le dossier de travail et placez-vous dedans :

```bash
install -d -m 700 /root/pki-socle
cd /root/pki-socle
pwd
```

### Étape 2 — Créer la clé privée de la CA

```bash
openssl genpkey -algorithm RSA \
  -aes-256-cbc \
  -pkeyopt rsa_keygen_bits:4096 \
  -out ca.key
chmod 600 ca.key
```

!!! danger "Phrase de passe de la CA"
    La clé privée de la CA est **chiffrée**. OpenSSL vous demande de choisir puis de confirmer une **phrase de passe** : conservez-la précieusement ! Vous devrez la saisir pour utiliser cette clé lors de la signature des certificats. **Ne l'inscrivez pas dans votre dépôt Git ni dans votre compte rendu.**

??? question "Analyse — Clé privée"
    À quoi sert la clé privée de l'autorité de certification ? Pourquoi sa protection est-elle indispensable ? À quoi correspond la taille `4096` dans la commande ?

### Étape 3 — Créer le certificat de la CA

```bash
openssl req -new -x509 -sha256 -days 1825 \
  -key ca.key -out ca.crt \
  -addext "basicConstraints=critical,CA:TRUE"
```

!!! info "Identifier une autorité de certification"
    L'option `CA:TRUE` indique que le certificat appartient à une **autorité de certification**, capable de signer d'autres certificats.

    Le paramètre `critical` impose aux logiciels de validation de prendre en compte cette extension.

    Nous retrouverons cette information en examinant le certificat avec `openssl x509 -text`.


**Répondez aux questions d'OpenSSL**. Utilisez par exemple :

| Champ demandé | Valeur proposée |
|---|---|
| Country Name | `FR` |
| State or Province Name | `Eure-et-Loir` |
| Locality Name | `Chartres` |
| Organization Name | `SportLudique` |
| Organizational Unit Name | `SIO` |
| Common Name | `CA Socle` |
| Email Address | Laisser vide |

!!! info "Deux éléments à distinguer"
    Le **Common Name** saisi ici est le nom de **l'autorité**, pas celui du site web. L'option `CA:TRUE` indique aux logiciels que ce certificat est celui d'une autorité de certification. Les extensions X.509 seront approfondies au niveau Expert.

La commande demande également la **phrase de passe de `ca.key`** : pourquoi ?

Affichez et examinez le certificat :

```bash
openssl x509 -in ca.crt -noout -text
```

??? question "Analyse — Certificat de la CA"
    Repérez les champs `Subject`, `Issuer` et les dates de validité. Pourquoi `Subject` et `Issuer` sont-ils identiques ? Le certificat de cette CA est-il automatiquement reconnu par votre navigateur ?

### Étape 4 — Créer la clé privée du serveur web

Contrairement à la CA, le serveur Apache doit pouvoir démarrer **sans qu'un administrateur saisisse une phrase de passe**. Nous utilisons donc, pour ce TP, une clé de serveur non chiffrée mais protégée par les permissions du système.

```bash
openssl genpkey -algorithm RSA \
  -pkeyopt rsa_keygen_bits:3072 \
  -out web.key
```

!!! warning "Ne mélangez pas les clés"
    `ca.key` appartient à **l'autorité de certification** ; `web.key` appartient au **serveur web**. Ce sont deux clés privées différentes, qui n'ont pas le même rôle.

```bash
chmod 600 web.key
```

!!! warning "Protection de la clé privée du serveur"
    La clé privée `web.key` contient une information sensible. Elle doit être accessible uniquement à l'administrateur `root`.

    ```bash
    chmod 600 web.key
    ```

    **Mais comment Apache peut-il utiliser cette clé ?**

    Sur Debian, le processus principal Apache démarre avec les privilèges de `root`. Il peut donc charger la clé privée nécessaire au fonctionnement de TLS.

    Les processus qui traitent les requêtes des utilisateurs s'exécutent ensuite avec des privilèges réduits, généralement sous le compte `www-data`.

    **Il n'est donc pas nécessaire de donner au compte `www-data` un accès direct à la clé privée.**


### Étape 5 — Créer la demande de certificat (CSR)

Remplacez le nom DNS ci-dessous par celui de **votre** site :

```bash
openssl req -new -sha256 \
  -key web.key -out web.csr \
  -addext "subjectAltName=DNS:www.chartres.sportludique.fr"
```

Répondez **interactivement** aux champs d'identité du **serveur**. Pour `Common Name`, indiquez le FQDN du site, par exemple `www.chartres.sportludique.fr`. Laissez vides les éventuels *extra attributes* (`challenge password`, etc.) : ils ne sont pas utiles ici.

!!! info "Pourquoi le SAN ?"
    Les navigateurs vérifient le **nom du site** dans l'extension `Subject Alternative Name` (**SAN**). Mettre le nom uniquement dans `Common Name` n'est plus suffisant. OpenSSL demande l'identité de manière interactive, mais le SAN est ici indiqué dans la commande.

Contrôlez la demande :

```bash
openssl req -in web.csr -noout -text
```

??? question "Analyse — La CSR"
    Retrouvez le `Subject` et le champ **SAN**. La CSR contient-elle la clé privée `web.key` ? Pourquoi peut-on transmettre une CSR à une CA sans transmettre cette clé ?

### Étape 6 — La CA signe le certificat du serveur

Pour que le nom DNS figure **aussi dans le certificat final**, créez un petit fichier d'extensions. Adaptez le FQDN à votre site :

```bash
nano web.ext
```

Insérez :

```ini
[v3_web]
subjectAltName = DNS:www.chartres.sportludique.fr
basicConstraints = CA:FALSE
extendedKeyUsage = serverAuth
```

Puis demandez à la CA de signer :

```bash
openssl x509 -req -sha256 -days 365 \
  -in web.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out web.crt \
  -extfile web.ext -extensions v3_web
```

OpenSSL réclame la **phrase de passe de la CA**. Il ne s'agit pas d'un mot de passe Apache : c'est la protection de la clé qui sert à **signer**.

Vérifiez le résultat :

```bash
openssl x509 -in web.crt -noout -text
openssl verify -CAfile ca.crt web.crt
```

!!! success "Résultat attendu"
    Le fichier `web.crt` contient le certificat du serveur **signé par votre CA**. La commande de vérification doit afficher `web.crt: OK`. Repérez `Subject` (site), `Issuer` (CA), dates et SAN.


### Le format PEM

Le format **PEM** (*Privacy-Enhanced Mail*) est très utilisé pour stocker les certificats X.509, les demandes de certificats (CSR) et les clés cryptographiques.

Un fichier PEM est un fichier texte contenant des données encodées en **Base64**, encadrées par des marqueurs permettant d'identifier leur nature.

Par exemple, un certificat commence et se termine par :

```text
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

Une clé privée non chiffrée peut être représentée ainsi :

```text
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

!!! info "Une extension ne détermine pas le format"
    Les extensions `.crt`, `.key` et `.pem` indiquent généralement le rôle du fichier, mais pas nécessairement son format.

    Un certificat nommé `web.crt` peut parfaitement être encodé au format PEM.

#### Un fichier PEM peut contenir plusieurs éléments

Il est possible de regrouper plusieurs certificats dans un même fichier PEM, simplement en les plaçant les uns à la suite des autres.

C'est particulièrement utile pour constituer une **chaîne de certification**.

Par exemple, au niveau Expert :

```text
-----BEGIN CERTIFICATE-----
Certificat du serveur web
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
Certificat de la CA intermédiaire
-----END CERTIFICATE-----
```

Ce fichier permet au serveur web de présenter au navigateur les certificats nécessaires pour reconstruire la chaîne de confiance jusqu'à la CA racine.

#### Générer un fichier PEM avec la commande `cat`

La commande Linux `cat` permet de concaténer plusieurs fichiers.

Pour regrouper le certificat du serveur et celui de la CA intermédiaire :

```bash
cat web.crt intermediate.crt > fullchain.pem
```

L'opérateur `>` redirige le résultat vers un nouveau fichier.

!!! warning "L'ordre des certificats est important"
    Le certificat du **serveur web** doit apparaître en premier, suivi du certificat de la **CA intermédiaire**.

    Le certificat de la CA racine n'est généralement pas ajouté : il doit déjà être reconnu comme une autorité de confiance par le client.

#### Et la clé privée ?

Techniquement, un fichier PEM peut également contenir une clé privée.

Il est donc possible de regrouper un certificat et sa clé privée :

```bash
cat web.crt web.key > web-complet.pem
```

!!! danger "Attention à la confidentialité"
    Ce fichier contient désormais la **clé privée du serveur**.

    Il doit être protégé avec des permissions adaptées (`600`) et ne doit jamais être diffusé publiquement.

    Dans notre infrastructure, nous privilégierons des fichiers séparés pour les certificats publics et les clés privées.

#### Utilisation avec Apache et Nginx

Apache et Nginx utilisent tous les deux des fichiers PEM, même lorsque leur extension est `.crt` ou `.key`.

**Exemple Apache :**

```apache
SSLCertificateFile /etc/ssl/sportludique/certs/fullchain.pem
SSLCertificateKeyFile /etc/ssl/sportludique/private/web.key
```

**Exemple Nginx :**

```nginx
ssl_certificate /etc/ssl/sportludique/certs/fullchain.pem;
ssl_certificate_key /etc/ssl/sportludique/private/web.key;
```

!!! info "À retenir"
    - **PEM** est un format d'encodage, pas un type de certificat.
    - Un même fichier PEM peut contenir plusieurs certificats.
    - La concaténation permet de constituer une chaîne de certification.
    - **Apache et Nginx** peuvent utiliser des fichiers PEM.
    - La clé privée doit rester confidentielle, quel que soit le format utilisé.


### Étape 7 — Configurer Apache pour HTTPS

Le service HTTPS doit utiliser **le certificat du serveur** (`web.crt`) et **sa clé privée** (`web.key`), jamais `ca.key`.

Installez les fichiers aux emplacements prévus :

```bash
# Création des répertoires
mkdir -p /etc/ssl/sportludique/private
mkdir -p /etc/ssl/sportludique/certs

# Protection des répertoires
chmod 700 /etc/ssl/sportludique/private
chmod 755 /etc/ssl/sportludique/certs

# Copie des fichiers
cp web.key /etc/ssl/sportludique/private/
cp web.crt /etc/ssl/sportludique/certs/

# Application des permissions
chmod 600 /etc/ssl/sportludique/private/web.key
chmod 644 /etc/ssl/sportludique/certs/web.crt
```


#### Configuration du VirtualHost HTTPS

Apache fournit un fichier de configuration SSL par défaut. Nous allons le copier pour l'adapter à notre site web.

```bash
cp /etc/apache2/sites-available/default-ssl.conf \
   /etc/apache2/sites-available/sportludique-ssl.conf
```

Éditez ensuite le nouveau fichier :

```bash
nano /etc/apache2/sites-available/sportludique-ssl.conf
```

Adaptez les directives suivantes :

- `ServerName` : le nom DNS (FQDN) de votre site web.
- `DocumentRoot` : le répertoire contenant les fichiers du site HTTP existant.
- `SSLCertificateFile` : le chemin vers votre certificat serveur (`web.crt`).
- `SSLCertificateKeyFile` : le chemin vers votre clé privée (`web.key`).

Vérifiez que la directive `SSLEngine on` est présente.

Activez ensuite SSL (si ca n'a pas déjà été fait) et votre nouveau VirtualHost :

```bash
a2enmod ssl
a2ensite sportludique-ssl.conf
apache2ctl configtest
systemctl reload apache2
```

!!! question "Analyse — HTTP et HTTPS"
    Pourquoi avons-nous créé un nouveau VirtualHost plutôt que de modifier directement celui du site HTTP existant ?

    **Réponse :** Apache peut héberger un même site sur plusieurs ports. Le VirtualHost HTTP écoute généralement sur le port **80**, tandis que le VirtualHost HTTPS écoute sur le port **443** et utilise TLS pour protéger les communications.


```apache
<VirtualHost *:443>
    ServerName appname.ville.sportludique.fr
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /etc/ssl/sportludique/certs/web.crt
    SSLCertificateKeyFile /etc/ssl/sportludique/private/web.key

    ErrorLog ${APACHE_LOG_DIR}/sportludique-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/sportludique-ssl-access.log combined
</VirtualHost>
```

```bash
a2ensite sportludique-ssl.conf
apache2ctl configtest
systemctl reload apache2
```

!!! warning "Réseau SportLudique"
    Vérifiez le **DNS**, le filtrage **TCP 443** et, le cas échéant, la **redirection de port** sur le routeur. Une configuration Apache correcte ne rend pas automatiquement le service accessible depuis le réseau extérieur simulé.

### Étape 8 — Comprendre la confiance du navigateur

Depuis un **poste client distinct**, ouvrez `https://www.chartres.sportludique.fr` (en adaptant le FQDN). Un avertissement de confiance est normal tant que le navigateur **ne connaît pas votre CA**. Ne confondez pas ce cas avec une erreur de nom DNS ou de date.

Copiez **uniquement le certificat public `ca.crt`** vers le poste de test, puis ajoutez-le au magasin des **autorités de certification de confiance** de ce poste ou du navigateur. Pour Firefox, le magasin utilisé dépend de la configuration : vérifiez dans les paramètres de certificats.

Rechargez la page et examinez le certificat présenté par le serveur.

!!! danger "Ne jamais importer une clé privée sur un poste client"
    Le poste client n'a besoin que du **certificat public `ca.crt`**. Ne copiez jamais `ca.key` ni `web.key`. N'installez cette CA pédagogique que sur une machine de test contrôlée.

??? question "Analyse — Confiance et DICP"
    1. Pourquoi le navigateur avertit-il l'utilisateur **avant** l'ajout de `ca.crt` ?
    2. Pourquoi l'avertissement disparaît-il **après** cet ajout, si le nom et la validité du certificat sont corrects ?
    3. Quels mécanismes de TLS contribuent à la **confidentialité (C)** et à l'**intégrité (I)** des échanges ?
    4. HTTPS garantit-il la **disponibilité (D)** du service ou la **preuve (P)** des actions de l'utilisateur ? Justifiez.
    5. Pourquoi un certificat valide n'établit-il pas qu'un site est honnête ?

!!! success "Socle validé si…"
    Le site est accessible en HTTPS ; le certificat présente le bon **SAN** ; sa signature est vérifiable avec `ca.crt` ; le navigateur n'affiche plus d'avertissement **après** installation volontaire de la CA de test. Vous êtes capables d'expliquer le rôle de `ca.key`, `ca.crt`, `web.key`, `web.csr` et `web.crt`.

---

## Avancé 

### Une CA indépendante dans le VLAN de management

**On conserve le même site Apache.** L'objectif n'est pas de refaire le Socle, mais de **déplacer la fonction de certification** vers une machine autonome dans le VLAN de management. La clé privée de cette CA ne doit jamais se trouver sur le serveur web.

```mermaid
flowchart TB
    subgraph M[VLAN de management]
        CA[CA autonome]
    end
    subgraph D[Zone du serveur web]
        WEB[Serveur Apache]
    end
    CL[Poste client]
    WEB -.->|Transfert de la CSR seule| CA
    CA -.->|Retour du certificat signé| WEB
    CL -->|HTTPS TCP 443| WEB
```

### Étape A1 — Préparer la CA autonome

Sur une **nouvelle VM Debian**, distincte du serveur Apache :

```bash
sudo apt update
sudo apt install -y openssl
sudo -i
install -d -m 700 /root/pki-avance
cd /root/pki-avance
```

Créez une **nouvelle** clé privée chiffrée et son certificat, en répondant interactivement aux demandes :

```bash
openssl genpkey -algorithm RSA -aes-256-cbc \
  -pkeyopt rsa_keygen_bits:4096 -out ca.key
chmod 600 ca.key
openssl req -new -x509 -sha256 -days 1825 \
  -key ca.key -out ca.crt \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
  -addext "keyUsage=critical,keyCertSign,cRLSign"
```

Dans `Common Name`, saisissez par exemple **`SportLudique CA Avance`** : c'est le nom de la CA, pas celui d'Apache.

!!! info "Extensions X.509 — Un cran plus loin"
    `CA:TRUE` désigne une autorité ; `keyCertSign` autorise la **signature des certificats** ; `cRLSign` désigne la signature des listes de révocation ; `pathlen:0` interdit à cette CA de créer une nouvelle sous-CA dans une chaîne valide. Les mentions `critical` doivent être comprises par le logiciel qui valide le certificat.

### Étape A2 — Demander un certificat depuis Apache

Sur **Apache**, générez ou réutilisez `web.key` et `web.csr` du Socle. **N'envoyez que la CSR** à la CA autonome.

Le transfert peut se faire par `scp`, avec le sens et les accès adaptés à votre infrastructure. Exemple **depuis Apache**, avec un compte autorisé à déposer dans son dossier personnel sur la CA :

```bash
scp /root/pki-socle/web.csr etudiant@IP_CA:/home/etudiant/web.csr
```

Sur **la CA**, un administrateur vérifie la demande puis la place dans son dossier protégé :

```bash
cp /home/etudiant/web.csr /root/pki-avance/web.csr
cd /root/pki-avance
openssl req -in web.csr -noout -text
```

!!! warning "Contrôle avant signature"
    La signature n'est pas automatique : l'administrateur vérifie **quel serveur demande le certificat**, le nom DNS demandé et son droit à utiliser ce nom. **Ne signez pas aveuglément n'importe quelle CSR.**

### Étape A3 — Signer et renvoyer le certificat

Sur la CA autonome, créez `web.ext`, sur le même modèle qu'au Socle :

```ini
[v3_web]
subjectAltName = DNS:www.chartres.sportludique.fr
basicConstraints = CA:FALSE
extendedKeyUsage = serverAuth
```

Puis :

```bash
openssl x509 -req -sha256 -days 365 \
  -in web.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out web.crt -extfile web.ext -extensions v3_web
openssl verify -CAfile ca.crt web.crt
```

Renvoyez à Apache **seulement** `web.crt` et `ca.crt` par un transfert contrôlé (par exemple `scp` dans le dossier personnel de l'administrateur Apache). Installez **`web.crt`** pour le VirtualHost HTTPS comme au Socle. Distribuez **`ca.crt`** aux postes clients de test pour établir la confiance.

!!! danger "Interdiction"
    `ca.key` **ne quitte pas** le serveur CA. `web.key` **ne quitte pas** le serveur Apache. Les CSR et certificats publics peuvent être transférés ; les clés privées non.

??? question "Analyse — Avancé"
    1. Qu'est-ce qui change dans le **risque de compromission** par rapport au Socle ? Répondez en utilisant les critères **DICP** pertinents.
    2. Pourquoi la CA n'a-t-elle pas besoin de recevoir `web.key` ?
    3. Quels flux doivent être autorisés pour l'administration et les transferts ? La CA doit-elle être accessible à tous les clients web ?
    4. Que se passe-t-il si la CA est arrêtée **après** la délivrance du certificat : le site HTTPS cesse-t-il nécessairement de fonctionner ? Expliquez.

!!! success "Avancé validé si…"
    La CA est une **machine distincte** ; la clé `ca.key` est absente d'Apache ; une CSR part du serveur web et seul un certificat signé revient ; les flux réseau et les privilèges sont justifiés ; la validation HTTPS fonctionne côté client.

---

## Expert 

### Une PKI hiérarchique avec CA racine hors ligne

Cette fois, la **racine** n'émet **pas directement** les certificats des sites web. Elle signe le certificat d'une **CA intermédiaire**, qui assure ensuite les demandes courantes. La machine racine est **sans interface réseau connectée** et reste **éteinte hors des opérations exceptionnelles**.

```mermaid
flowchart TB
    subgraph OFF[CA racine normalement hors ligne]
        ROOT[CA racine - root.key et root.crt]
    end
    subgraph ADM[VLAN de management]
        INT[CA intermédiaire - intermediate.key et intermediate.crt]
    end
    subgraph DMZ[Zone du serveur web]
        WEB[Apache - web.key et web.crt]
    end
    CL[Client qui fait confiance à root.crt]
    ROOT -.->|Signe la CA intermédiaire| INT
    INT -.->|Signe le certificat serveur| WEB
    CL -->|HTTPS avec la chaîne serveur et intermédiaire| WEB
```

### Étape E1 — Préparer la racine hors ligne

Créez une **VM dédiée**, déconnectée de tout réseau virtuel. Vérifiez cette isolation **avant** de générer la clé : aucun adaptateur réseau connecté. Démarrez-la uniquement pour les opérations sur la racine.

```bash
sudo -i
install -d -m 700 /root/pki-root
cd /root/pki-root
openssl genpkey -algorithm RSA -aes-256-cbc \
  -pkeyopt rsa_keygen_bits:4096 -out root.key
chmod 600 root.key
openssl req -new -x509 -sha256 -days 3650 \
  -key root.key -out root.crt \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:1" \
  -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -addext "subjectKeyIdentifier=hash"
```

Donnez-lui un `Common Name` explicite, par exemple `SportLudique Root CA`. Sa phrase de passe doit être différente de celle des autres autorités.

!!! danger "La clé racine ne sort jamais"
    **`root.key` reste exclusivement sur la machine isolée.** Ne connectez pas temporairement sa carte réseau « pour aller plus vite ». Les échanges de **CSR et certificats publics** se font par un support contrôlé. Conservez ce support et les sauvegardes de la racine selon une procédure documentée.

### Étape E2 — Créer la CA intermédiaire

Sur une deuxième VM, située dans le **VLAN de management** :

```bash
sudo apt install -y openssl
sudo -i
install -d -m 700 /root/pki-intermediate
cd /root/pki-intermediate
openssl genpkey -algorithm RSA -aes-256-cbc \
  -pkeyopt rsa_keygen_bits:4096 -out intermediate.key
chmod 600 intermediate.key
openssl req -new -sha256 \
  -key intermediate.key -out intermediate.csr
```

Répondez interactivement aux champs : `Common Name` peut être `SportLudique Issuing CA`. Laissez vides les *extra attributes*, sauf besoin identifié et documenté.

Transférez **uniquement `intermediate.csr`** vers la machine racine au moyen d'un support contrôlé.

!!! warning "Connexion réseau exceptionnelle de la CA racine"
    La CA racine doit normalement rester **éteinte et totalement isolée du réseau** afin de protéger sa clé privée.

    Pour simplifier les manipulations dans le cadre de SportLudique, une **connexion réseau temporaire sera exceptionnellement autorisée** pour transférer les fichiers nécessaires à la signature de la CA intermédiaire.

    La procédure est la suivante :

    1. Démarrer la machine hébergeant la CA racine.
    2. Activer temporairement son interface réseau sur un réseau d'administration isolé.
    3. Transférer uniquement la demande `intermediate.csr` vers la CA racine.
    4. Signer la demande, puis transférer les certificats publics `intermediate.crt` et `root.crt`.
    5. **Désactiver et déconnecter l'interface réseau**, puis éteindre la machine.

    **Attention :** la clé privée `root.key` ne doit jamais quitter la machine racine.

    En production, on privilégie des procédures de transfert hors réseau. Cette exception est uniquement destinée à faciliter le travail pédagogique.


### Étape E3 — La racine signe la CA intermédiaire

Sur la **racine hors ligne**, vérifiez la CSR :

```bash
openssl req -in intermediate.csr -noout -text
```

Créez `intermediate.ext` :

```ini
[v3_intermediate_ca]
basicConstraints = critical, CA:TRUE, pathlen:0
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
```

Puis signez :

```bash
openssl x509 -req -sha256 -days 1825 \
  -in intermediate.csr \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out intermediate.crt \
  -extfile intermediate.ext -extensions v3_intermediate_ca
openssl verify -CAfile root.crt intermediate.crt
```

Transférez **`intermediate.crt` et `root.crt`**, jamais `root.key`, vers la machine de la CA intermédiaire. **Éteignez ensuite la racine.**

!!! info "Pourquoi `pathlen:1` puis `pathlen:0` ?"
    La racine avec `pathlen:1` autorise une **CA intermédiaire supplémentaire** dans la chaîne. L'intermédiaire avec `pathlen:0` peut signer des **certificats de serveurs**, mais pas déléguer à une autre sous-CA dans une chaîne valide. `CA:TRUE` et `keyCertSign` distinguent ici une CA d'un simple serveur web.

### Étape E4 — La CA intermédiaire délivre le certificat du serveur

Sur **Apache**, créez `web.key` et `web.csr` comme au Socle. Transférez **uniquement `web.csr`** à la CA intermédiaire.

Sur la CA intermédiaire, contrôlez la CSR puis créez un fichier `web.ext` :

```ini
[v3_web]
subjectAltName = DNS:www.chartres.sportludique.fr
basicConstraints = critical,CA:FALSE
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
```

Signez avec **la clé de l'intermédiaire**, et non celle de la racine :

```bash
openssl x509 -req -sha256 -days 365 \
  -in web.csr \
  -CA intermediate.crt -CAkey intermediate.key -CAcreateserial \
  -out web.crt -extfile web.ext -extensions v3_web
```

Contrôlez **l'ensemble de la chaîne** :

```bash
openssl verify -CAfile root.crt \
  -untrusted intermediate.crt web.crt
```

### Étape E5 — Configurer Apache avec la chaîne complète

Transférez à Apache **`web.crt` et `intermediate.crt`**. Assemblez-les dans cet ordre :

```bash
cat web.crt intermediate.crt > web-fullchain.crt
```

Installez `web-fullchain.crt` dans le répertoire des certificats du serveur et configurez le VirtualHost :

```apache
SSLCertificateFile /etc/ssl/sportludique/certs/web-fullchain.crt
SSLCertificateKeyFile /etc/ssl/sportludique/private/web.key
```

```bash
apache2ctl configtest
systemctl reload apache2
```

Sur le **poste client**, seule **`root.crt`** est ajoutée comme autorité de confiance. Apache transmet le certificat serveur **et l'intermédiaire**. La racine n'a pas besoin d'être allumée pour que le client vérifie la chaîne.

### Étape E6 — Démontrer l'intérêt d'une racine hors ligne

Renouvelez le certificat du serveur (nouvelle CSR ou nouvelle signature) **sans démarrer la machine racine**. Vérifiez que le certificat obtenu est bien signé par l'intermédiaire et que le navigateur établit toujours la confiance jusqu'à `root.crt`.

??? question "Analyse — Expert"
    1. Pourquoi une CA intermédiaire permet-elle de laisser la CA racine **éteinte** ?
    2. Dans quel ordre sont présentés les certificats au navigateur ? Quel certificat est **l'ancre de confiance** ?
    3. Quelles différences entre la compromission de `web.key`, de `intermediate.key` et de `root.key` ? Précisez les conséquences pour la **confidentialité** et l'**intégrité** de la confiance.
    4. Comment organiser le **renouvellement** et la **révocation** des certificats ? Que manque-t-il à une simple succession de commandes `openssl x509 -req` pour administrer une PKI en production ?

!!! warning "Limite volontaire du TP"
    Les commandes ci-dessus illustrent la **hiérarchie de certification**, mais ne constituent **pas un service automatisé de délivrance à la demande**. Pour une PKI exploitable à long terme, il faut notamment la gestion des demandes, l'inventaire des certificats, les renouvellements et un dispositif de révocation réellement publié et vérifié (`openssl ca`, CRL ou solution PKI dédiée). **La racine reste hors ligne.**

!!! success "Expert validé si…"
    La racine est isolée et éteinte hors opérations exceptionnelles ; la CA intermédiaire signe les certificats des serveurs ; le navigateur valide **serveur → intermédiaire → racine** ; un nouveau certificat est délivré **sans rallumer la racine** ; les risques et limites sont expliqués.

---

## Vérifications et rendu attendus

| Contrôle | Socle | Avancé | Expert |
|---|:---:|:---:|:---:|
| HTTPS fonctionne avec le bon nom DNS (SAN) | ✓ | ✓ | ✓ |
| Rôle de la clé privée, de la CSR et du certificat expliqué | ✓ | ✓ | ✓ |
| Confiance du navigateur vérifiée sans exception | ✓ | ✓ | ✓ |
| CA située sur un serveur différent d'Apache | — | ✓ | ✓ |
| Clés privées conservées sur leur machine d'origine | — | ✓ | ✓ |
| Chaîne serveur → intermédiaire → racine vérifiée | — | — | ✓ |
| Racine isolée et éteinte après signature | — | — | ✓ |
| Renouvellement serveur sans intervention de la racine | — | — | ✓ |

**Dans le compte rendu**, fournissez un schéma de l'architecture retenue, les commandes de vérification, les captures utiles (certificat et navigateur) et vos **réponses argumentées** aux questions. **N'incluez aucune clé privée, ni phrase de passe.**

!!! danger "Exigence d'analyse — DICP"
    Les réponses « c'est sécurisé » ou « HTTPS protège les données » ne suffisent pas. Identifiez les critères **Disponibilité, Intégrité, Confidentialité, Preuve**, expliquez **quel mécanisme** contribue à chaque critère et précisez **ses limites**. TLS protège les échanges ; il ne garantit ni la disponibilité d'un serveur, ni l'honnêteté d'un site, ni la preuve juridique des actions d'un utilisateur.

## Pour aller plus loin

- [Documentation OpenSSL : commande `req`](https://docs.openssl.org/master/man1/openssl-req/)
- [Documentation OpenSSL : extensions X.509](https://docs.openssl.org/master/man5/x509v3_config/)
- [Documentation Apache : module SSL](https://httpd.apache.org/docs/2.4/fr/mod/mod_ssl.html)
- [Documentation OpenSSL : outil `ca`](https://docs.openssl.org/master/man1/openssl-ca/)
