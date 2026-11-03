# 7 — Application : DNS, web et compromission

[Retour au référentiel](cybersecu.md)

## Socle obligatoire

### DNS Spoofing — falsification de réponse DNS

Le client attend une réponse reliant un nom à des données DNS. Un attaquant tente de faire accepter une réponse trompeuse, par exemple une IP hostile. Il doit contrôler un chemin ou un composant, ou réussir à produire une réponse correspondant à la demande en cours.

**Risque C/I/D.** Redirection vers un faux service, modification des échanges si les autres protections échouent, ou indisponibilité. Une IP DNS falsifiée ne fournit pas automatiquement un certificat HTTPS valide pour le nom demandé.

**Protection.** Utiliser un résolveur maîtrisé, protéger ses réglages et l’administration DNS, maintenir le logiciel et conserver une validation TLS correcte. La validation DNSSEC apporte une vérification cryptographique des données signées avec une chaîne de confiance valide ; elle n’est pas un chiffrement.

**SportLudique.** Comparer réponse du résolveur interne et données du serveur autoritaire prévu. Une différence peut être légitime en split-horizon : vérifier la vue interrogée avant de conclure.

### SQL Injection / SQLi — injection SQL

Une application concatène une entrée utilisateur dans le texte d’une requête SQL. Le SGBD interprète alors une partie de l’entrée comme des instructions, au lieu de données. Le point d’entrée peut être un formulaire, une URL ou toute donnée utilisée dans la requête.

**Conditions/risques.** Construction vulnérable et droits suffisants du compte de base : lecture (C), modification (I), destruction ou surcharge (D).

**Protection essentielle.** Les requêtes paramétrées séparent structure et valeurs. Valider types et contraintes métier complète, mais ne remplace pas cette séparation. Pour les éléments non paramétrables comme un nom de colonne, choisir dans une liste fermée. Réduire les droits du compte SQL limite les dommages. Un WAF peut filtrer certains motifs, sans corriger le code.

**Exemple conceptuel.** « Chercher un utilisateur dont le nom vaut une valeur » doit rester une requête de structure fixe, quelle que soit cette valeur. Une requête préparée qui concatène encore un fragment non fiable reste vulnérable.

### Cross-Site Scripting / XSS — injection de script côté navigateur

Une donnée non fiable est rendue comme du code actif dans une page. Le navigateur l’exécute dans le contexte du site. Le XSS peut être stocké, réfléchi ou lié à une manipulation DOM côté client.

**Conditions/risques.** Sortie ou manipulation DOM dangereuse ; actions sous l’identité de la victime, accès aux données visibles, modification de page (C/I).

**Protection.** Encoder selon le contexte de sortie (HTML, attribut, JavaScript, URL), utiliser des API sûres et un assainissement adapté si du HTML doit être accepté. Une CSP correctement conçue ajoute une barrière ; elle ne remplace pas les corrections. `HttpOnly` empêche la lecture d’un cookie mais pas toutes les actions du script.

**Exemple.** Un commentaire est affiché comme HTML sans traitement : le contenu enregistré devient actif chez les lecteurs. Le reverse proxy ne sait pas nécessairement distinguer le commentaire utile du code hostile.

### Cross-Site Request Forgery / CSRF — falsification de requête intersite

Un site hostile fait envoyer par le navigateur une requête à un autre site où la victime est connectée. Les cookies peuvent être ajoutés automatiquement ; le serveur confond session authentifiée et intention de l’utilisateur.

**Conditions/risques.** Authentification automatiquement jointe, action sensible acceptée sans contrôle adapté : modification ou suppression (I/D).

**Protection.** Jeton CSRF imprévisible validé côté serveur et lié au contexte de session, vérification d’Origin/Referer selon une politique maîtrisée, cookies SameSite en complément. Éviter les changements d’état par GET. HTTPS n’empêche pas un navigateur d’envoyer volontairement une requête chiffrée au mauvais moment. Un XSS peut contourner des protections CSRF.

**Exemple.** La victime visite une page externe qui tente de déclencher un changement de coordonnées sur l’application SportLudique. Vérifier l’intention au-delà du seul cookie.

### Broken Access Control — contrôle d’accès défaillant

Une application vérifie la connexion mais pas le droit d’accéder à chaque objet ou fonction. Changer un identifiant dans une URL peut alors ouvrir le dossier d’un autre utilisateur (**IDOR**).

**Conditions/risques.** Autorisation absente ou incohérente côté serveur ; lecture, modification, suppression (C/I/D). Masquer un bouton n’empêche pas une requête directe.

**Protection.** Refuser par défaut et contrôler chaque opération côté serveur, selon l’identité, le rôle et l’objet. Tester des utilisateurs de rôles différents ; journaliser les refus pertinents. Un identifiant difficile à deviner ne remplace pas l’autorisation.

### Erreurs de configuration — vulnérabilités, pas une attaque unique

Compte par défaut, partage trop ouvert, interface d’administration publique, secret dans Git, mode debug ou règle « pass all » durable créent des occasions d’exploitation. L’attaque dépend de la faiblesse : lecture anonyme, usage d’un secret ou accès administrateur.

Réduire les services exposés, appliquer des configurations revues et des droits minimaux, protéger les secrets et corriger les vulnérabilités. Après fuite d’un secret, le révoquer : supprimer le fichier visible ne retire pas les copies ni l’historique. Dans SportLudique, un profil permissif utilisé pour diagnostiquer doit être identifié comme temporaire et remplacé par les règles justifiées.

### Ransomware — rançongiciel

Après un accès initial (compte volé, hameçonnage, logiciel vulnérable…), un logiciel chiffre ou rend indisponibles des données. Une exfiltration peut précéder l’extorsion. Le succès dépend des droits obtenus et de l’accès aux fichiers et sauvegardes.

**Risques.** D et I par altération ; C si vol. **Protection.** Correctifs, MFA, droits limités, protection des postes et filtrage de propagation réduisent les possibilités. Des sauvegardes isolées/hors ligne ou correctement immuables, avec administration séparée et restauration testée, réduisent l’impact. Une réplication ou un snapshot accessible au compte compromis peut être détruit ou recopier l’altération.

**SportLudique.** Vérifier les droits d’accès aux copies et la capacité réelle de restauration ; la présence d’une sauvegarde ne prouve pas qu’elle est exploitable. Restaurer ne retire pas les données déjà volées.

## Concepts avancés

### DNS Cache Poisoning — empoisonnement du cache DNS

Une donnée trompeuse est acceptée **et mémorisée par un résolveur**, puis fournie à plusieurs clients jusqu’à expiration ou purge. Le DNS spoofing n’implique donc pas toujours un cache empoisonné.

Un attaquant hors chemin doit notamment faire correspondre sa réponse à une requête en cours (identifiant, ports et autres contrôles). La randomisation des identifiants et ports sources ainsi que les contrôles de cohérence/bailiwick rendent l’injection plus difficile. DNSSEC validé protège les données signées ; les domaines non signés et configurations permissives restent à examiner.

DoT/DoH protège un trajet vers un résolveur et peut authentifier ce dernier selon la configuration ; cela ne garantit pas qu’il fournit des données DNS authentiques. Protéger également les mises à jour, transferts et accès d’administration des zones.

### Privilege Escalation — élévation de privilèges

Un accès limité devient plus puissant grâce à une vulnérabilité, des permissions incorrectes, un secret accessible ou une délégation excessive. L’élévation verticale acquiert davantage de droits ; l’accès horizontal vise des ressources d’un pair.

Corriger le système, contrôler permissions/services et délégations AD, séparer comptes usuels et administratifs, éviter d’exposer les secrets privilégiés sur des postes ordinaires. Un antivirus ne corrige pas une délégation trop large. Rechercher changements de groupes, usages inhabituels de comptes privilégiés et accès aux ressources, selon les événements collectés.

### Phishing — hameçonnage et ingénierie sociale

Un message ou site trompeur pousse à divulguer un secret, valider une connexion ou ouvrir un contenu malveillant. C’est un mode d’accès initial transversal, pas un protocole OSI. La vraisemblance de la demande et l’absence de vérification indépendante sont les conditions clés.

Former aux vérifications par un canal connu, filtrer les messages/contenus et employer une MFA résistante à l’hameçonnage quand possible. Une MFA par code peut être relayée en temps réel ; aucune sensibilisation ne garantit l’absence d’erreur.

## Expertise — scénario combiné

Un compte volé accède au VPN ; une délégation AD excessive permet une élévation ; l’accès aux sauvegardes prépare une extorsion. Justifier protections et traces pour chaque transition. Distinguer ce qui empêche l’entrée, ce qui limite les droits, ce qui détecte et ce qui permet de restaurer.

Pour les services web, comparer les responsabilités du code, du reverse proxy/WAF, de la PKI et du filtrage. Une bonne architecture ne dispense pas du contrôle d’accès applicatif.

## Références

- [RFC 5452 — résistance DNS aux réponses forgées](https://www.rfc-editor.org/info/rfc5452/) ; [RFC 4033 — garanties DNSSEC](https://www.rfc-editor.org/rfc/rfc4033.html).
- [OWASP — SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).
- [OWASP — XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
- [OWASP — CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- [OWASP — Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
- [ANSSI — sauvegardes](https://messervices.cyber.gouv.fr/guides/fondamentaux-sauvegarde-systemes-dinformation).
