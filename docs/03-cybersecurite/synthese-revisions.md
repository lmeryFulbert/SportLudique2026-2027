# Révisions — Analyser une situation de cybersécurité

[Retour au référentiel](cybersecurite.md)

!!! info "L'objectif"
    Dans une étude de cas, il ne suffit pas de connaître le nom d'une attaque ou de réciter une liste de protections.

    Vous devez être capable de **comprendre une situation technique, expliquer comment une attaque exploite une faiblesse et proposer une mesure de protection adaptée**.

## 1. Commencer par lire attentivement le sujet et ses annexes

Les annexes ne sont pas de simples documents complémentaires. Elles contiennent souvent les informations nécessaires pour comprendre le problème et justifier votre réponse.

Avant de répondre :

- **Lisez la question en entier** pour identifier précisément ce qui est demandé.
- **Consultez les annexes concernées** : schéma réseau, configuration, journal d'événements, extrait de documentation, capture de paquets, etc.
- **Repérez les éléments importants** : adresses IP, interfaces, VLAN, routes, ports, protocoles et équipements concernés.
- **Faites le lien avec vos connaissances** : à quelle couche du modèle OSI intervient le problème ? Quel protocole est utilisé ?
- **Distinguez les faits des hypothèses** : une anomalie observée ne prouve pas nécessairement qu'une attaque a eu lieu.

!!! warning "Attention aux réponses trop rapides"
    Ne proposez pas immédiatement un pare-feu, un VLAN, un antivirus ou du chiffrement !

    Une mesure de sécurité n'est pertinente que si elle répond à une faiblesse clairement identifiée.

## 2. Comprendre le fonctionnement normal

**Avant de comprendre une attaque, il faut comprendre ce qui aurait dû se passer.**

Posez-vous les questions suivantes :

- Quel service ou protocole est utilisé ?
- Quels équipements communiquent ?
- Quels messages sont normalement échangés ?
- Quel équipement prend une décision et à partir de quelles informations ?
- Quel résultat est attendu en l'absence d'attaque ?

Vous devez être capable de reconstituer le fonctionnement normal, éventuellement à l'aide d'un schéma.

!!! example "Exemple — Le protocole ARP"
    Avant d'étudier une attaque ARP Spoofing, rappelez-vous qu'une station utilise ARP pour connaître l'adresse MAC associée à une adresse IPv4 sur son réseau local.

    Elle peut ensuite mémoriser cette association dans son cache ARP.

    Ce fonctionnement est indispensable pour comprendre comment une fausse association IP/MAC peut perturber les communications.

## 3. Comprendre le détournement du fonctionnement normal

Une attaque exploite une faiblesse technique, une mauvaise configuration ou une confiance excessive accordée à certaines informations.

Cherchez à identifier :

- **Le point d'entrée** : où se trouve l'attaquant et à quoi peut-il accéder ?
- **La faiblesse exploitée** : qu'est-ce qui n'est pas suffisamment vérifié ou protégé ?
- **Le mécanisme** : quel message, quelle donnée ou quel comportement est détourné ?
- **Le résultat** : qu'est-ce qui change par rapport au fonctionnement normal ?

!!! example "Exemple — ARP Spoofing"
    **Fonctionnement normal :** la station connaît l'adresse MAC de sa passerelle grâce au protocole ARP.

    **Détournement :** un attaquant présent sur le réseau local transmet de fausses informations ARP pour associer l'adresse IP de la passerelle à sa propre adresse MAC.

    **Conséquence :** si la station accepte cette association, elle peut envoyer ses trames destinées à la passerelle vers l'équipement de l'attaquant.

    Selon la situation, celui-ci peut intercepter, relayer ou interrompre les communications.

## 4. Expliquer les conséquences sur la sécurité

Dans vos réponses, utilisez systématiquement les **critères DICP** :

- **Disponibilité** : le service reste-t-il accessible ?
- **Intégrité** : les données peuvent-elles être modifiées ?
- **Confidentialité** : des informations peuvent-elles être divulguées ?
- **Preuve** : peut-on établir de manière fiable qu'une opération a été réalisée ?

!!! warning "Attention au vocabulaire"
    Dire qu'un protocole, un équipement ou une solution est
    « sécurisé » ne constitue **pas une justification technique**.

    Vous devez préciser **quel(s) critère(s) DICP sont protégés
    ou compromis, et expliquer pourquoi**.

    Exemple :

    ❌ « HTTPS sécurise les communications. »

    ✅ « HTTPS utilise TLS pour assurer la confidentialité
    et l'intégrité des données échangées, ainsi que
    l'authentification du serveur grâce à son certificat,
    sous réserve de sa validation. »

    Attention : une attaque ne compromet pas nécessairement
    tous les critères DICP.

Pensez également aux **conséquences pour l'organisation** : interruption d'activité, perte de données, divulgation d'informations personnelles, conséquences financières, etc.

## 5. Proposer une mesure de protection adaptée

Une bonne réponse doit expliquer **comment la mesure proposée empêche, limite ou permet de détecter le mécanisme étudié**.

Pour construire votre réponse :

1. Identifiez la faiblesse à corriger.
2. Choisissez une mesure adaptée à cette faiblesse.
3. Précisez où elle doit être appliquée : poste, commutateur, routeur, pare-feu, serveur ou application.
4. Expliquez son effet sur le fonctionnement de l'attaque.

!!! tip "Ne confondez pas les rôles des protections"
    - Un **VLAN** permet de segmenter le réseau.
    - Une **ACL** ou un **pare-feu** contrôle les communications autorisées.
    - Le **chiffrement TLS** protège les échanges applicatifs contre certaines interceptions et modifications.
    - Un **IDS/IPS** peut détecter ou bloquer certaines activités malveillantes.
    - Un **SIEM** permet de centraliser et de corréler des événements de sécurité.

    Ces mécanismes sont complémentaires, mais ne répondent pas tous au même problème.

## 6. Justifier votre réponse avec les annexes

Dans une étude de cas, une affirmation technique doit, autant que possible, s'appuyer sur les informations fournies.

Une bonne justification fait le lien entre :

**Une information de l'annexe → une connaissance technique → une conclusion.**

!!! example "Exemple — Exploitation d'un schéma réseau"
    Le schéma montre que le poste de l'attaquant et celui de la victime appartiennent au même VLAN.

    Ils se trouvent donc dans le même domaine de diffusion Ethernet.

    L'attaquant peut potentiellement transmettre des messages ARP à la victime, ce qui rend envisageable une attaque ARP Spoofing si aucune protection adaptée n'est présente.

    Cette configuration rend l'attaque possible, mais ne prouve pas qu'elle a effectivement eu lieu.

## 7. Rédiger une réponse technique et argumentée

Évitez les réponses constituées uniquement de mots-clés.

**Réponse insuffisante :**

« Il faut mettre un pare-feu pour empêcher l'attaque. »

**Réponse attendue :**

« L'attaque exploite [...]. L'équipement accepte [...], ce qui permet à l'attaquant de [...]. Pour limiter ce risque, il est possible de configurer [...] sur [...]. Cette mesure permet de [...] en contrôlant [...]. »

Vous n'avez pas besoin d'écrire un long paragraphe : quelques phrases précises et correctement justifiées sont souvent plus efficaces.

---

## À retenir pour les études de cas

!!! success "Les cinq réflexes essentiels"
    **1. LIRE** — Lire attentivement les questions et exploiter toutes les annexes utiles.

    **2. COMPRENDRE** — Reconstituer le fonctionnement normal du protocole ou du service avant d'étudier l'attaque.

    **3. ANALYSER** — Identifier la faiblesse exploitée, expliquer le mécanisme de l'attaque et ses conséquences sur les critères DICP.

    **4. PROTÉGER** — Proposer une mesure adaptée. La solution technique est parfois directement documentée dans les annexes !

    **5. JUSTIFIER** — Argumenter avec précision en s'appuyant sur les annexes et ses connaissances techniques. Éviter les affirmations vagues comme « c'est sécurisé ».

    **L'objectif n'est pas de mémoriser toutes les attaques, mais de comprendre leur fonctionnement pour être capable de les analyser et de proposer des protections adaptées.**