# 01- Apache (Serveur web)

## Les Virtual Hosts (vhosts) sous Apache

### C’est quoi un Virtual Host ?

Un Virtual Host (ou vhost) permet à un même serveur Apache de gérer plusieurs sites web différents.
Chaque vhost peut avoir :

- son propre nom de domaine (ex. www.site1.local),
- son dossier racine (où sont les fichiers du site),
- ses logs séparés, etc.

C’est grâce aux vhosts qu’un seul serveur peut héberger plusieurs sites.

### Où ça se trouve ?

Sous Linux la configuration des Vhosts se fait :


````bash
/etc/apache2/sites-available/   → contient tous les fichiers de configuration des sites
/etc/apache2/sites-enabled/     → contient les sites actuellement activés (liens symboliques pointant vers sites-available )
````

!!! Danger "Attention"

    NE TOUCHEZ PAS AUX SITES PAR DÉFAUT (000-default.conf, default-ssl.conf)
    Ces fichiers servent de base et assurent que ton Apache démarre correctement.
    Crée tes propres fichiers .conf à côté, c’est plus propre.



### Exemple de configuration

Fichier : ```/etc/apache2/sites-available/mon_site.conf```

````bash
<VirtualHost *:80>
    ServerName monsite.domaine.tld        # Nom FQDN correspondant à l'url
    ServerAlias autrenom.domaine.tld        # Nom alternatif (nom obligatoire) 
    DocumentRoot /var/www/monsite       #Dossier ou sont situé les fichiers html

    <Directory /var/www/monsite>        #Autorisation d'accès
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
                                        #Gestion des logs (indispensable)
    ErrorLog ${APACHE_LOG_DIR}/monsite_error.log
    CustomLog ${APACHE_LOG_DIR}/monsite_access.log combined
</VirtualHost>
````

Explications :

- ServerName → le nom de domaine principal du site.
- ServerAlias → d’autres noms qui pointent vers le même site.
- DocumentRoot → dossier contenant ton site.
- ErrorLog / CustomLog → fichiers de log spécifiques à ce site.

Activer un vhost (et la magie du a2ensite)

Une fois le fichier créé :

````bash
sudo a2ensite mon_site.conf
sudo systemctl reload apache2
````

??? Information "Information"

    a2ensite veut dire “Apache2 Enable Site”<br/>
    Mais en réalité, c’est juste un raccourci pour créer un lien symbolique :
    ````bash
    sudo ln -s /etc/apache2/sites-available/mon_site.conf /etc/apache2/sites-enabled/mon_site.conf
    ````

Donc ````a2ensite = ln -s```` (avec un peu d’intelligence en plus pour vérifier la conf).
L’inverse, 
Donc ````a2dissite````, fait un ````rm```` du lien symbolique

!!! danger "Important"
    Vérifier le status du service: 
    ````sudo systemctl status apache2````,<br/>
    Pour les logs:
    ````${APACHE_LOG_DIR} --> /var/log/apache2/   (sous debian)````,

## Les erreurs classiques

- Modifier ````000-default.conf```` au lieu de créer un vrai fichier : NON.
- Oublier le ````ServerName```` : Apache ne sait pas quel site servir.
- Ne pas recharger Apache : les modifs ne sont pas prises en compte.
- Oublier d’ajouter l'enregistrement DNS correspondant sur le serveur d'autorité (ou à minima configurer le fichier host pour faire pointer le FQDN vers la bonne adresse IP).



