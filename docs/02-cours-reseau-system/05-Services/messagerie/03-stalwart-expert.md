# TP Stalwart — Expert : SPF, DKIM et DMARC

## Objectif

Configurer **SPF, DKIM et DMARC**, puis vérifier leur fonctionnement lors d’un échange entre deux domaines SportLudique.

Le serveur de messagerie du socle doit être opérationnel. L’intégration Active Directory n’est pas nécessaire pour réaliser ce travail.

!!! tip "Afficher les en-têtes dans Thunderbird"
    Sélectionnez le message reçu, puis utilisez **Ctrl + U** pour afficher sa source complète. Recherchez les en-têtes `Authentication-Results`, `Received-SPF` et `DKIM-Signature` pour examiner les résultats SPF, DKIM et DMARC.

## 1. SPF — Autoriser les serveurs expéditeurs

**SPF** permet à un domaine de déclarer dans le DNS les adresses IP autorisées à envoyer des messages en son nom.

Le serveur destinataire compare l’IP de la connexion SMTP avec les autorisations du domaine utilisé dans l’enveloppe SMTP (`MAIL FROM`). SPF ne vérifie pas directement l’adresse visible dans le champ `From:` du message.

### Mise en œuvre

Publier dans la zone `ville.sportludique.fr` un enregistrement TXT autorisant votre serveur expéditeur.

Gabarit à adapter avant publication :

    @ IN TXT "v=spf1 ip4:IP_SORTIE_SMTP -all"

- `ip4:` indique l’IPv4 autorisée.
- `-all` déclare les autres adresses non autorisées.

Utiliser **l’adresse réellement vue par le serveur destinataire**. En présence de NAT, il s’agit de l’adresse après traduction, pas nécessairement de l’adresse de la VM.

### Vérification

- Interroger le DNS pour retrouver le TXT.
- Envoyer un message vers un autre site.
- Relever le résultat **`spf=pass`** ajouté par le serveur destinataire.

## 2. DKIM — Signer les messages

**DKIM** ajoute une signature cryptographique aux messages sortants.

- La **clé privée** reste sur le serveur expéditeur.
- La **clé publique** est publiée dans le DNS.
- Le serveur destinataire utilise cette clé publique pour vérifier la signature.

Le **sélecteur** identifie la clé utilisée. Il apparaît dans le champ `s=` de l’en-tête `DKIM-Signature` ; `d=` indique le domaine signataire.

### Mise en œuvre

- Activer la génération des clés DKIM pour votre domaine dans Stalwart.
- Récupérer les enregistrements DNS proposés par le serveur.
- Publier les TXT correspondant aux sélecteurs utilisés.
- Envoyer un message depuis un utilisateur authentifié.

Dans le fichier de zone DNS de votre site, ajoutez l’enregistrement **TXT fourni par Stalwart**. Par exemple, dans la zone `ville.sportludique.fr`, avec le sélecteur `mail` :

```dns
mail2026._domainkey IN TXT "v=DKIM1; k=rsa; p=CLE_PUBLIQUE_FOURNIE_PAR_STALWART"
```

Le nom étant relatif à la zone, le serveur DNS le complète en `mail._domainkey.ville.sportludique.fr.`.

Remplacez **`mail` par le sélecteur réellement utilisé par Stalwart** et recopiez **la valeur TXT complète qu’il fournit**, avec le type de clé et la véritable clé publique. Ne publiez jamais la clé privée.

Pensez à **incrémenter le numéro de série de la zone**, vérifier sa syntaxe et la recharger.

### Vérification

- Retrouver la clé publique dans le DNS.
- Observer l’en-tête `DKIM-Signature` du message reçu.
- Relever le résultat **`dkim=pass`** ajouté par le serveur destinataire.

## 3. DMARC — Contrôler le domaine visible

**DMARC** relie les résultats SPF et DKIM au domaine de l’adresse visible dans `From:`.

Un message passe DMARC si au moins une condition est remplie :

- SPF réussit et son domaine est aligné avec celui de `From:`.
- DKIM réussit et son domaine signataire est aligné avec celui de `From:`.

DMARC permet aussi de publier une politique pour les messages qui échouent :

| Politique | Traitement demandé au destinataire |
|---|---|
| `none` | Observer les résultats, sans demander de traitement particulier |
| `quarantine` | Considérer le message comme suspect |
| `reject` | Refuser le message |

### Mise en œuvre

Commencer par une politique d’observation :

    _dmarc IN TXT "v=DMARC1; p=none; aspf=s; adkim=s"

`aspf=s` et `adkim=s` imposent un alignement **strict** : le domaine vérifié doit être exactement celui de `From:`. Ce choix distingue les sites qui partagent le domaine parent `sportludique.fr`.

Pour demander des rapports agrégés, ajouter une adresse existante :

    _dmarc IN TXT "v=DMARC1; p=none; aspf=s; adkim=s; rua=mailto:dmarc@ville.sportludique.fr"

Les rapports sont périodiques : leur réception n’est pas nécessairement immédiate.

### Vérification

- Retrouver le TXT `_dmarc` dans le DNS.
- Envoyer un message vers un autre site.
- Relever **`dmarc=pass`** et identifier le mécanisme aligné qui permet cette réussite.

Ne passer à `quarantine` ou `reject` qu’après vérification des émetteurs légitimes. La politique publiée et les décisions configurées sur le serveur destinataire sont deux éléments distincts.

## 4. Valider avec une autre équipe

Organiser un échange entre deux domaines, par exemple Chartres et Tours.

Avant l’envoi, vérifier :

- La résolution des MX et des noms des serveurs.
- La connectivité SMTP sur TCP 25 entre les deux sites.
- L’accès, depuis chaque serveur, aux enregistrements TXT de l’autre domaine.

Envoyer un message, puis une réponse. Dans la source des messages reçus, retrouver les résultats ajoutés par le serveur destinataire :

| Mécanisme | Résultat attendu |
|---|---|
| SPF | `spf=pass` |
| DKIM | `dkim=pass` |
| DMARC | `dmarc=pass` |

!!! note "Trois contrôles complémentaires"

    SPF autorise une IP à expédier pour un domaine. DKIM vérifie une signature de domaine. DMARC exige un lien avec le domaine visible dans `From:`. Aucun de ces mécanismes ne garantit que le contenu du message est honnête.

## Exemple

## Exemple : lire les contrôles d’un message reçu

Les identités, domaines et adresses IP ci-dessous sont fictifs. Les longues valeurs cryptographiques sont abrégées.

### Expéditeur et destinataire

```text
From: Alice Martin <alice@entreprise.example>
To: Bob Dupont <bob@partenaire.example>
Subject: Réunion de projet
Date: Mon, 26 Oct 2026 10:46:42 +0000

Return-Path: <alice@entreprise.example>
```

- **`From:`** : adresse de l’expéditeur affichée au destinataire.
- **`Return-Path:`** : adresse de retour correspondant à l’enveloppe SMTP, utilisée notamment pour SPF.

### SPF : l’adresse IP expéditrice est-elle autorisée ?

```text
Received-SPF: Pass
    identity=mailfrom;
    client-ip=192.0.2.25;
    envelope-from="alice@entreprise.example";
```

Le serveur destinataire indique **`Pass`** : l’adresse **`192.0.2.25`** est autorisée à expédier pour le domaine `entreprise.example`.

L’enregistrement DNS correspondant pourrait être :

```dns
entreprise.example. IN TXT "v=spf1 ip4:192.0.2.25 -all"
```

### DKIM : quel domaine a signé le message ?

```text
DKIM-Signature:
    v=1;
    a=rsa-sha256;
    d=entreprise.example;
    s=mail2026;
    c=relaxed/relaxed;
    h=From:To:Subject:Date:Message-ID:MIME-Version:Content-Type;
    bh=[empreinte du corps du message];
    b=[signature cryptographique];
```

| Paramètre | Signification |
|---|---|
| **`d=entreprise.example`** | Domaine signataire |
| **`s=mail2026`** | Sélecteur de la clé |
| `a=rsa-sha256` | Algorithme de signature |
| `h=…` | En-têtes couverts par la signature |
| `bh=…` | Empreinte du corps du message |
| `b=…` | Signature cryptographique |

Le destinataire recherche la clé publique dans le TXT :

```dns
mail2026._domainkey.entreprise.example.
```

!!! note "Une signature présente n’est pas forcément valide"
    L’en-tête `DKIM-Signature` décrit la signature. Le résultat de sa vérification apparaît dans `Authentication-Results`.

### Résultats SPF, DKIM et DMARC

```text
Authentication-Results: mx.partenaire.example;
    spf=pass smtp.mailfrom=entreprise.example;
    dkim=pass header.d=entreprise.example;
    dmarc=pass header.from=entreprise.example
```

| Résultat | Interprétation |
|---|---|
| **`spf=pass`** | L’IP expéditrice est autorisée pour le domaine de l’enveloppe |
| **`dkim=pass`** | La signature du domaine a été vérifiée avec succès |
| **`dmarc=pass`** | Au moins un mécanisme valide est aligné avec le domaine du `From:` |

Ici, le domaine visible dans `From:`, celui de l’enveloppe SMTP et le domaine signataire DKIM sont identiques : **`entreprise.example`**. SPF et DKIM réussissent et sont tous deux alignés avec le domaine visible.

## Documentation officielle

- [SPF](https://stalw.art/docs/mta/authentication/spf/){ target="_blank" rel="noopener" }
- [Signature DKIM](https://stalw.art/docs/mta/authentication/dkim/sign/){ target="_blank" rel="noopener" }
- [Gestion des clés DKIM](https://stalw.art/docs/domains/dkim-rotation/){ target="_blank" rel="noopener" }
- [DMARC](https://stalw.art/docs/mta/authentication/dmarc/){ target="_blank" rel="noopener" }