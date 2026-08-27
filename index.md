# Introduction

# Documentation Pédagogique

Bienvenue dans cette documentation pédagogique générée automatiquement à l'aide de MkDocs et hébergée sur GitHub Pages. Cette documentation a été créée dans le but de vous fournir Les informations essentielles de votre contexte d'apprentissage.

## Comment Utiliser Cette Documentation

- **Navigation** : Utilisez la barre de navigation sur la gauche pour accéder aux différentes sections de la documentation. Cliquez sur les liens pour explorer les sujets qui vous intéressent.

- **Recherche** : Si vous recherchez des informations spécifiques, utilisez la fonction de recherche en haut de la page pour trouver rapidement ce dont vous avez besoin.

- **Contributions et Corrections** : Cette documentation est hébergée sur GitHub. Si vous identifiez des erreurs, des inexactitudes ou si vous souhaitez contribuer en ajoutant du contenu, vous êtes invité à soumettre des Pull Requests.

## Hébergement sur GitHub Pages

Cette documentation est automatiquement mise en ligne grâce à **GitHub Pages**, une fonctionnalité de GitHub qui permet de publier facilement du contenu statique. Chaque fois que des modifications sont apportées à la documentation et poussées vers la branche principale du référentiel (main), les **GitHub Actions** sont déclenchées pour **générer et déployer automatiquement** les changements dans la documentation à chaque "Push". Ce principe s'appelle CI/CD.

??? info "CI/CD"
    **CI/CD** est l'acronyme de **Continuous Integration (Intégration Continue) et Continuous Delivery (Livraison Continue) ou Continuous Deployment (Déploiement Continu)**. Ces pratiques sont utilisées dans le développement logiciel pour améliorer la qualité du code et accélérer le processus de livraison des logiciels. Voici une définition rapide de chaque terme :</br>
    -    **Continuous Integration (CI)** : Pratique consistant à intégrer régulièrement les modifications de code dans un dépôt central, généralement plusieurs fois par jour. Cela permet de détecter les erreurs tôt grâce à des tests automatisés qui vérifient chaque intégration.</br>
    -    **Continuous Delivery (CD)** : Pratique qui étend CI en automatisant le processus de livraison du code jusqu'à un environnement de staging ou de pré-production. Cela permet de garantir que le code est toujours prêt à être déployé en production à tout moment.</br>
    -    **Continuous Deployment (CD)** : Variante de Continuous Delivery où le code est automatiquement déployé en production dès qu'il passe les tests automatisés. Cela permet des mises à jour fréquentes et rapides en production.</br>
    Ces pratiques favorisent une approche agile et réactive, réduisent les risques et améliorent la qualité du produit final.

Il existe de nombreux outils dédiés à la documentation:

# Outils de documentation

L'ensemble du projet que vous allez préparer cette année devra etre documenté avec l'un de ces outils et être hebergé via github pages afin que l'accès soit toujhours possible même après l'obtention de votre dépot. Vous veuillerez à transmetrte à vos enseignants l'URL de la documentation afin qu'elle puisse être lue nottament pour les épreuves de fin d'année.

L'ancêtre de ces outils est le format **DocBook** (en XML), suivi d'**Asciidoc**, avant la création du langage **Markdown** (MD).

=== "mkdocs"

    ```bash
    https://squidfunk.github.io/mkdocs-material/publishing-your-site/
    ```

=== "Docusaurus "

    ```bash
    https://docusaurus.io/fr/docs/
    ```

=== "Sphinx"

    ```bash
    https://www.sphinx-doc.org/en/master/usage/installation.html
    ```

=== "Astro"

    ```bash
    https://docs.astro.build/fr/getting-started/
    ```

## Gestion des secrets (mots de passe)

L'ensemble des mots de passe utilisés dans votre infrastructure ne doit pas être présent dans cette documentation. Vous choisirez un gestionnaire de mots de passe sécurisé afin de partager les mots de passe avec vos collègues. Là encore, il n'y a que l'embarras du choix concernant les outils (Bitwarden, LastPass, Dashlane, PassBolt), etc.


N'hésitez pas à explorer les différentes sections et à profiter de cette ressource pour enrichir votre compréhension des sujets abordés.

Happy learning!
