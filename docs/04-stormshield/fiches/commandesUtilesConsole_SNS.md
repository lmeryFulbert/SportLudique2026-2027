# CheatSheet

## Commandes utiles de console (ou en ssh) des VM Pare-feu SNS

### Réinitialiser le pare-feu avec la commande defaultconfig

```Bash
defaultconfig 

Usage: \[options\]
        -f:     Force
        -r:     Reboot after defaultconfig
        -D:     Only Restore the data partition
        -p:     Reset password
        -u:     Check usb token boot restoration
        -d:     Dump root partition after defaultconfig
        -k:     Keep autoupdate data (Pattern, Pvm, Clamav, Kaspersky, URLFiltering), default SSL proxy authority, default sslvpn full authority and ssh host keys
        -l:     Keep network configuration file
        -n:     Do not mark firewall as having a defaultconfig configuration
        -c:     No backup files (.old)
        -L:     Remove logs
        -s:     Safe mode. Restore network configuration with only first interface enabled.
        -t:     Reset TPM (TPM password required)
```

-   taper ceci  pour redémarrer en configuration usine.
```Bash
defaultconfig --f --r --p --c -L
```

### Principe de la modification de la configuration

La configuration du pare-feu se trouve dans le dossier ConfigFiles. Il est possible **d'intervenir directement dans les fichiers** (des exemples sont très souvent présents).

Une fois la modification réalisée, il est nécessaire de recharger la configuration. Là aussi, cela suit un même principe : la commande commence par « en », en saisissant ces 2 lettres et en « tabulant », on dispose de l'ensemble des commandes qui sont dans /usr/Firewall/sbin. Il faut bien sûr lancer la commande correspondante à la modification
opérée.

Par exemple, pour modifier l'adresse IP d'une interface :

```Bash
vi ConfigFiles/network 
```
⇒ Modification des paramètres souhaités à l'aide de vi. Définition des principaux paramètres sous le nom de section de l'interface ( \[ethernet0\] ) :

-   State = 1 ou 0 Connectivité de l\'interface activée ou non
-   Media = 0 à 6 Définit la vitesse de média (0 = auto-négociation)
-   Protected = 1 ou 0 Interface protégée ou non (anti-spoofing sur des
    interfaces internes)
-   Address
-   Mask
-   Gateway
-   Sauvegarder les modifications.
-   Il suffit ensuite de recharger les configurations :

 ```Bash
 ennetwork
 ```

Un ifconfig permet de valider la prise en compte des nouveaux paramètres.

**Si on modifie la politique de filtrage** :
 ```Bash
 enfilter -u
 ``` 
