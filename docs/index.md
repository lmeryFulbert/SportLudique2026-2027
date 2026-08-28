# Bienvenue 👋

Cette documentation va vous accompagner tout au long du projet.

L'objectif n'est pas de vous faire lire 200 pages avant de commencer, mais de regrouper au même endroit les informations, ressources et procédures dont vous aurez besoin au fil de l'année.

Vous y trouverez donc aussi bien des rappels techniques que des procédures, des exemples de configuration et quelques ressources pour aller plus loin.

!!! tip "Un conseil"
Ne cherchez pas à tout lire maintenant. Revenez ici quand vous en avez besoin : une documentation technique est faite pour être **utilisée**, pas apprise par cœur.

## Comment utiliser cette documentation ?

La navigation à gauche permet de parcourir les différentes parties du projet.

La recherche en haut de la page est généralement encore plus efficace : un mot-clé, un outil ou une technologie devrait vous permettre de retrouver rapidement la bonne page.

Et puisque cette documentation est elle-même stockée dans un dépôt Git, elle peut évoluer. Une erreur ? Une procédure devenue obsolète ? Une explication qui pourrait être meilleure ?

**Pull Requests welcome.** 😎

---

# Cette documentation est aussi un exemple

Le site que vous êtes en train de consulter n'est pas hébergé manuellement sur un serveur.

Les sources sont écrites en **Markdown**, stockées dans un dépôt Git et transformées en site web avec **MkDocs**.

À chaque modification envoyée sur la branche principale, une **GitHub Action** peut reconstruire automatiquement le site et le publier sur **GitHub Pages**.

Autrement dit :

```text
Markdown
   ↓
Git
   ↓
GitHub
   ↓
GitHub Actions
   ↓
MkDocs
   ↓
GitHub Pages
   ↓
🌍 Documentation en ligne
```

Vous venez donc déjà de rencontrer une petite chaîne de **CI/CD**.

??? info "CI/CD : derrière les acronymes"

```
**CI — Continuous Integration**

Les modifications sont régulièrement intégrées dans un dépôt commun. Des traitements automatiques peuvent alors vérifier que le projet fonctionne toujours correctement.

**CD — Continuous Delivery**

Le projet est automatiquement préparé pour pouvoir être livré ou déployé.

**CD — Continuous Deployment**

On va encore plus loin : si les vérifications passent, la nouvelle version peut être automatiquement déployée.

Dans notre cas, c'est assez simple : vous modifiez la documentation, vous faites un `git push`, GitHub travaille et le site est mis à jour.

Pas besoin d'envoyer `documentation_finale_v2_definitive_CORRIGEE.zip` par mail.
```

---

# À votre tour de documenter

Votre projet de l'année devra lui aussi être **documenté**.

L'objectif est double : permettre à quelqu'un d'autre de comprendre votre infrastructure et conserver une documentation accessible lorsque vous devrez présenter votre travail, notamment lors des épreuves de fin d'année.

Votre documentation devra donc être :

* versionnée avec **Git** ;
* écrite principalement en **Markdown** ;
* générée sous forme de site statique ;
* publiée afin de rester facilement consultable.

Vous transmettrez l'URL de cette documentation à vos enseignants.

!!! warning "Une documentation n'est pas un compte rendu"
Évitez le classique :

```
*« J'ai installé Debian, ensuite j'ai cliqué ici, ensuite j'ai fait ça… »*

Documentez plutôt ce qui permet de **comprendre, administrer, reproduire et dépanner** votre solution.
```

Une bonne documentation ne répond donc pas seulement à la question **« comment ? »**.

Elle doit aussi permettre de comprendre **« pourquoi ? »**.

---

# 🤖 Et les IA dans tout ça ?

Vous l'avez probablement déjà constaté : les outils d'IA générative savent produire très rapidement de la documentation, des procédures, des commandes, du Markdown… et beaucoup d'émojis. 😄

Ce n'est pas un problème en soi.

Vous pouvez utiliser une IA pour vous aider à reformuler une explication, structurer votre documentation, comprendre une erreur, rechercher une piste ou produire une première version d'un texte.

En revanche, **nous n'évaluerons pas la quantité de documentation produite, mais sa qualité**.

Une procédure de trois pages générée automatiquement n'a aucun intérêt si vous êtes incapables d'expliquer ce qu'elle fait.

Ce que nous attendons, c'est que vous compreniez :

* **ce que vous faites** ;
* **pourquoi vous le faites** ;
* **comment cela fonctionne** ;
* et, lorsque plusieurs solutions existent, **pourquoi vous avez choisi celle-ci**.

!!! warning "Le piège du copier-coller"
Une IA peut parfaitement produire une commande correcte… ou une commande plausible mais complètement fausse.

```
Elle peut également proposer une configuration qui fonctionne sans que vous compreniez pourquoi elle fonctionne.

Dans les deux cas, lors d'une présentation, d'une modification ou d'une panne, le problème apparaîtra très vite.
```

L'IA peut donc être un **outil d'aide**, exactement comme une documentation officielle, un moteur de recherche, Stack Overflow ou un forum.

Mais elle ne doit pas réfléchir à votre place.

> **Si vous ne pouvez pas expliquer ce que vous avez écrit ou configuré, alors ce n'est pas vraiment votre documentation.**

Et oui : les émojis sont parfois un excellent indice. 😉

---

# Quel outil utiliser ?

Il existe aujourd'hui d'excellents générateurs de documentation et de sites statiques.

Petit détour historique : avant Markdown, on trouvait notamment **DocBook**, basé sur XML, puis **AsciiDoc**. Ces formats existent toujours, mais Markdown s'est largement imposé pour les projets informatiques grâce à sa simplicité.

Vous êtes libres d'explorer plusieurs solutions.

=== "MkDocs"

````
Simple, efficace et particulièrement adapté à la documentation technique.

Avec **Material for MkDocs**, il permet rapidement d'obtenir une documentation très agréable à utiliser.

```text
https://squidfunk.github.io/mkdocs-material/
```
````

=== "Hugo"

````
Un générateur de sites statiques extrêmement rapide, écrit en Go.

Il peut servir à créer de la documentation, mais également des blogs ou des sites beaucoup plus complets grâce à son système de thèmes.

```text
https://gohugo.io/
```
````

=== "Docusaurus"

````
Développé autour de l'écosystème React, Docusaurus est particulièrement populaire pour la documentation de projets logiciels.

```text
https://docusaurus.io/fr/
```
````

=== "Sphinx"

````
Très utilisé dans l'écosystème Python et dans les documentations techniques importantes.

Il supporte notamment reStructuredText et Markdown.

```text
https://www.sphinx-doc.org/
```
````

=== "Astro"

````
Plus généraliste et très moderne, Astro permet de construire des sites statiques rapides et offre notamment **Starlight**, spécialement conçu pour la documentation.

```text
https://docs.astro.build/
```
````

!!! question "Lequel choisir ?"
**MkDocs** est probablement le plus simple pour commencer.

```
Mais si vous voulez tester Hugo, Docusaurus, Sphinx ou Astro : faites-vous plaisir.

Le générateur importe finalement moins que le résultat : **une documentation claire, structurée, versionnée et maintenue à jour.**
```

---

# 🔐 Et les mots de passe ?

Votre documentation sera versionnée avec Git et pourra être publiée sur Internet.

La règle est donc très simple :

> **Aucun secret ne doit apparaître dans votre dépôt Git.**

Cela concerne évidemment les mots de passe, mais également les clés privées, tokens d'API, secrets applicatifs, chaînes de connexion ou tout autre élément permettant d'accéder à votre infrastructure.

```yaml
admin:
  username: admin
  password: SuperPassword123
```

**⬆️ Ça, c'est non.**

Et remplacer le mot de passe quelques minutes plus tard ne règle pas nécessairement le problème : **Git conserve un historique**.

Vous avez déjà étudié — ou étudierez — ces problématiques dans le cadre du **cours de cybersécurité** : gestion des secrets, authentification, bonnes pratiques concernant les mots de passe et risques liés à leur divulgation.

Appliquez ici les mêmes principes.

!!! danger "Un secret publié n'est plus un secret"
Si un véritable mot de passe, token ou secret est envoyé par erreur sur le dépôt, considérez-le comme **compromis**.

```
La première chose à faire n'est pas de modifier le fichier : **le secret doit être révoqué ou changé**.
```

Pour les éléments qui doivent réellement être partagés au sein de votre équipe, utilisez une solution adaptée de gestion des secrets ou des mots de passe.

Et si votre documentation doit montrer un exemple de configuration, utilisez évidemment de **fausses valeurs** :

```env
DB_USER=example_user
DB_PASSWORD=CHANGE_ME
API_TOKEN=YOUR_TOKEN_HERE
```

On en reparlera dans le cours de cybersécurité.

---

# C'est parti 🚀

Cette documentation évoluera avec le projet au cours de l'année.

Vous allez installer des services, configurer des réseaux, déployer des applications, automatiser certaines tâches…

Vous allez aussi casser des configurations, chercher pendant deux heures pourquoi quelque chose qui fonctionnait hier ne fonctionne mystérieusement plus aujourd'hui, réparer le problème… puis probablement en provoquer un autre.

Bref : **faire de l'informatique.**

Et idéalement, documenter comment vous avez réussi à remettre tout ça en état.
