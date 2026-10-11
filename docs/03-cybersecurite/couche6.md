# 6 — Repère présentation : TLS, HTTPS et confiance

[Retour au référentiel](cybersecu.md) · [Sessions et authentification](couche5.md)

TLS est placé ici comme repère pédagogique de sécurisation des échanges ; son positionnement réel dans la pile TCP/IP ne correspond pas strictement à OSI 6.

## Socle obligatoire

### SSL Stripping — maintien frauduleux en HTTP

Lorsqu’un utilisateur commence par HTTP, un attaquant sur le chemin peut remplacer la redirection ou les liens HTTPS afin que le navigateur reste en HTTP, tandis que l’attaquant communique lui-même en HTTPS avec le serveur. Il ne « casse » pas le chiffrement TLS : il empêche son utilisation côté victime.

**Conditions.** Premier échange non sécurisé et absence d’une politique HTTPS déjà imposée. **Risques :** lecture et modification des échanges ou vol de session (C/I).

**Protection.** Utiliser directement HTTPS et HSTS pour les visites suivantes. HSTS reçu sur une connexion HTTPS valide indique au navigateur d’imposer HTTPS ; une simple redirection HTTP reste interceptable lors de la première visite. Une inscription preload peut traiter ce cas pour les navigateurs concernés, mais impose des contraintes de domaine et de sous-domaines.

**SportLudique.** Vérifier la politique du service exposé par le reverse proxy et le comportement du navigateur. Ne pas inventer une activation HSTS existante ; `includeSubDomains` ne doit pas être ajouté si tous les sous-domaines ne sont pas prêts.

### Défaut de validation du certificat — vulnérabilité de confiance

Un certificat sert à relier une identité à une clé, dans une chaîne de confiance. Ignorer une erreur de nom, de validité ou d’autorité permet à un attaquant sur le chemin de présenter sa propre identité sans vérification correcte.

Vérifier nom du serveur, chaîne de certification et validité ; protéger les clés privées et les autorités internes. Distribuer la confiance de la PKI par un mécanisme maîtrisé. Cliquer systématiquement sur « continuer » transforme un avertissement utile en mauvaise pratique.

**Risques :** interception ou modification malgré une connexion techniquement chiffrée. Le chiffrement avec le mauvais interlocuteur ne garantit pas la confidentialité vis-à-vis de lui.

## Concepts avancés — limites du chiffrement

Un reverse proxy peut terminer TLS et voir le contenu en clair avant de le transmettre au serveur. Étudier et protéger ce second trajet selon la zone traversée. Un certificat valide ne garantit ni l’honnêteté du site ni l’absence de SQLi.

TLS protège le transport ; il ne protège pas les données déjà déchiffrées sur un poste compromis. Utiliser les versions et suites recommandées pour la plateforme, maintenir les logiciels et protéger les clés. Un algorithme robuste ne compense pas une clé divulguée.

## Expertise — justifier les frontières de confiance

Décrire qui voit les données entre navigateur, reverse proxy, serveur et supervision. Justifier authentification des interlocuteurs, chiffrement des trajets nécessaires, distribution et renouvellement des certificats, protection des clés et révocation après compromission. Le choix doit tenir compte du fonctionnement effectif de SportLudique.

## Références

- [RFC 6797 — HSTS](https://www.rfc-editor.org/rfc/rfc6797.html).
- [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html).
