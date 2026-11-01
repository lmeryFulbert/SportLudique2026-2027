# OpenSSL — Aide-mémoire

**OpenSSL** est une boîte à outils libre de cryptographie et de gestion de TLS. On la retrouve partout : serveurs Web, messagerie, VPN, outils d'administration, applications et bibliothèques logicielles. Sous Linux, sa commande `openssl` permet notamment de **créer des clés**, **préparer des demandes de certificats**, **inspecter des certificats X.509** et **tester des connexions TLS**.

Cette fiche est un **aide-mémoire** : recherchez une opération, copiez la commande, adaptez les noms de fichiers. 

Pour comprendre les mécanismes, consultez le [cours TLS / PKI](tls-presentation.md) ; 

pour déployer une autorité de certification, suivez les [TP](tls-pki.md).

!!! info "Contexte SportLudique"
    Les exemples utilisent `www.chartres.sportludique.fr` et une chaîne de confiance **racine → CA du groupe → serveur**. Les commandes visent OpenSSL 3.x (notamment Debian 13).

## 1. Repérer les fichiers

| Extension | Contenu habituel | À retenir |
|---|---|---|
| `.key` | Clé privée | **Secrète** : ne jamais publier ni envoyer à la CA. |
| `.csr` | Demande de signature (CSR) | À transmettre à la CA pour obtenir un certificat. |
| `.crt`, `.cer` | Certificat X.509 | Contient notamment une clé **publique** et une identité certifiée. |
| `.pem` | Encodage texte Base64 avec en-têtes | Peut contenir une clé, un certificat ou une chaîne. |
| `.der` | Encodage binaire | Autre représentation possible d'un certificat. |
| `.p12`, `.pfx` | Conteneur PKCS#12 | Peut inclure une **clé privée** : à protéger. |
| `.crl` | Liste de révocation | Identifie des certificats révoqués par une CA. |

!!! tip "PEM n'est pas synonyme de certificat"
    Ouvrez le fichier avec `head` : `-----BEGIN CERTIFICATE-----` indique un certificat ; `-----BEGIN PRIVATE KEY-----` indique une clé privée non chiffrée ; `-----BEGIN ENCRYPTED PRIVATE KEY-----` indique une clé privée chiffrée.

## 2. Examiner un certificat

| Je veux… | Commande |
|---|---|
| Voir toutes les informations | `openssl x509 -in serveur.crt -noout -text` |
| Voir le sujet | `openssl x509 -in serveur.crt -noout -subject` |
| Voir l'autorité émettrice | `openssl x509 -in serveur.crt -noout -issuer` |
| Voir les dates de validité | `openssl x509 -in serveur.crt -noout -dates` |
| Voir les noms DNS autorisés (SAN) | `openssl x509 -in serveur.crt -noout -ext subjectAltName` |
| Voir les usages du certificat | `openssl x509 -in serveur.crt -noout -ext keyUsage,extendedKeyUsage` |
| Voir si le certificat est une CA | `openssl x509 -in serveur.crt -noout -ext basicConstraints` |
| Voir l'empreinte SHA-256 | `openssl x509 -in serveur.crt -noout -fingerprint -sha256` |
| Vérifier qu'il reste valide au moins 30 jours | `openssl x509 -in serveur.crt -noout -checkend 2592000` |

`-noout` évite d'afficher le certificat encodé ; `-text` affiche son contenu lisible.

## 3. Générer et examiner une clé privée

**Créer une clé RSA de 3 072 bits :**

```bash
umask 077
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out serveur.key
chmod 600 serveur.key
```

**Créer une clé ECDSA P-256 (variante) :**

```bash
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out serveur-ec.key
```

**Examiner la clé sans afficher sa valeur privée :**

```bash
openssl pkey -in serveur.key -noout -text_pub
```

!!! warning "Clés de CA et clés de service"
    La clé privée d'une **CA** doit être chiffrée et particulièrement protégée. Une clé de **serveur** peut rester non chiffrée pour permettre le démarrage automatique du service, mais ses permissions doivent être strictes. Ne remplacez jamais une clé déjà en service sans préparation.

## 4. Créer et lire une demande de certificat (CSR)

**Créer une CSR pour le serveur Web de Chartres :**

```bash
openssl req -new -sha256 \
  -key serveur.key \
  -out serveur.csr \
  -subj "/C=FR/O=SportLudique/CN=www.chartres.sportludique.fr" \
  -addext "subjectAltName=DNS:www.chartres.sportludique.fr"
```

**Examiner et vérifier la signature de la CSR :**

```bash
openssl req -in serveur.csr -noout -verify -text
```

**Plusieurs noms DNS ?** Dans `-addext`, séparez-les par une virgule :

```text
subjectAltName=DNS:www.chartres.sportludique.fr,DNS:intranet.chartres.sportludique.fr
```

!!! note "Une demande n'est pas une autorisation"
    La CA doit contrôler les noms DNS demandés et décider des extensions du certificat final. Le champ **SAN** est celui utilisé pour vérifier le nom du serveur TLS.

## 5. Signer un certificat avec la CA du groupe

Cette opération s'effectue **sur la machine de la CA intermédiaire déjà initialisée**. L'installation de la CA, son registre et son fichier `openssl.cnf` sont décrits dans les TP, pas dans cet aide-mémoire.

**1 — Contrôler la CSR reçue :**

```bash
openssl req -in csr/web.csr -noout -verify -text
```

**2 — Définir les extensions approuvées** dans `csr/web.ext` :

```ini
[server]
basicConstraints = critical, CA:FALSE
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
subjectAltName = DNS:www.chartres.sportludique.fr
```

**3 — Signer pour 90 jours :**

```bash
cd /root/pki-intermediate
openssl ca -config openssl.cnf -notext -days 90 \
  -in csr/web.csr -out certs/web.crt \
  -extfile csr/web.ext -extensions server
```

**À remettre au serveur :** son certificat `web.crt` et le certificat **public** de la CA intermédiaire. **Jamais la clé privée de la CA.** Vérifiez avant signature que la racine et l'intermédiaire resteront valides pendant toute la durée demandée.

## 6. Vérifier un certificat et sa chaîne de confiance

**Vérifier le certificat, son usage TLS serveur et son nom DNS :**

```bash
openssl verify -show_chain -x509_strict -purpose sslserver \
  -verify_hostname www.chartres.sportludique.fr \
  -CAfile root.crt \
  -untrusted intermediate.crt \
  serveur.crt
```

**Résultat attendu :** `serveur.crt: OK`.

**Vérifier que la clé privée correspond au certificat :** les deux empreintes doivent être **identiques**.

```bash
openssl pkey -in serveur.key -pubout -outform DER | openssl dgst -sha256
openssl x509 -in serveur.crt -pubkey -noout | \
  openssl pkey -pubin -outform DER | openssl dgst -sha256
```

**Construire la chaîne à présenter par le serveur :**

```bash
cat serveur.crt intermediate.crt > fullchain.pem
```

La racine est normalement déjà présente dans le magasin de confiance du client ; on ne l'ajoute pas au `fullchain.pem` du serveur.

## 7. Tester un service TLS

**HTTPS (TCP 443) :**

```bash
openssl s_client -connect www.chartres.sportludique.fr:443 \
  -servername www.chartres.sportludique.fr \
  -verify_hostname www.chartres.sportludique.fr \
  -CAfile root.crt -verify_return_error </dev/null
```

**SMTP avec STARTTLS (TCP 25) :**

```bash
openssl s_client -starttls smtp -connect mail.sportludique.fr:25 \
  -servername mail.sportludique.fr \
  -verify_hostname mail.sportludique.fr \
  -CAfile root.crt -verify_return_error </dev/null
```

**IMAP avec STARTTLS (TCP 143) :**

```bash
openssl s_client -starttls imap -connect mail.sportludique.fr:143 \
  -servername mail.sportludique.fr \
  -verify_hostname mail.sportludique.fr \
  -CAfile root.crt -verify_return_error </dev/null
```

**IMAPS (TLS implicite, TCP 993) :**

```bash
openssl s_client -connect mail.sportludique.fr:993 \
  -servername mail.sportludique.fr \
  -verify_hostname mail.sportludique.fr \
  -CAfile root.crt -verify_return_error </dev/null
```

!!! tip "Lire le résultat"
    Cherchez `Verification: OK` et `Verify return code: 0 (ok)`. Sans `-verify_return_error`, `s_client` peut continuer malgré une erreur de vérification. Le certificat racine doit être le **bon** certificat de confiance SportLudique.

## 8. Convertir les formats

| Opération | Commande |
|---|---|
| DER → PEM | `openssl x509 -inform DER -in certificat.cer -out certificat.pem` |
| PEM → DER | `openssl x509 -in certificat.pem -outform DER -out certificat.cer` |
| Lire un fichier PKCS#12 | `openssl pkcs12 -in identite.p12 -info -noout` |

**Exporter certificat et clé privée dans un PKCS#12 :**

```bash
openssl pkcs12 -export \
  -inkey serveur.key -in serveur.crt \
  -certfile intermediate.crt \
  -out identite.p12
```

!!! warning "Le fichier `.p12` peut contenir la clé privée"
    Choisissez un mot de passe d'export robuste et ne distribuez pas ce fichier comme un simple certificat public.

## 9. Révoquer un certificat (CA de laboratoire)

Sur la CA intermédiaire, pour un certificat **émis par cette CA** et présent dans son registre :

```bash
cd /root/pki-intermediate
openssl ca -config openssl.cnf -revoke certs/web.crt -crl_reason keyCompromise
openssl ca -config openssl.cnf -gencrl -crlexts crl_ext \
  -out crl/intermediate.crl.pem
openssl crl -in crl/intermediate.crl.pem -noout -text
```

**Tester le rejet du certificat révoqué :**

```bash
openssl verify -CAfile certs/root.crt \
  -untrusted certs/intermediate.crt \
  -CRLfile crl/intermediate.crl.pem \
  -crl_check certs/web.crt
```

Le dernier contrôle doit **échouer** pour le certificat révoqué. Générer une CRL ne suffit pas : les clients doivent aussi pouvoir la récupérer et la vérifier. Faites l'exercice avec un certificat de test.

## 10. Dépannage express

| Message | Piste de diagnostic |
|---|---|
| `unable to get local issuer certificate` | Intermédiaire manquant ou racine non reconnue. |
| `hostname mismatch` | Nom utilisé absent des SAN. |
| `certificate has expired` | Certificat expiré ; examiner les dates de toute la chaîne. |
| `certificate is not yet valid` | Horloge incorrecte ou certificat pas encore valide. |
| `unsuitable certificate purpose` | Usages KU / EKU incompatibles. |
| `permitted subtree violation` | Nom DNS hors du périmètre autorisé à la CA. |
| `path length constraint exceeded` | Hiérarchie de CA non conforme. |
| `certificate revoked` | Certificat signalé révoqué lors d'un contrôle de révocation. |

## 11. Commandes et options à retenir

| Élément | Rôle |
|---|---|
| `openssl version -a` | Afficher la version et la configuration OpenSSL. |
| `req` | Créer ou inspecter une CSR. |
| `x509` | Examiner ou convertir un certificat X.509. |
| `pkey`, `genpkey` | Examiner ou générer des clés. |
| `ca` | Émettre et révoquer via une CA configurée. |
| `verify` | Vérifier une chaîne de certification. |
| `s_client` | Se connecter à un service TLS pour le diagnostiquer. |
| `-in` / `-out` | Fichier d'entrée / fichier de sortie. |
| `-noout` | Ne pas afficher les données encodées. |
| `-text` | Afficher les détails lisibles. |
| `-CAfile` | Fournir les certificats de confiance pour la vérification. |

**Documentation officielle :** [OpenSSL](https://docs.openssl.org/3.5/) · [req](https://docs.openssl.org/3.5/man1/openssl-req/) · [x509](https://docs.openssl.org/3.5/man1/openssl-x509/) · [verify](https://docs.openssl.org/3.5/man1/openssl-verify/) · [s_client](https://docs.openssl.org/3.5/man1/openssl-s_client/).
