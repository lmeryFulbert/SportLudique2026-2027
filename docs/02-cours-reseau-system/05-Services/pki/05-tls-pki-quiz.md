# TLS et PKI — Vérifiez vos connaissances

## Socle

<quiz>
**1 — Que peut-on conclure d'une connexion HTTPS validée par le navigateur ?**

- [x] Les échanges HTTP sont protégés par TLS jusqu'au point de terminaison TLS.
- [x] Le navigateur a validé le certificat, le nom DNS demandé et sa chaîne de confiance.
- [ ] Le propriétaire du site est nécessairement honnête.
- [ ] L'application web ne présente aucune vulnérabilité.

**Explication :** HTTPS protège les échanges en transit et authentifie le service pour le nom demandé. Il ne garantit ni la fiabilité du contenu ni l'absence de failles applicatives.
</quiz>

<quiz>
**2 — Où doit figurer `www.chartres.sportludique.fr` dans le certificat du serveur Apache ?**

- [ ] Uniquement dans le CN de la CA.
- [x] Dans l'extension SAN, sous forme de nom DNS.
- [ ] Uniquement dans le nom du fichier `.crt`.
- [ ] Dans la clé privée du serveur.

**Explication :** Le champ **Subject Alternative Name (SAN)** indique les noms couverts par le certificat. Le CN ne remplace pas le SAN.
</quiz>

<quiz>
**3 — Quel certificat faut-il importer comme autorité de confiance sur le poste client SportLudique ?**

- [ ] La clé privée `web.key`.
- [ ] La clé privée de la CA du groupe.
- [x] Le certificat public de la CA racine SportLudique, après vérification de son empreinte.
- [ ] La demande de signature `web.csr`.

**Explication :** Le client accorde sa confiance à la CA racine. Les clés privées restent secrètes ; la CSR n'est pas un certificat de confiance.
</quiz>

<quiz>
**4 — Quel rôle joue la cryptographie symétrique dans HTTPS ?**

- [ ] Signer les certificats des CA intermédiaires.
- [x] Chiffrer et authentifier efficacement les données échangées à l'aide de clés de session.
- [ ] Remplacer les enregistrements DNS.
- [ ] Transmettre la clé privée du serveur au navigateur.

**Explication :** Après l'établissement de la connexion TLS et des clés de session, les données applicatives sont protégées par des mécanismes cryptographiques symétriques.
</quiz>

## Avancé

<quiz>
**5 — Que contient une CSR transmise à une autorité de certification ?**

- [x] La clé publique du serveur et les informations demandées, notamment le SAN.
- [x] Une signature produite avec la clé privée correspondant à la clé publique.
- [ ] La clé privée du serveur.
- [ ] La preuve que le demandeur est autorisé à utiliser tous les noms demandés.

**Explication :** La CSR permet de demander un certificat sans divulguer la clé privée. La CA doit vérifier les noms autorisés et décider des extensions du certificat délivré.
</quiz>

<quiz>
**6 — Que signifie `pathlen:0` dans les contraintes d'une CA intermédiaire ?**

- [ ] Cette CA ne peut pas signer de certificats serveurs.
- [x] Aucune CA intermédiaire supplémentaire non auto-émise ne peut se trouver sous elle dans une chaîne valide.
- [ ] Tous les noms DNS de SportLudique lui sont automatiquement autorisés.
- [ ] La CA racine doit être connectée pendant chaque visite HTTPS.

**Explication :** `pathlen:0` autorise l'émission de certificats finaux, mais empêche de prolonger la hiérarchie par une nouvelle sous-CA ordinaire.
</quiz>

<quiz>
**7 — Apache présente son certificat et celui de la CA intermédiaire du groupe. Que doit vérifier le navigateur ?**

- [ ] Que la clé privée de la CA racine est disponible sur le poste.
- [x] La chaîne jusqu'à une autorité de confiance, le nom DNS, les dates et les usages du certificat.
- [ ] Que toutes les CA envoyées par Apache deviennent automatiquement fiables.
- [ ] Que le serveur de la CA racine répond à chaque connexion.

**Explication :** La présence d'un certificat dans la chaîne envoyée par Apache ne suffit pas à lui accorder confiance. Le client valide la chaîne à partir d'une autorité déjà approuvée.
</quiz>

<quiz>
**8 — La CA Chartres possède une contrainte `nameConstraints` autorisant uniquement les noms de Chartres. Elle signe un certificat pour `www.tours.sportludique.fr`. Quelles affirmations sont exactes ?**

- [ ] La signature est mathématiquement impossible.
- [x] Un client qui valide cette contrainte doit refuser la chaîne.
- [x] La procédure d'émission devrait empêcher la délivrance de ce certificat.
- [ ] Importer la clé privée de Chartres dans le navigateur résout le problème.

**Explication :** Une CA peut techniquement signer un certificat hors de son périmètre. Les contraintes de noms inscrites dans sa certification doivent être vérifiées lors de la validation de la chaîne.
</quiz>

## Expert

<quiz>
**9 — Un certificat serveur est signé par la CA du groupe, mais le navigateur indique « autorité inconnue ». Quelles causes sont possibles ?**

- [x] Le certificat de la CA racine SportLudique n'est pas présent dans le magasin de confiance utilisé par le navigateur.
- [x] Apache ne transmet pas le certificat intermédiaire nécessaire à la construction de la chaîne, et le client ne le possède pas déjà.
- [ ] Le certificat serveur comporte un SAN correspondant exactement au site visité.
- [ ] La clé privée du serveur n'a pas été copiée sur le poste client.

**Explication :** Pour valider une chaîne, le client doit disposer des certificats intermédiaires nécessaires et d'une racine approuvée. La clé privée du serveur ne doit jamais être transmise au client.
</quiz>

<quiz>
**10 — Le navigateur fait confiance à la CA racine SportLudique, mais refuse le certificat HTTPS d'Apache. Quelles situations peuvent expliquer ce refus ?**

- [x] Le certificat a expiré.
- [x] Le nom DNS demandé n'apparaît pas dans les SAN du certificat serveur.
- [x] Une contrainte `nameConstraints` de la CA intermédiaire est violée.
- [ ] Le certificat serveur a été signé par une CA intermédiaire valide et autorisée pour ce nom.

**Explication :** La confiance dans la racine ne suffit pas : le navigateur contrôle également les dates, le nom du service, les usages et les contraintes imposées par les CA de la chaîne.
</quiz>
