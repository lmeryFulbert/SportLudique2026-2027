# Quiz — DNS

<quiz>
**[SOCLE] Quel est le rôle principal d'un résolveur DNS ?**

* [x] Recevoir les requêtes DNS des clients et rechercher ou transmettre la demande vers un serveur capable d'y répondre.
* [ ] Héberger obligatoirement les zones DNS publiques.
* [ ] Attribuer les adresses IPv4 aux postes du réseau.
* [ ] Remplacer le serveur DNS Active Directory.

Le résolveur est le serveur interrogé par les clients. Il recherche la réponse ou transmet la requête vers un autre serveur DNS.
</quiz>

<quiz>
**[SOCLE] Quand dit-on qu'un serveur DNS fait autorité sur une zone ?**

* [ ] Lorsqu'il utilise un autre serveur comme redirecteur.
* [x] Lorsqu'il détient les informations officielles de cette zone et peut répondre pour celle-ci.
* [ ] Lorsqu'il est configuré dans `/etc/resolv.conf`.
* [ ] Lorsqu'il possède un cache DNS.

Un serveur faisant autorité possède les informations de la zone dont il est responsable. Ce rôle est différent de celui de résolveur.
</quiz>

<quiz>
**[SOCLE] Pourquoi séparer les informations DNS publiques des informations internes ?**

* [ ] Pour permettre au DNS d'utiliser TCP.
* [x] Pour ne pas exposer inutilement des informations concernant les ressources internes.
* [ ] Parce qu'un serveur DNS ne peut gérer qu'un seul réseau IP.
* [ ] Pour empêcher l'utilisation des enregistrements `A`.

Les noms et informations concernant les ressources purement internes n'ont pas vocation à être publiés vers l'extérieur.
</quiz>

<quiz>
**[SOCLE] Quel serveur DNS les postes du LAN doivent-ils normalement utiliser ?**

* [ ] Le serveur DNS public situé dans la DMZ.
* [x] Le résolveur DNS interne prévu pour les clients du LAN.
* [ ] Le serveur DNS racine.
* [ ] N'importe quel serveur DNS accessible sur le réseau.

Les clients du LAN interrogent le résolveur interne. Celui-ci détermine ensuite comment traiter ou transmettre leurs requêtes.
</quiz>

<quiz>
**[SOCLE] À quoi sert une redirection DNS ?**

* [ ] À transférer le contenu complet d'une zone DNS.
* [ ] À confier l'autorité d'un sous-domaine à un autre serveur.
* [x] À transmettre certaines requêtes DNS à un autre serveur DNS.
* [ ] À créer automatiquement une zone de recherche inverse.

Une redirection, ou *forward*, permet à un serveur DNS de transmettre des requêtes à un autre serveur chargé de poursuivre leur traitement.
</quiz>

<quiz>
**[SOCLE] À quoi sert une délégation DNS ?**

* [x] À confier l'autorité d'une partie de l'espace DNS à un autre serveur DNS.
* [ ] À définir le résolveur utilisé par un poste client.
* [ ] À copier automatiquement une zone vers tous les résolveurs.
* [ ] À rediriger toutes les requêtes inconnues vers Internet.

Une délégation répartit l'autorité DNS. Une zone parente indique quels serveurs sont responsables d'une zone enfant.
</quiz>

<quiz>
**[SOCLE] Pourquoi déléguer la zone utilisée par Active Directory au serveur DNS AD ?**

* [ ] Parce que BIND ne sait pas gérer les sous-domaines.
* [ ] Pour rendre Active Directory accessible depuis Internet.
* [x] Pour laisser Active Directory gérer les nombreux enregistrements DNS nécessaires au fonctionnement du domaine.
* [ ] Pour supprimer le besoin d'un résolveur DNS interne.

Active Directory crée et maintient de nombreux enregistrements DNS. La délégation permet au DNS AD de rester responsable de cet espace de noms.
</quiz>

<quiz>
**[SOCLE] Quelle affirmation concernant la résolution inverse est correcte ?**

* [ ] Elle permet de retrouver une adresse IP à partir d'un nom.
* [x] Elle permet de rechercher un nom à partir d'une adresse IP.
* [ ] Elle permet de choisir entre une zone interne et une zone externe.
* [ ] Elle remplace la résolution DNS classique.

La résolution inverse effectue une recherche `adresse IP → nom`, notamment grâce aux enregistrements `PTR`.
</quiz>

<quiz>
**[AVANCÉ] Quel est le rôle d'Unbound dans l'architecture avancée SportLudique ?**

* [x] Assurer la résolution DNS pour les clients du LAN et transmettre les requêtes vers les serveurs appropriés.
* [ ] Faire autorité sur `ville.sportludique.fr`.
* [ ] Héberger les vues `inside` et `outside`.
* [ ] Gérer directement la zone DNS Active Directory.

Unbound est le résolveur interne. BIND, situé dans la DMZ, assure le rôle de serveur d'autorité pour `ville.sportludique.fr`.
</quiz>

<quiz>
**[AVANCÉ] Vous administrez le site de Chartres. Un poste du LAN demande à Unbound de résoudre `www.chartres.sportludique.fr`. Vers quel serveur Unbound doit-il transmettre cette requête ?**

* [ ] Au DNS Active Directory du site de Chartres.
* [ ] Au résolveur DNS de l'enseignant.
* [x] Au serveur BIND faisant autorité sur `chartres.sportludique.fr` dans la DMZ de Chartres.
* [ ] Directement à un serveur DNS racine.

Unbound possède une redirection spécifique pour la zone `chartres.sportludique.fr` vers le serveur BIND d'autorité du site de Chartres.
</quiz>

<quiz>
**[AVANCÉ] Vous administrez le site de Chartres. Un poste du LAN demande maintenant à Unbound de résoudre `www.tours.sportludique.fr`. Vers quel serveur Unbound doit-il transmettre cette requête ?**

* [ ] Au serveur BIND de la DMZ de Chartres.
* [ ] Au DNS Active Directory de Chartres.
* [x] Au résolveur DNS de l'enseignant.
* [ ] Directement au serveur DNS d'autorité de Tours.

La redirection spécifique d'Unbound ne concerne que `chartres.sportludique.fr`. La requête pour `tours.sportludique.fr` utilise donc le redirecteur par défaut : le résolveur DNS de l'enseignant.
</quiz>

<quiz>
**[AVANCÉ] Une requête concernant un domaine qui n'est pas `ville.sportludique.fr` arrive sur Unbound. Que se passe-t-il dans l'architecture retenue ?**

* [ ] Unbound interroge directement les serveurs DNS racine.
* [ ] Unbound transmet systématiquement la requête au serveur BIND de la DMZ.
* [x] Unbound transmet la requête au résolveur DNS de l'enseignant.
* [ ] Unbound refuse la requête.

Le résolveur DNS de l'enseignant est utilisé comme redirecteur par défaut. C'est lui qui poursuit la résolution, notamment de manière récursive lorsque cela est nécessaire.
</quiz>

<quiz>
**[AVANCÉ] Comment BIND choisit-il entre les vues `inside` et `outside` ?**

* [ ] À partir du type d'enregistrement demandé.
* [ ] À partir du nom DNS demandé.
* [x] À partir des règles définies dans les vues, notamment `match-clients`.
* [ ] Le client indique la vue à utiliser dans sa requête.

Les ACL et `match-clients` permettent notamment à BIND de sélectionner une vue en fonction de l'origine de la requête.
</quiz>

<quiz>
**[AVANCÉ] Un poste du LAN interroge Unbound, qui transmet ensuite la requête à BIND. Quelle adresse source BIND voit-il ?**

* [ ] L'adresse IPv4 du poste utilisateur.
* [x] L'adresse IPv4 du résolveur Unbound.
* [ ] L'adresse IPv4 de la passerelle du poste.
* [ ] L'adresse IPv4 du résolveur DNS de l'enseignant.

BIND reçoit une nouvelle requête émise par Unbound. C'est donc notamment l'adresse du résolveur qu'il faut prendre en compte pour sélectionner la vue `inside`.
</quiz>

<quiz>
**[AVANCÉ] Pourquoi est-il indispensable que la zone externe ne contienne pas tous les enregistrements présents dans la zone interne ?**

* [ ] BIND interdit qu'un même enregistrement existe dans deux vues.
* [x] Les informations concernant les ressources internes ne doivent pas être inutilement exposées à l'extérieur.
* [ ] La vue externe ne peut contenir que des enregistrements `A`.
* [ ] Unbound ne fonctionnerait plus si les deux fichiers étaient identiques.

Le Split DNS permet de présenter des informations différentes suivant l'origine des requêtes. La vue externe ne doit publier que les informations nécessaires depuis l'extérieur.
</quiz>

<quiz>
**[AVANCÉ] Quelles affirmations concernant DNSSEC sont correctes ?**

* [x] DNSSEC permet de vérifier l'authenticité des informations DNS.
* [x] DNSSEC permet de vérifier l'intégrité des informations DNS.
* [ ] DNSSEC chiffre les requêtes et les réponses DNS.
* [ ] DNSSEC assure la confidentialité des échanges DNS.

DNSSEC apporte principalement des mécanismes d'authenticité et d'intégrité. Il ne chiffre pas les échanges et n'assure donc pas leur confidentialité.
</quiz>