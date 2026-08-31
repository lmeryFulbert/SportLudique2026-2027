# Quiz — Git, GitHub et MkDocs

<quiz>
Quelle affirmation décrit correctement Git et GitHub ?

* [x] Git est un logiciel de gestion de versions, GitHub est une plateforme pouvant héberger des dépôts Git.
* [ ] Git et GitHub sont deux noms différents pour le même logiciel.
* [ ] Git fonctionne uniquement lorsqu'il est connecté à GitHub.
* [ ] GitHub doit être installé sur l'ordinateur pour pouvoir créer un commit.

Git fonctionne indépendamment de GitHub. Le dépôt local possède notamment son propre historique. </quiz>

<quiz>
Vous perdez votre connexion Internet. Quelle opération reste possible ?

* [ ] `git push`
* [ ] Ouvrir une Pull Request sur GitHub.
* [x] Créer un commit.
* [ ] Publier le site avec GitHub Pages.

Un commit est créé dans le dépôt Git local. Cette opération ne nécessite donc pas de connexion à GitHub. </quiz>

<quiz>
Vous venez de modifier le fichier `docs/reseau.md`. Quelle commande permet de sélectionner cette modification pour le prochain commit ?

* [ ] `git push`
* [x] `git add docs/reseau.md`
* [ ] `git pull`
* [ ] `git clone docs/reseau.md`

`git add` ajoute la modification à la zone de préparation du prochain commit. </quiz>

<quiz>
Quelle succession correspond au cycle Git utilisé dans le projet ?

* [ ] Modification → `git push` → `git add` → `git commit`
* [ ] Modification → `git commit` → `git add` → `git push`
* [x] Modification → `git add` → `git commit` → `git push`
* [ ] Modification → `git pull` → `git push` → `git commit`

`git add` prépare les modifications, `git commit` les enregistre dans l'historique local et `git push` transmet les commits au dépôt distant. </quiz>

<quiz>
Vous exécutez :

```bash
git commit -m "Ajout documentation DNS"
```

Le commit apparaît-il immédiatement sur GitHub ?

* [ ] Oui, puisqu'un commit vient d'être créé.
* [x] Non, il existe pour l'instant uniquement dans le dépôt local.
* [ ] Oui, à condition que GitHub Actions fonctionne.
* [ ] Non, il faut maintenant exécuter `git add`.

`git commit` agit sur le dépôt local. Il faut ensuite utiliser `git push` pour envoyer le commit vers le dépôt distant. </quiz>

<quiz>
Un membre de votre groupe a travaillé sur le projet et envoyé ses modifications sur GitHub. Que devriez-vous faire avant de commencer votre propre travail ?

* [ ] `git push`
* [x] `git pull`
* [ ] `git add .`
* [ ] Supprimer puis recloner le dépôt.

`git pull` permet de récupérer les modifications présentes sur le dépôt distant avant de commencer à travailler. </quiz>

<quiz>
Pourquoi travailler dans une branche plutôt que directement dans `main` ?

* [ ] Pour disposer d'une sauvegarde supplémentaire.
* [ ] Parce que plusieurs personnes ne peuvent pas utiliser `main`.
* [x] Pour isoler une modification avant de l'intégrer à la version principale.
* [ ] Parce que GitHub Pages ne peut pas publier la branche `main`.

Une branche permet de développer ou modifier une partie du projet sans affecter immédiatement la version principale. </quiz>

<quiz>
Vous avez terminé votre travail dans la branche `documentation-supervision`. Quelle étape permet normalement de proposer son intégration dans `main` ?

* [ ] Supprimer la branche.
* [ ] Copier manuellement les fichiers dans `main`.
* [x] Ouvrir une Pull Request.
* [ ] Exécuter `mkdocs build`.

La Pull Request permet de proposer une modification, de la relire et éventuellement de la corriger avant son intégration dans `main`. </quiz>

<quiz>
Quel est l'intérêt principal d'une Pull Request ?

* [ ] Sauvegarder automatiquement le dépôt.
* [ ] Installer MkDocs sur GitHub.
* [x] Permettre la revue des modifications avant leur intégration.
* [ ] Remplacer les commits Git.

Une Pull Request permet notamment de visualiser les changements, d'échanger dessus et de les valider avant le merge. </quiz>

<quiz>
Dans un projet MkDocs classique, où se trouvent principalement les pages de documentation ?

* [ ] Dans `.github/workflows/`
* [x] Dans le répertoire `docs/`
* [ ] Dans `.git/`
* [ ] Dans `mkdocs.yml`

Le dossier `docs/` contient les fichiers Markdown constituant le contenu du site. </quiz>

<quiz>
Quel est principalement le rôle du fichier `mkdocs.yml` ?

* [ ] Stocker l'historique Git.
* [ ] Contenir toutes les pages Markdown.
* [x] Configurer le site MkDocs.
* [ ] Stocker les clés SSH utilisées par GitHub.

`mkdocs.yml` permet notamment de définir le thème, les plugins, les extensions et différentes options du site. </quiz>

<quiz>
Vous venez de modifier un tableau Markdown. Pourquoi est-il utile d'exécuter `mkdocs serve` avant d'envoyer vos modifications ?

* [ ] Pour permettre à Git de détecter le fichier.
* [x] Pour vérifier le rendu réel du site avant publication.
* [ ] Pour créer automatiquement un commit.
* [ ] Parce que GitHub refuse les fichiers Markdown non testés.

Un fichier Markdown peut être syntaxiquement valide tout en produisant un rendu différent de celui attendu. Tester localement permet de le vérifier. </quiz>

<quiz>
Vous trouvez ceci dans un fichier du dépôt :

```text
api_token = "ghp_xxxxxxxxxxxxxxxxx"
```

Quelle est la bonne réaction ?

* [ ] Le conserver puisque seuls les membres du projet connaissent le dépôt.
* [ ] Le déplacer dans `mkdocs.yml`.
* [x] Retirer le secret du dépôt et signaler le problème.
* [ ] Le placer dans une branche différente.

Un mot de passe, un token ou une clé privée ne doit pas être stocké dans le dépôt Git. Une branche différente ne constitue pas une protection. </quiz>

<quiz>
Vous avez créé une paire de clés SSH avec les fichiers `id_ed25519` et `id_ed25519.pub`. Lequel peut être transmis à GitHub ?

* [ ] `id_ed25519`
* [x] `id_ed25519.pub`
* [ ] Les deux fichiers.
* [ ] Aucun des deux.

Le fichier `.pub` contient la clé publique. La clé privée `id_ed25519` doit rester secrète. </quiz>

<quiz>
Une modification vient d'être fusionnée dans `main`. Quelle chaîne correspond au principe de publication automatique utilisé avec MkDocs et GitHub Pages ?

* [ ] GitHub Pages → GitHub Actions → MkDocs
* [x] GitHub Actions → construction du site avec MkDocs → GitHub Pages
* [ ] MkDocs → GitHub Pages → Git
* [ ] Git → Python → navigateur → GitHub Actions

GitHub Actions peut exécuter automatiquement la construction du site avec MkDocs puis permettre sa publication avec GitHub Pages. </quiz>

## Diagnostic

<quiz>
Vous avez modifié un fichier, exécuté `git add` puis `git commit`. Sur GitHub, aucune modification n'apparaît. Quelle est l'explication la plus probable ?

* [ ] Le fichier Markdown doit d'abord être transformé en HTML.
* [x] Le commit n'a pas encore été envoyé avec `git push`.
* [ ] Il faut ouvrir une Pull Request avant chaque commit.
* [ ] `git add` a supprimé la modification.

Le commit existe dans le dépôt local. Tant qu'il n'est pas envoyé avec `git push`, GitHub ne peut pas le voir. </quiz>

<quiz>
Votre collègue vous affirme avoir envoyé ses modifications sur GitHub. Sur votre ordinateur, vous voyez toujours l'ancienne version des fichiers. Quelle action est la plus logique ?

* [ ] Exécuter `git add .`
* [ ] Exécuter `git push`
* [x] Récupérer les modifications du dépôt distant avec `git pull`.
* [ ] Créer une nouvelle branche.

Votre dépôt local ne se synchronise pas automatiquement avec GitHub. `git pull` permet de récupérer les modifications distantes. </quiz>

<quiz>
Votre fichier Markdown semble correct dans votre éditeur, mais le rendu du site est incorrect. Quelle est la meilleure démarche ?

* [ ] Modifier directement les fichiers HTML générés.
* [ ] Envoyer les modifications sur GitHub pour voir si le problème disparaît.
* [x] Lancer MkDocs localement et analyser le rendu et les éventuels messages d'erreur.
* [ ] Supprimer le dépôt Git.

`mkdocs serve` permet de tester le site localement et facilite le diagnostic avant publication. </quiz>
