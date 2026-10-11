# 5 — Repère session : authentification, sessions et rejeu

[Retour au référentiel](cybersecu.md) · [Lecture complémentaire : TLS](couche6.md)

Les sessions HTTP sont des mécanismes applicatifs. Cette page conserve le repère OSI 5 pour étudier la continuité d’une identité authentifiée.

## Socle obligatoire

### Session Hijacking — détournement de session

Après connexion, une application associe les requêtes à un identifiant de session, souvent un cookie. Si cet identifiant est volé et réutilisable, le serveur peut reconnaître l’attaquant comme l’utilisateur : connaître le mot de passe n’est plus nécessaire.

**Conditions.** Identifiant valide obtenu par interception non chiffrée, XSS, poste compromis, journal trop bavard ou autre fuite. **Risques C/I/D.** Lecture de dossiers, opérations au nom de la victime et suppression selon ses droits.

**Protections expliquées.** HTTPS protège le transport ; `Secure` réserve l’envoi du cookie aux connexions sécurisées. `HttpOnly` empêche sa lecture par JavaScript, mais un XSS peut encore lancer des actions depuis le navigateur. `SameSite` limite certains envois intersites. Expiration et révocation réduisent la durée d’abus sans annuler les actions déjà effectuées.

**Exemple SportLudique.** Un cookie d’un service web est exposé dans un journal centralisé. Restreindre les lecteurs du journal ne suffit pas : éviter de collecter ce secret, puis invalider les sessions divulguées.

### Brute Force — force brute et attaques par dictionnaire

L’attaquant teste plusieurs mots de passe pour un compte ; un dictionnaire cible les choix probables. Il faut pouvoir soumettre des tentatives. Un compte compromis donne les droits de sa victime (C/I/D).

Mots de passe longs et non prévisibles, MFA, limitation progressive des tentatives et surveillance réduisent le risque. Un verrouillage brutal peut devenir un déni de service. CAPTCHA et filtrage IP sont complémentaires et contournables.

### Credential Stuffing — réutilisation d’identifiants divulgués

L’attaquant essaie des couples identifiant/mot de passe déjà volés ailleurs ; il ne cherche pas nécessairement à deviner le secret. La réutilisation des mots de passe et un service accessible rendent l’attaque possible.

Utiliser des secrets uniques, un gestionnaire et MFA, surveiller les connexions et révoquer les secrets compromis. Une politique de complexité ne protège pas un mot de passe complexe réutilisé. **Password spraying** : tester quelques mots de passe fréquents sur beaucoup de comptes pour éviter les seuils par compte.

**SportLudique.** VPN, AD et services web sont des points d’authentification à analyser séparément ; la présence de MFA sur l’un ne prouve pas sa présence sur tous.

## Concepts avancés

### Replay Attack — attaque par rejeu

Un attaquant réémet un message, jeton ou échange précédemment valide pour répéter une opération ou se faire reconnaître. L’attaque suppose que le système accepte cette réutilisation : chiffrer un message ne le rend pas automatiquement unique.

Un nonce (valeur unique), un numéro de séquence ou un horodatage **authentifié et contrôlé** permet de détecter les répétitions ; le serveur doit vérifier la fraîcheur et conserver l’état nécessaire. Les protections anti-rejeu des VPN dépendent du protocole et de ses paramètres.

TLS protège les échanges ordinaires contre la réinjection de ses enregistrements, mais pas toute réutilisation d’un jeton volé au niveau applicatif. Le mode TLS 1.3 0-RTT a des risques spécifiques de rejeu : éviter les opérations sensibles non idempotentes dans les données précoces.

**Exemple.** Une demande de validation signée est soumise deux fois. La signature garantit l’origine/intégrité, pas à elle seule que l’opération n’a jamais été exécutée.

### Fixation et cycle de vie des sessions

Dans une fixation de session, l’attaquant fait utiliser un identifiant qu’il connaît avant l’authentification. Régénérer l’identifiant après connexion ou changement de privilèges et invalider l’ancien. Prévoir délai d’inactivité, durée maximale et déconnexion effective côté serveur.

## Expertise — compte, session ou poste compromis ?

Un utilisateur conteste des opérations après une connexion MFA légitime. Examiner vol de session, poste compromis, durée de validité et révocation ; la MFA initiale ne suffit pas à exclure un détournement. Corréler authentification AD/VPN, sessions applicatives et journaux web réellement disponibles, sans enregistrer les secrets eux-mêmes.

## Références

- [OWASP — gestion des sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- [RFC 8446, §8 — rejeu et TLS 1.3 0-RTT](https://www.rfc-editor.org/rfc/rfc8446.html).
