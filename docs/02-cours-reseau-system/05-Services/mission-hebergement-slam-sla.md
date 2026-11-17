# Mission — Hébergement des applications SLAM et engagements de service

## 1. Le besoin professionnel

**SportLudique commercialise des produits de sport ludiques** et possède plusieurs sites, notamment Chartres, Orléans, Tours, Bourges et Blois. Vous constituez l'équipe SISR chargée de l'infrastructure de votre site. Les équipes SLAM développent des applications qu'elles souhaitent vous confier : catalogue de produits, suivi des stocks, gestion des commandes ou autres services métiers.

Votre objectif est de leur fournir **un service d'hébergement utilisable à distance**, un portail d'assistance GLPI et des engagements de service compréhensibles. Une application accessible ne suffit pas : les développeurs doivent savoir comment demander un hébergement, déposer une version, obtenir de l'aide et récupérer leurs données après un incident.

!!! info "Périmètre de l'accès externe"
    Dans cette mission, l'extérieur désigne **le réseau extérieur à votre site dans l'infrastructure pédagogique**. Vous disposez d'une seule adresse IP publique simulée par site. Aucune publication sur l'Internet réel n'est demandée.

Vous mobilisez les acquis sur l'hébergement web, les DMZ, DNS, le reverse proxy et TLS. Les installations ne sont pas guidées : **recherchez, choisissez et justifiez vos solutions**.

## 2. Proposer et défendre votre architecture

Recueillez les besoins d'au moins une équipe SLAM : technologie, dépendances, données, modalités de mise à jour et contraintes d'utilisation. Prévoyez un deuxième groupe de test pour vérifier les restrictions d'accès.

Votre proposition doit répondre aux exigences suivantes.

| Besoin | Ce que votre proposition doit expliquer |
| --- | --- |
| Publication | Plusieurs applications et GLPI accessibles avec une seule IP publique par site et des FQDN distincts |
| HTTPS | Certificats adaptés aux noms publiés, confiance des clients et emplacement de la terminaison TLS |
| Données | Serveur de bases de données en **DMZ privée**, sans accès direct depuis l'extérieur ; seuls les flux internes nécessaires sont autorisés |
| Dépôt | Chemin réseau permettant aux SLAM de transférer leurs fichiers par SFTP |
| Administration | Accès des administrateurs distincts des accès des développeurs et des utilisateurs |
| Séparation | Mesures limitant les accès entre groupes et les conséquences de la compromission d'une application |
| Exploitation | Emplacement de GLPI, sauvegardes, moyens de restauration et dépendances du service |

La terminaison TLS sur le reverse proxy est acceptée si vous expliquez quels flux restent éventuellement en clair, dans quelles zones et avec quelles limites. Vous pouvez proposer le chiffrement jusqu'aux serveurs internes en complément.

Préparez un **dossier d'architecture** comprenant un schéma logique, l'emplacement des services, le plan d'adressage, les FQDN et enregistrements DNS, le routage et le NAT éventuel, ainsi qu'une matrice de flux. Pour chaque règle de filtrage, indiquez la source, la destination, le protocole, le port, l'action et la justification.

Lors de l'oral, suivez le trajet d'une consultation HTTPS, d'un dépôt SFTP, d'une requête vers une base de données et d'une connexion d'administration. Justifiez vos choix et les évolutions de l'infrastructure existante.

!!! warning "Validation avant déploiement"
    Présentez votre architecture à l'oral **avant toute mise en œuvre de cette mission**. Corrigez les points demandés et obtenez la validation de l'enseignant avant de modifier l'infrastructure.

## 3. Ouvrir un portail d'assistance aux SLAM

Mettez GLPI à disposition depuis l'extérieur en HTTPS. Chaque développeur utilise un **compte personnel** lui permettant de créer une demande, de suivre ses tickets et de répondre aux techniciens.

Organisez les catégories, les affectations aux techniciens ou groupes SISR, les droits de consultation et le suivi. Les développeurs ne doivent accéder ni à l'administration de GLPI ni aux tickets d'autres groupes sans autorisation explicite. Vérifiez ces droits avec de vrais comptes de test.

### Demande de service ou incident ?

Une **demande de service** porte sur une prestation attendue ou une évolution. Un **incident** correspond à une interruption ou à une dégradation non prévue d'un service existant.

| Situation SportLudique | Nature du ticket |
| --- | --- |
| Une équipe demande l'hébergement de son application de catalogue | Demande de service |
| Une équipe demande un nouveau compte SFTP ou un nouveau FQDN | Demande de service |
| Une équipe souhaite faire évoluer la version du moteur applicatif | Demande de service, avec étude des conséquences |
| L'application déjà livrée renvoie une erreur et ne permet plus de consulter les stocks | Incident |
| Un compte SFTP auparavant fonctionnel ne permet plus de déposer de fichiers | Incident à diagnostiquer |

Définissez les informations utiles à chaque type de ticket : application, groupe, besoin ou symptôme, utilisateurs concernés, date d'apparition, étapes de reproduction et échéance métier éventuelle. Une erreur applicative doit être qualifiée avant d'en attribuer la responsabilité.

Prévoyez le circuit allant de la qualification à la clôture : affectation, échanges, intervention, solution proposée, validation par les SLAM. Conservez une trace des décisions et des changements de priorité.

## 4. Fournir l'hébergement et le dépôt des applications

### Un accès SFTP restreint

Fournissez une VM d'hébergement et un accès **SFTP**, protocole de transfert de fichiers utilisant SSH. Un accès SFTP ne nécessite pas de fournir un terminal : **aucun shell interactif n'est autorisé par défaut aux développeurs**.

Un **chroot SFTP** présente au compte un répertoire comme racine de son espace de fichiers. Il limite ce que ce compte peut parcourir pendant sa session SFTP. Distinguez la racine du confinement et les répertoires dans lesquels le dépôt est autorisé ; recherchez les contraintes de propriété et de permissions de la solution retenue.

Votre solution doit garantir :

- des comptes individuels identifiables, avec les seuls droits nécessaires ;
- un espace propre à chaque groupe, inaccessible aux autres groupes par SFTP ;
- des accès de dépôt séparés des comptes et chemins d'administration ;
- des permissions cohérentes entre les personnes qui déposent, les processus qui exécutent et les répertoires que l'application doit modifier ;
- l'absence de permissions globales excessives pour contourner un problème ;
- la restriction des autres fonctions SSH non nécessaires, notamment les redirections de ports.

!!! warning "Le confinement SFTP ne suffit pas"
    Un chroot SFTP **ne garantit pas l'isolation des applications pendant leur exécution**. Du code déposé peut être exécuté avec les droits du service applicatif. Justifiez votre choix : VM dédiée par groupe ou hébergement mutualisé avec des identités d'exécution, des permissions et des mesures de limitation adaptées. Analysez notamment l'accès aux fichiers et secrets d'un autre groupe.

### Préparer l'exécution et les données

Adaptez l'environnement aux technologies retenues par les SLAM : PHP, Node.js, ASP.NET ou autres. Distinguez le dépôt des fichiers des opérations de déploiement nécessitant une intervention SISR, telles que l'installation de dépendances, une compilation, un redémarrage ou une migration de données.

**WordPress peut servir d'application de validation.** Dans ce cas, prévoyez le moteur PHP, ses dépendances, la base de données et les droits nécessaires. Distinguez les répertoires contenant le code de ceux qui doivent être modifiables par l'application ; justifiez également la procédure de mise à jour.

Chaque application dispose de **sa propre base et de son propre compte de base de données**, aux privilèges adaptés. Expliquez comment les flux sont limités aux serveurs autorisés et comment les secrets sont protégés. Aucun mot de passe, clé privée ou secret applicatif ne doit apparaître dans les tickets ou la documentation publique.

### Expliquer l'accès distant

Le reverse proxy HTTP ne prend pas automatiquement en charge SSH. Avec votre unique adresse publique, **quel chemin suit la connexion SFTP jusqu'au bon serveur ?** Justifiez le point d'entrée, le port, les éventuelles traductions d'adresses et les règles de filtrage. Si plusieurs VM reçoivent des dépôts, expliquez comment elles sont distinguées.

La fiche remise aux SLAM devra préciser les paramètres non secrets de connexion, les vérifications d'identité du serveur, les répertoires utilisables et les actions autorisées. Choisissez un moyen adapté pour transmettre séparément les éléments confidentiels, et prévoyez le retrait des accès en fin de projet.

## 5. Négocier un accord de niveau de service

Un **SLA — Service Level Agreement**, ou accord de niveau de service, définit les engagements convenus entre le fournisseur d'un service et ses utilisateurs. Vous le rédigez avec les équipes SLAM : il doit être **court, mesurable et réaliste dans les conditions des séances**.

Le service peut rester accessible en dehors des séances alors que votre équipe n'assure aucun support à ces moments-là. Distinguez donc **la période de disponibilité attendue** et **les plages de présence du support**. Aucun support 24 h/24 ni taux de disponibilité arbitraire n'est imposé.

### Trois délais différents

| Notion | Signification |
| --- | --- |
| Prise en charge | Un technicien prend effectivement le ticket en compte et engage son traitement ; un accusé automatique ne suffit pas |
| Rétablissement du service | Le service redevient utilisable, éventuellement grâce à une solution provisoire |
| Résolution définitive | La cause est corrigée et la solution durable est vérifiée ; si seul un contournement est disponible, le suivi de la cause doit rester explicite |

Pour une demande de service, définissez plutôt une échéance de réalisation ou de livraison. Pour un incident, distinguez l'objectif de rétablissement de celui de résolution définitive. La validation par le demandeur et la clôture constituent des étapes à tracer séparément.

### Tableau de SLA à compléter

Remplacez les cases vides par vos engagements et justifications. Votre fiche doit identifier les équipes concernées, sa version et sa date de validation commune.

| Élément | Engagement proposé et justification |
| --- | --- |
| Services fournis : hébergement, dépôt, assistance, données | À compléter |
| Limites : ressources, technologies, opérations incluses et exclusions | À compléter |
| Responsabilités SISR : infrastructure, accès, sauvegardes, suivi | À compléter |
| Responsabilités SLAM : code, dépendances, tests, signalement, données confiées | À compléter |
| Périodes de disponibilité attendue et méthode de vérification | À compléter |
| Plages de support : jours, heures, fuseau, vacances et séances annulées | À compléter |
| Priorités : critères croisant impact et urgence, responsable de la qualification | À compléter |
| Point de départ des délais, calcul hors support et éventuelles suspensions justifiées | À compléter |
| Information : canal, fréquence des nouvelles, signalement des retards | À compléter |
| Escalade : déclencheur, interlocuteur, relais si l'équipe est bloquée | À compléter |
| Assistance si GLPI est indisponible et traçabilité après rétablissement | À compléter |
| Maintenance : créneaux, préavis, information et traitement des interruptions prévues | À compléter |
| Sauvegardes : fichiers, configurations, base, fréquence, conservation, emplacement et protection | À compléter |
| Restauration : responsable, procédure, conditions de déclenchement et validation | À compléter |
| Perte maximale de données acceptable — RPO | À compléter |
| Durée maximale d'interruption acceptable visée — RTO | À compléter |

Le **RPO** exprime jusqu'à quelle ancienneté de données vous acceptez de revenir après une perte. Le **RTO** exprime la durée visée pour restaurer un service utilisable après une interruption. Justifiez leur cohérence avec les sauvegardes, les moyens de restauration et vos plages d'intervention. Précisez si ces durées sont exprimées en temps réel ou en temps de support : une interruption pendant un week-end continue d'affecter les utilisateurs même si le compteur de support est arrêté.

Complétez autant de lignes que nécessaire, sans multiplier artificiellement les priorités.

| Priorité | Impact et urgence observables | Prise en charge | Rétablissement d'un incident | Résolution définitive / réalisation d'une demande | Information et escalade |
| --- | --- | --- | --- | --- | --- |
| À définir | À compléter | À compléter | À compléter | À compléter | À compléter |
| À définir | À compléter | À compléter | À compléter | À compléter | À compléter |
| À définir | À compléter | À compléter | À compléter | À compléter | À compléter |

L'**impact** décrit l'étendue et la gravité des conséquences ; l'**urgence** indique combien de temps la situation peut attendre. Comparez, par exemple, une panne touchant toutes les applications et une panne limitée à une application dont la démonstration est imminente. La mention « urgent » du demandeur ne suffit pas à déterminer la priorité.

Prévoyez comment annoncer un objectif dépassé et convenir d'une nouvelle estimation. Ne confondez pas une estimation de résolution avec une garantie impossible à tenir.

### Traduire les engagements dans GLPI

Configurez le calendrier de support et les engagements que votre version de GLPI permet de suivre, notamment les échéances de **prise en charge** et de **résolution**. Reliez-les aux tickets concernés et vérifiez leur attribution. Expliquez comment vous tracez séparément le rétablissement, la résolution définitive et la validation du demandeur lorsque ces événements ne correspondent pas aux compteurs disponibles.

Vérifiez le calcul des échéances avec deux cas : un ticket créé pendant une séance et un ticket créé en dehors des plages de support. Présentez le calcul attendu, puis l'échéance obtenue dans GLPI. Testez également le traitement d'une éventuelle mise en attente : elle ne doit pas masquer un retard ni suspendre implicitement tous les engagements.

## 6. Réaliser la recette avec les SLAM

Organisez une recette depuis **un poste situé à l'extérieur de votre site**, avec deux groupes et leurs comptes respectifs. Utilisez des données de test et convenez du périmètre de l'incident simulé pour ne pas perturber les autres équipes.

| Test | Résultat attendu |
| --- | --- |
| Accès GLPI | Connexion HTTPS avec certificat reconnu et authentification personnelle réussie |
| Demande d'hébergement | Ticket créé par un SLAM, correctement catégorisé, affecté et traité par les SISR |
| Remise des accès | Fiche utilisable ; informations confidentielles transmises par le moyen convenu, absentes du ticket |
| Dépôt et mise à jour | Connexion SFTP réussie, dépôt dans l'espace autorisé et nouvelle version effectivement servie |
| Restriction SSH | Aucun shell interactif ni fonction SSH non autorisée disponible au compte de dépôt |
| Publication | Applications et GLPI accessibles par leurs FQDN distincts en HTTPS sur l'unique IP publique du site |
| Séparation SFTP | Le groupe A ne peut ni lire ni modifier les fichiers du groupe B, et réciproquement |
| Séparation GLPI | Aucun accès à l'administration ni aux tickets d'un autre groupe sans autorisation |
| Isolation à l'exécution | Un test contrôlé avec les droits du processus applicatif confirme les restrictions annoncées entre groupes |
| Protection de la base | Accès direct depuis l'extérieur refusé, alors que l'application accède normalement à sa base ; compte applicatif sans accès aux bases des autres applications |
| Incident simulé | Ticket qualifié, priorité justifiée, délais suivis, échanges tracés et service rétabli ; clôture après validation des SLAM |
| Calcul des délais | Échéances conformes au SLA et au calendrier, y compris hors des séances |
| Restauration | Application, fichiers nécessaires et données restaurés de manière cohérente depuis une sauvegarde ; fonctionnement validé par les SLAM |

Pour la restauration, relevez la date de la sauvegarde utilisée, les données retrouvées ou perdues et la durée de l'intervention. Comparez les mesures au RPO et au RTO annoncés. Expliquez les écarts et proposez une correction si l'engagement n'est pas tenu.

Présentez chaque preuve sous la forme suivante. Une capture n'est utile que si vous expliquez ce qu'elle démontre ; masquez les informations confidentielles.

| Test et conditions | Résultat attendu | Résultat constaté et preuve ciblée | Conclusion et correction éventuelle |
| --- | --- | --- | --- |
| À compléter | À compléter | À compléter | Conforme / non conforme, justification |

## 7. Livrables

Constituez un ensemble cohérent de cinq livrables, sans répéter les mêmes informations dans plusieurs documents.

1. **Dossier d'architecture**, présenté et validé à l'oral avant déploiement, puis actualisé si nécessaire.
2. **Fiche de service et SLA**, précisant l'offre, les responsabilités, les engagements validés avec les SLAM et leur traduction dans GLPI.
3. **Fiche d'accès et d'utilisation pour les SLAM**, sans secrets : portail, FQDN, accès SFTP, espace de dépôt, restrictions, procédure de mise à jour et assistance.
4. **Compte rendu de recette**, avec résultats attendus, résultats constatés, preuves ciblées, conclusion commune et corrections éventuelles.
5. **Tickets représentatifs d'une demande et d'un incident**, identifiés par leurs références et consultables par l'évaluateur, avec affectations, échanges, échéances, solution et validation.

## 8. Critères de réussite

Votre mission est réussie lorsque :

- vous expliquez et défendez une architecture validée avant sa mise en œuvre ;
- les SLAM utilisent réellement le portail, déposent une application et consultent sa publication depuis l'extérieur ;
- les tests confirment les restrictions de dépôt, de consultation des tickets, d'administration et d'accès aux données ;
- vous justifiez l'isolation à l'exécution et les limites de votre solution ;
- les engagements du SLA sont mesurables, compatibles avec les séances et suivis dans GLPI lorsque cela est possible ;
- vous distinguez dans les preuves prise en charge, rétablissement, résolution définitive et clôture ;
- vous restaurez une application et ses données, puis confrontez le résultat aux engagements annoncés ;
- une équipe SLAM peut utiliser le service avec votre fiche, sans recevoir de droits excessifs ni devoir deviner la procédure.

## Ressources déjà étudiées

- [Mission — Concevoir une infrastructure d'hébergement applicatif sécurisée](mission-hebergement-applicatif.md)
- [Hébergement mutualisé](web/01-hebergement-mutualise.md)
- [Reverse proxy](web/02-reverse-proxy.md)
- [Conception d'une DMZ](../06-Dmz/conception_dmz.md)
- [Présentation de TLS et de la PKI](pki/01-tls-presentation.md)

Ces supports constituent des prérequis. Vous les réutilisez pour répondre au besoin professionnel, sans refaire leurs tutoriels dans vos livrables.
