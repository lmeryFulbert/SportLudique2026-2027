# Git, GitHub et MkDocs

Dans ce projet, la documentation fait partie du travail. Elle va évoluer pendant toute l'année, être modifiée par plusieurs personnes et devra rester accessible en ligne.

Nous allons principalement utiliser trois outils :

* **Git**, pour versionner notre travail et gérer les modifications ;
* **GitHub**, comme plateforme collaborative, mais également pour mettre en place notre chaîne de **CI/CD** avec GitHub Actions et héberger notre documentation dans le cloud avec GitHub Pages ;
* **MkDocs**, pour transformer nos fichiers Markdown en véritable site de documentation.

Ces trois outils vont fonctionner ensemble pendant toute la durée du projet.

L'objectif de cette partie n'est pas d'apprendre toutes les commandes de Git ni toutes les possibilités de MkDocs. Vous devez surtout comprendre le fonctionnement général de notre chaîne de travail (workflow):

```text
Fichiers Markdown
       |
       v
git commit (dépôt local)
       |
       | 
       v
git push --> GitHub  (dépôt distant : Remote)
                |
                v
            GitHub Actions (CI/CD)
                |
                v
            génération automatique avec MkDocs (génération du site)
                |
                v
            GitHub Pages (hébergement)
                |
                v
            Documentation publiée
```

Vous utiliserez cette chaîne pendant toute la durée du projet.

---

# 1. Préparer l'environnement de travail

Pour travailler localement, nous avons besoin de :

* **Git**, pour gérer le dépôt ;
* **Python**, nécessaire à MkDocs ;
* **pip**, le gestionnaire de paquets Python ;
* **MkDocs**, notre générateur de documentation.

Sous Linux (base Debian)) :

```bash
sudo apt update
sudo apt install git python3 python3-pip python3-venv
```

Vérifiez ensuite que les principaux outils sont disponibles :

```bash
git --version
python3 --version
pip3 --version
```

!!! info "Pourquoi vérifier les versions ?"
    Lorsque vous rencontrerez un problème, la version d'un logiciel fera partie des premières informations à vérifier.

    Deux machines peuvent exécuter exactement la même commande et obtenir un résultat différent simplement parce qu'elles n'utilisent pas la même version d'un logiciel.


---

# 2. Python et les environnements virtuels

MkDocs est écrit en Python et s'installe comme un paquet Python.

Il serait possible d'installer directement les différents paquets dans le système, mais ce n'est généralement pas une bonne idée.

Nous allons plutôt utiliser un **environnement virtuel Python**.

## Pourquoi un environnement virtuel ?

Un environnement virtuel permet d'installer les dépendances nécessaires à un projet sans modifier l'environnement Python global de la machine.

Ainsi, un projet peut utiliser une version particulière d'une bibliothèque Python sans entrer en conflit avec un autre projet utilisant une version différente, ni avec les paquets nécessaires au système.

Cette idée d'isoler une application et ses dépendances ne concerne pas uniquement Python. Sous Linux, on retrouve par exemple ce principe avec `Flatpak`, qui permet à une application d'utiliser un environnement et des dépendances relativement indépendants de ceux de la distribution.
Sous Windows, `MSIX` poursuit également un objectif d'isolation et de maîtrise des dépendances lors de l'installation d'une application, notamment afin d'éviter certains problèmes traditionnellement rencontrés avec les installations classiques.

L'objectif général reste le même : réduire la dépendance d'une application vis-à-vis de l'environnement de la machine, limiter les conflits et rendre son fonctionnement plus prévisible et reproductible.

Nous retrouverons cette idée, poussée beaucoup plus loin, lorsque nous étudierons la **conteneurisation** avec `Docker` : 

- l'application sera alors empaquetée avec son environnement d'exécution et ses dépendances.

## En pratique

Dans le répertoire de votre projet :

```bash
python3 -m venv venv
```

Activez ensuite l'environnement :

```bash
source venv/bin/activate
```

Votre terminal doit maintenant afficher quelque chose ressemblant à :

```text
(venv) utilisateur@machine:~/mon-projet$
```

Le `(venv)` indique que les commandes Python et `pip` utilisent maintenant cet environnement.

Installez MkDocs et Material for MkDocs :

```bash
pip install --upgrade pip
pip install mkdocs mkdocs-material
```

Vérifiez l'installation :

```bash
mkdocs --version
```

Lorsque vous avez terminé :

```bash
deactivate
```

!!! warning "À retenir"
    Lorsque vous ouvrirez un nouveau terminal, l'environnement virtuel ne sera plus actif.

    ````
    Il faudra revenir dans le répertoire du projet puis exécuter :

    ```bash
    source venv/bin/activate
    ```
    ````

!!! info "Et l'installation globale ?"
    Vous trouverez encore de nombreux tutoriels proposant d'installer des paquets Python globalement avec `sudo pip`.

    Nous éviterons cette méthode.

    Le système d'exploitation utilise lui-même Python et certains de ses paquets. Modifier cet environnement sans précaution peut provoquer des conflits avec les paquets gérés par le système.


---

# 3. Créer le dépôt GitHub

Notre documentation doit être versionnée et partagée entre les membres du groupe.

Nous allons donc commencer par créer un dépôt sur GitHub.

1. Connectez-vous à GitHub.
2. Créez un **New repository**.
3. Donnez-lui un nom explicite, par exemple `mon-projet-mkdocs`.
4. Choisissez un dépôt **Public**.
5. Ajoutez un fichier **README**.
6. Créez le dépôt.

!!! question "Git ou GitHub ?"
    Les deux termes sont souvent confondus.

    **Git** est le logiciel de gestion de versions installé sur votre machine.

    **GitHub** est une plateforme en ligne qui peut héberger des dépôts Git et proposer de nombreux services autour de ces dépôts : collaboration, Pull Requests, gestion des droits, automatisation, CI/CD, hébergement de sites statiques, etc.

    Vous pouvez parfaitement utiliser Git sans GitHub.

    Dans notre projet, nous utiliserons les deux.

!!! warning "Un dépôt public est vraiment public"
    Votre documentation finale devra être facilement consultable, notamment par vos enseignants.

    Cela implique une conséquence importante : **tout ce qui est placé dans le dépôt doit pouvoir être rendu public**.

    Les mots de passe, clés privées, tokens et autres secrets n'ont donc rien à faire ici.

    Reportez-vous au cours de cybersécurité et aux consignes données dans la documentation générale du projet.

---

# 4. Cloner le dépôt

Le dépôt existe maintenant sur GitHub, mais nous voulons travailler sur notre machine.

Nous allons donc le **cloner**.

Placez-vous dans le répertoire dans lequel vous souhaitez stocker vos projets :

```bash
cd ~/travail
```

Puis clonez le dépôt :

```bash
git clone git@github.com:votre-nom-utilisateur/mon-projet-mkdocs.git
```

Entrez dans le répertoire créé :

```bash
cd mon-projet-mkdocs
```

Vous possédez maintenant une copie locale du dépôt présent sur GitHub.

!!! info "Dépôt local et dépôt distant"
    Il est important de bien distinguer les deux.

    **Le dépôt local** se trouve sur votre ordinateur. Vous pouvez modifier les fichiers, consulter l'historique, créer des branches et effectuer des commits sans connexion à Internet et sans serveur central.

    C'est l'une des différences fondamentales entre Git et les systèmes de gestion de versions centralisés qui l'ont précédé.

    Avec un outil comme Subversion (SVN), le dépôt de référence est hébergé sur un serveur central. Le poste de travail possède principalement une copie de travail et de nombreuses opérations de versionnement reposent sur ce serveur.

    Git est au contraire un système de gestion de versions distribué (Distributed Version Control System — DVCS). Chaque développeur possède localement un véritable dépôt avec son historique.

    GitHub n'est donc pas nécessaire au fonctionnement de Git. Il nous fournit ici un dépôt distant et des services supplémentaires pour collaborer, automatiser et publier notre projet.

    **Le dépôt distant**, quant à lui, se trouve dans notre cas sur GitHub. Il permet notamment de partager et synchroniser le travail entre les différents membres du groupe.

    Git ne synchronise pas automatiquement les deux.

    Vous utiliserez notamment :

    - `git push` pour envoyer vos commits vers le dépôt distant ;
    - `git pull` pour récupérer les modifications du dépôt distant.

---

# 5. Identifier l'auteur des commits

Un commit Git possède un auteur.

Configurez votre nom :

```bash
git config --global user.name "Votre Nom"
```

Puis votre adresse électronique :

```bash
git config --global user.email "votre-email@example.com"
```

Vérifiez la configuration :

```bash
git config --global --list
```

!!! info "Pourquoi Git demande-t-il cela ?"
    Git est un système de gestion de versions distribué.

    Chaque commit contient notamment l'identité déclarée de son auteur, la date, un message et les modifications apportées.

    Dans un projet collaboratif, cela permet de savoir **qui a modifié quoi et quand**.

---

# 6. S'authentifier auprès de GitHub avec SSH

Git sait maintenant qui crée les commits.

Mais GitHub doit encore vérifier que vous êtes autorisé à envoyer des modifications sur le dépôt.

Nous allons utiliser une **clé SSH**.

## Générer la clé

Nous utiliserons **Ed25519** :

```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

Appuyez sur `Entrée` pour accepter l'emplacement proposé.

Vous pouvez protéger votre clé privée avec une phrase de passe.

!!! danger "La clé privée reste privée"
    Une authentification SSH utilise ici une paire de clés :

    - une **clé publique**, que vous pouvez transmettre ;
    - une **clé privée**, qui doit rester secrète.

    Vous allez donner votre clé publique à GitHub.

    **Vous ne devez jamais envoyer votre clé privée sur GitHub ou l'ajouter à votre dépôt.**

## Et RSA ?

Vous rencontrerez également très souvent des clés RSA dans les documentations :

```bash
ssh-keygen -t rsa -b 4096 -C "votre-email@example.com"
```

RSA reste très répandu, notamment sur des systèmes plus anciens.

Pour notre environnement, nous privilégierons **Ed25519**, qui permet notamment d'utiliser des clés beaucoup plus petites tout en offrant un niveau de sécurité adapté à notre usage.

## Afficher la clé publique

```bash
cat ~/.ssh/id_ed25519.pub
```

Copiez la clé publique affichée.

Dans GitHub :

```text
Settings
    -> SSH and GPG keys
        -> New SSH key
```

Collez votre clé publique et donnez-lui un nom permettant d'identifier la machine.

## Tester la connexion

```bash
ssh -T git@github.com
```

Lors de la première connexion, SSH peut vous demander de confirmer l'empreinte du serveur.

Une fois l'authentification correctement configurée, GitHub doit vous reconnaître.

!!! question "Que vient-il de se passer ?"
    Votre machine possède la **clé privée**.

    GitHub connaît votre **clé publique**.

    Lors de la connexion, SSH permet à votre machine de prouver qu'elle possède bien la clé privée correspondante sans transmettre cette dernière.

    Ce principe d'authentification par cryptographie asymétrique doit normalement vous rappeler quelques éléments du cours de cybersécurité.

---

# 7. Initialiser MkDocs

Nous avons maintenant :

* un dépôt Git ;
* une copie locale ;
* une authentification vers GitHub ;
* un environnement Python avec MkDocs.

Créons le site :

```bash
mkdocs new .
```

MkDocs génère notamment :

```text
mon-projet-mkdocs/
├── docs/
│   └── index.md
└── mkdocs.yml
```

Ces deux éléments ont des rôles différents.

## Le répertoire `docs/`

Il contient les pages de votre documentation, principalement sous forme de fichiers Markdown.

Par exemple :

```text
docs/
├── index.md
├── installation.md
├── reseau.md
└── supervision.md
```

## Le fichier `mkdocs.yml`

Il contient la configuration du site : thème, extensions, plugins, navigation, etc.

Une configuration minimale peut ressembler à ceci :

```yaml
site_name: Documentation du projet

theme:
  name: material
```

!!! info "Séparer le contenu de sa présentation"
    Les fichiers Markdown contiennent principalement **le contenu** de votre documentation.

    Le fichier `mkdocs.yml` définit principalement **la manière dont le site est construit et présenté**.

    Cette séparation permet notamment de changer le thème ou l'organisation du site sans devoir réécrire toutes les pages.


---

# 8. Tester la documentation localement

Il serait assez pénible de faire un `push` sur GitHub chaque fois que vous voulez vérifier une modification.

MkDocs possède donc un serveur web de développement intégré :

=== "Linux"

    ```bash
    source venv/bin/activate
    python -m mkdocs serve
    ```

=== "Windows"

    ```powershell
    .\venv\Scripts\Activate.ps1
    python -m mkdocs serve
    ```

L'utilisation de python `-m mkdocs` permet de lancer explicitement MkDocs avec l'interpréteur Python de l'environnement virtuel actif. Cela évite notamment de dépendre de la présence de la commande mkdocs dans le PATH.

Vous devriez obtenir une adresse locale, généralement :

```text
http://127.0.0.1:8000/
```

Ouvrez cette adresse dans votre navigateur.

Lorsque vous modifiez et enregistrez un fichier Markdown, MkDocs reconstruit automatiquement le site et votre navigateur peut afficher la nouvelle version.

!!! tip "Prenez cette habitude"
    Avant d'envoyer une modification sur GitHub, regardez le résultat localement.

    Une documentation peut être parfaitement correcte en Markdown et pourtant produire un résultat inattendu une fois générée.

    C'est particulièrement vrai lorsque vous utilisez des tableaux, des **admonitions** (les encarts d'information, d'avertissement, de danger, etc.), des onglets ou des blocs de code.



Pour arrêter le serveur :

```text
Ctrl+C
```

---

# 9. Comprendre le cycle Git

Avant d'utiliser les commandes, il faut comprendre ce que Git manipule.

Lorsque vous modifiez un fichier, Git distingue plusieurs états :

```text
Fichier modifié
      |
      | git add
      v
Zone de préparation
      |
      | git commit
      v
Dépôt local
      |
      | git push
      v
Dépôt distant GitHub
```

Ces étapes ont des rôles différents.

`git add` indique quelles modifications feront partie du prochain commit.

`git commit` enregistre un nouvel état du projet dans l'historique local.

`git push` transmet les commits locaux au dépôt distant.

!!! question "Pourquoi ne pas simplement avoir une commande qui envoie tout ?"
    Parce que Git vous permet de choisir précisément les modifications qui doivent faire partie d'un commit.

    Un commit doit idéalement représenter une modification cohérente du projet.

    Cela permet d'obtenir un historique beaucoup plus facile à comprendre et, si nécessaire, de revenir sur une modification précise.

---

# 10. Faire un commit

Après avoir travaillé sur votre documentation, commencez par regarder ce qui a changé :

```bash
git status
```

Cette commande deviendra probablement l'une de celles que vous utiliserez le plus souvent.

Ajoutez les fichiers que vous souhaitez intégrer au prochain commit :

```bash
git add .
```

Puis créez le commit :

```bash
git commit -m "Ajout de la documentation réseau"
```

!!! warning "Un message utile"
    Évitez autant que possible :

    ```text
    modif
    test
    truc
    correction
    dernier
    dernier2
    ```

Un message de commit doit permettre de comprendre rapidement ce qui a été modifié.

Quelques mois plus tard, votre historique Git doit encore avoir un sens.


---

# 11. Envoyer les commits sur GitHub

Les commits précédents existent pour l'instant uniquement dans votre dépôt local.

Envoyez-les vers GitHub :

```bash
git push origin main
```

Vous pouvez alors vérifier sur GitHub que les nouveaux commits sont présents.

!!! info "Que signifie `origin main` ?"
    `origin` est généralement le nom donné par Git au dépôt distant depuis lequel vous avez cloné le projet.

    `main` est le nom de la branche que vous envoyez.

    Nous demandons donc ici à Git d'envoyer notre branche locale `main` vers le dépôt distant `origin`.


---

# 12. Récupérer les modifications

Vous ne travaillerez pas seuls sur le projet.

Un autre membre du groupe peut avoir envoyé des modifications sur GitHub depuis votre dernière session.

Avant de commencer à travailler, récupérez donc les dernières modifications :

```bash
git pull origin main
```

Une routine simple commence à apparaître :

```text
git pull
    |
    v
Travail
    |
    v
git status
    |
    v
git add
    |
    v
git commit
    |
    v
git push
```

!!! warning "Pourquoi faire un pull avant de travailler ?"
    Imaginez que deux personnes modifient leur ancienne copie du même fichier pendant plusieurs heures.

    Au moment de réunir les deux versions, Git devra déterminer comment combiner les modifications.

    Lorsque les mêmes lignes ont été modifiées différemment, un **conflit** peut apparaître.

    Récupérer régulièrement le travail des autres limite ce genre de situation.

---

# 13. Travailler avec des branches

Jusqu'ici, nous avons principalement travaillé sur `main`.

Pour un travail collaboratif, nous allons éviter de modifier directement cette branche pour chaque changement important.

Chaque collaborateur peut créer sa propre branche.

Commencez par récupérer la dernière version de `main` :

```bash
git checkout main
git pull origin main
```

Créez ensuite votre branche :

```bash
git checkout -b documentation-supervision
```

Vous pouvez vérifier la branche courante :

```bash
git branch
```

Travaillez normalement puis créez vos commits :

```bash
git add .
git commit -m "Ajout de la documentation de supervision"
```

Envoyez ensuite la branche sur GitHub :

```bash
git push -u origin documentation-supervision
```

!!! question "Pourquoi créer des branches ?"
    Une branche permet de travailler sur une modification sans modifier immédiatement la version principale du projet.

    Vous pouvez donc préparer, tester et faire relire votre travail avant de l'intégrer dans `main`.

    Plusieurs personnes peuvent ainsi travailler simultanément sur des parties différentes du projet.

---

# 14. Pull Requests et revue du travail

La branche existe maintenant sur GitHub, mais elle n'est pas encore intégrée à `main`.

Nous allons utiliser une **Pull Request**, souvent abrégée **PR**.

Une Pull Request signifie essentiellement :

> Je propose d'intégrer les modifications de ma branche dans la branche principale.

Sur GitHub, créez une Pull Request entre votre branche et `main`.

Les autres membres du projet peuvent alors :

* voir précisément les modifications proposées ;
* commenter certaines lignes ;
* demander des corrections ;
* accepter la proposition ;
* fusionner la branche dans `main`.

!!! info "La revue fait partie du travail"
    Une `Pull Request` n'est pas uniquement une étape administrative avant de cliquer sur **Merge**.

    Elle permet à une autre personne de relire le travail.

    Dans un projet informatique, cette pratique permet notamment de détecter des erreurs, d'améliorer la qualité du code ou de la documentation et de partager la connaissance entre les membres de l'équipe.

    On parle de `Code Review` dans le monde des devs

Une fois les modifications validées, la Pull Request peut être fusionnée dans `main` avec la commande `merge`

---

# 15. GitHub comme plateforme CI/CD

Jusqu'ici, GitHub nous a principalement servi à héberger notre dépôt et à collaborer.

Nous allons maintenant utiliser une autre fonctionnalité de la plateforme : **GitHub Actions**.

GitHub Actions permet d'exécuter automatiquement des traitements lorsque certains événements se produisent sur le dépôt.

Par exemple :

```text
Push sur main
      |
      v
GitHub Actions
      |
      +--> Installation des dépendances
      |
      +--> Construction du site MkDocs
      |
      +--> Vérifications
      |
      +--> Déploiement
      |
      v
Documentation mise à jour
```

Nous avons donc les bases d'une chaîne de **CI/CD**.

!!! question "Pourquoi automatiser ?"
    Sans automatisation, quelqu'un devrait reconstruire manuellement le site puis transférer les nouveaux fichiers vers le serveur à chaque modification.

    Ce serait répétitif et source d'erreurs. Vos profs ont connu cette époque la et croyez moi vous n'avez surtout pas envie de la revivre

    Avec une chaîne CI/CD, nous décrivons une fois les opérations à effectuer. La plateforme peut ensuite les reproduire automatiquement et de manière identique.


---

# 16. Créer un workflow GitHub Actions

Les workflows GitHub Actions sont décrits dans des fichiers YAML placés dans :

```text
.github/workflows/
```

Depuis votre dépôt GitHub :

1. ouvrez l'onglet **Actions** ;
2. créez un nouveau workflow ;
3. GitHub crée un fichier dans `.github/workflows/` ;
4. configurez les différentes étapes nécessaires à la construction et au déploiement du site ;
5. validez le fichier avec un commit.

Un workflow est généralement composé de plusieurs étapes :

```text
Déclencheur
    |
    v
Récupération du dépôt
    |
    v
Préparation de l'environnement
    |
    v
Installation des dépendances
    |
    v
Construction
    |
    v
Déploiement
```

!!! info "Le YAML est aussi du code"
    Votre workflow est stocké dans le dépôt comme le reste du projet.

    Il est donc :

    - versionné ;
    - modifiable par Pull Request ;
    - historisé ;
    - reproductible.

    On commence ici à retrouver une idée importante du DevOps : **décrire l'infrastructure et les processus d'exploitation sous forme de code**.


Après avoir créé ou modifié le workflow directement sur GitHub, pensez à synchroniser votre dépôt local :

```bash
git pull origin main
```

---

# 17. Publier avec GitHub Pages

La documentation générée par MkDocs est constituée de fichiers statiques : HTML, CSS, JavaScript, images, etc.

Nous n'avons donc pas besoin d'un serveur applicatif complexe pour l'héberger.

**GitHub Pages** permet à GitHub d'héberger directement un site statique associé à un dépôt.

Selon le workflow de déploiement retenu, configurez GitHub Pages depuis :

```text
Settings
    -> Pages
```

Vous pourrez ensuite accéder à votre documentation depuis une URL du type :

```text
https://votre-utilisateur.github.io/votre-projet/
```

!!! info "GitHub joue donc plusieurs rôles"
    Dans notre architecture, GitHub n'est pas seulement l'endroit où nous stockons les fichiers.

    Il fournit plusieurs services :

    **GitHub Repository**

    Hébergement du dépôt Git distant et collaboration.

    **GitHub Actions**

    Exécution de notre chaîne CI/CD.

    **GitHub Pages**

    Hébergement dans le cloud du site statique généré.

    Une seule plateforme fournit donc ici plusieurs briques de notre chaîne de développement et de déploiement.

---

# 18. Le workflow complet

Nous pouvons maintenant reprendre toute la chaîne.

Vous commencez par récupérer les dernières modifications :

```bash
git pull origin main
```

Vous créez une branche :

```bash
git checkout -b ma-branche
```

Vous modifiez votre documentation et la testez localement :

```bash
mkdocs serve
```

Vous contrôlez vos modifications :

```bash
git status
```

Vous créez un commit :

```bash
git add .
git commit -m "Description claire de la modification"
```

Vous envoyez votre branche :

```bash
git push -u origin ma-branche
```

Vous ouvrez ensuite une **Pull Request** sur GitHub.

Après revue et validation :

```text
Pull Request
      |
      v
Merge dans main
      |
      v
GitHub Actions
      |
      v
Construction MkDocs
      |
      v
GitHub Pages
      |
      v
Documentation mise à jour
```

Ce qui pouvait sembler au départ être simplement « écrire quelques fichiers Markdown » est donc devenu une véritable petite chaîne de développement collaborative.

---

# 19. Les commandes Git à connaître

Vous n'avez pas besoin de mémoriser immédiatement des dizaines de commandes.

Celles-ci couvrent déjà une grande partie de vos besoins :

```bash
# Voir l'état du dépôt
git status

# Récupérer les modifications
git pull

# Voir les branches
git branch

# Créer une branche et basculer dessus
git checkout -b ma-branche

# Ajouter les modifications
git add .

# Créer un commit
git commit -m "Description de la modification"

# Envoyer les commits
git push

# Voir l'historique
git log
```

!!! tip "La commande à utiliser en cas de doute"
    Si vous ne savez plus exactement où vous en êtes :


    ```bash
    git status
    ```

    Lisez ce que Git vous répond avant de lancer une succession de commandes trouvées au hasard sur Internet.

---

# 20. Ce que vous devez surtout retenir

À la fin de cette partie, l'objectif n'est pas de réciter les commandes Git par cœur.

Vous devez surtout être capables d'expliquer les rôles respectifs des différents éléments :

```text
Git
    Versionner

GitHub
    Héberger le dépôt et collaborer

Branches
    Isoler les modifications

Pull Requests
    Proposer et relire les modifications

GitHub Actions
    Automatiser la construction et le déploiement

MkDocs
    Générer le site à partir du Markdown

GitHub Pages
    Héberger le site statique
```

Et surtout comprendre le chemin parcouru par une modification :

```text
Je modifie
    -> je teste
        -> je versionne
            -> je propose
                -> on vérifie
                    -> on fusionne
                        -> la plateforme construit
                            -> la plateforme déploie
```

C'est ce fonctionnement général qui est important.

Les commandes, elles, peuvent toujours être retrouvées dans la documentation.

Comprendre **pourquoi** vous les utilisez sera beaucoup plus utile.
