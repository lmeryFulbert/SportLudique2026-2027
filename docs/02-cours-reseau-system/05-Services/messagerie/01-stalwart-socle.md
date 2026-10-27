# Stalwart — Socle : installer et exploiter une messagerie

## 1. Préparer Debian 13

Partir d'une VM stable avec adressage IP, resolution DNS et Date/heure correcte.

Dimensionnement **proposé pour ce petit laboratoire**, et non capacité garantie par l'éditeur : 2 vCPU, 4 Gio de RAM, 30 Gio de disque extensible, interface DMZ, adresse fixe. Utiliser LVM si prévu dans le projet ; surveiller l'espace occupé par les boîtes et les journaux. Prévoir une console hyperviseur et un instantané avant modification.

## 2. Installer Stalwart nativement

L’installation de Stalwart s’effectue ici avec le **script fourni par l’éditeur**, sans passer par `apt` : cette procédure n’utilise ni paquet `.deb` ni dépôt APT proposant Stalwart. Le script télécharge le programme, installe ses fichiers, crée un compte de service et met en place une **unité systemd** pour démarrer automatiquement Stalwart et gérer son fonctionnement. Avant de l’exécuter, observez son contenu avec `cat install.sh` et repérez ces différentes opérations. Contrairement à une installation par paquet, les fichiers ainsi installés ne sont pas suivis par `dpkg` et les mises à jour de Stalwart ne seront pas prises en charge par `apt upgrade`.

[Documentation officielle — Installation de Stalwart sous Linux](https://stalw.art/docs/install/platform/linux/){ target="_blank" rel="noopener" }

## 3 Remplir l'assistant

**Objectif :** créer un serveur autonome avec stockage local.

**Explication :** ce TP ne dépend ni d'AD ni d'une base distante. Les paramètres hors socle sont laissés pour la suite.

**Réalisation :** renseigner les écrans suivants :

| Écran / champ | Choix du TP |
| --- | --- |
| Server Hostname | `mail.ville.sportludique.fr` |
| Default Email Domain | `ville.sportludique.fr` |
| Automatically Obtain TLS Certificate | Désactivé : certificat PKI importé dans un second temps |
| Generate Email Signing Keys | Désactivé au socle ; traité au niveau expert |
| Main Data Storage | RocksDB local, `/var/lib/stalwart/` |
| Attachment & File Storage | Use data store |
| Full-Text Search Index | Use data store |
| Cache & Temporary Data | Local in-process store |
| Directory Type | Use the internal directory |
| Log Destination | Log file, `/var/log/stalwart/` |
| DNS Server Type | Manual DNS server management |

Terminer l'assistant. Relever de façon privée l'adresse et le mot de passe de l'administrateur permanent affichés. Le compte bootstrap n'est pas le compte utilisateur de messagerie. Choisir ensuite un secret personnel long et distinct dans les informations d'authentification de ce compte permanent (`Management › Directory › Accounts`).

**Vérification :** le fichier `/etc/stalwart/config.json` existe désormais. Il indique le stockage ; **l'essentiel de la configuration se trouve dans la base**, pas dans un gros fichier texte à éditer.

## 5. Publier A et MX

### Objectif et explication

Le nom du serveur pointe vers une adresse ; le domaine de messagerie pointe vers ce **nom** au moyen d'un MX. Un MX ne contient pas une IP.

### Réalisation

Dans la zone BIND `ville.sportludique.fr`, adapter ces **gabarits non exécutables tels quels** :

```dns
; Remplacer IP_DMZ_MAIL par l'IPv4 réelle joignable depuis cette vue DNS.
mail    300 IN A  IP_DMZ_MAIL
@       300 IN MX 10 mail.ville.sportludique.fr.
```

`@` désigne l'origine de la zone ; `10` est une préférence MX (la plus faible est préférée) ; le point final empêche l'ajout de l'origine. Le TTL 300 est proposé pour faciliter les essais. Le nom cible du MX doit avoir son propre A/AAAA, pas être un alias CNAME. Ne pas publier d'AAAA car IPv6 n'est pas étudié.

Appliquer la procédure DNS déjà maîtrisée : modifier le bon fichier, augmenter le numéro de série, vérifier puis recharger la zone. Avec BIND, utiliser les noms et chemins **réels** :

### Vérification

Depuis le serveur puis depuis un poste LAN :

=== "Linux avec DIG"

    ```bash
    dig ville.sportludique.fr MX +noall +answer
    dig mail.ville.sportludique.fr A +noall +answer
    ```

=== "Windows avec nslookup"

    ```bash
    nslookup
    > set Q=MX
    > ville.sportludique.fr 
    ```

Attendre le MX de préférence 10 et l'adresse DMZ prévue.

## 6. Créer deux comptes locaux

### Objectif et explication

Un **compte** porte une identité et des droits ; l'**adresse** sert à acheminer le courrier ; 
la **boîte** conserve messages et dossiers ;
le **mot de passe** prouve l'identité à l'authentification. 
Un utilisateur peut avoir plusieurs adresses sans avoir plusieurs boîtes.

### Réalisation

Vérifier le domaine dans `Management › Domains › Domains` : `ville.sportludique.fr`, activé.

Dans `Management › Directory › Accounts`, créer deux comptes de type utilisateur :

| Champ technique / fonction | Alice | Bob |
| --- | --- | --- |
| `name` : partie locale | `alice` | `bob` |
| `domainId` : domaine choisi dans la liste | `ville.sportludique.fr` | `ville.sportludique.fr` |
| `description` | Alice Chartres | Bob Chartres |
| `credentials` : mot de passe | Secret individuel saisi dans l'interface | Autre secret individuel |
| Rôle | User | User |
| Adresse résultante | `alice@chartres.sportludique.fr` | `bob@chartres.sportludique.fr` |

Conserver les droits utilisateur ordinaires. Ne pas attribuer Admin aux comptes Thunderbird. Choisir une limite de boîte adaptée au disque si l'enseignant en impose une.

### Vérification

Les deux comptes apparaissent avec les bonnes adresses et sans privilèges d'administration. 

## 7. Configurer Thunderbird

### Objectif et explication

Configurer un profil pour Alice et un autre pour Bob, ou deux postes différents. Pour tester les mots de passe et éviter les confusions, nommer clairement les deux identités.

### Réalisation

Ajouter un compte de courrier existant, saisir nom, adresse et mot de passe, puis choisir la configuration manuelle :

| Paramètre | Entrant | Sortant |
| --- | --- | --- |
| Protocole | IMAP | SMTP Submission |
| Serveur | `mail.chartres.sportludique.fr` | `mail.chartres.sportludique.fr` |
| Port | **143** | **25** |
| Sécurité de connexion | sans | sans |
| Authentification | Mot de passe normal| Mot de passe normal|


L'intitulé « mot de passe normal » décrit le mécanisme d'authentification, pas un transport sans chiffrement. Ne pas choisir STARTTLS sur 465/993. Vérifier que chaque identité utilise son propre serveur sortant et son propre identifiant.

### Vérification

Les dossiers IMAP s'affichent sans exception TLS. L'envoi ne réclame pas le mot de passe de l'autre utilisateur.

## 10. Valider le socle

### Checklist

- [ ] Version Stalwart et version WebUI relevées ; Debian 13 confirmé.
- [ ] Adresse DMZ, route, DNS et horloge vérifiés.
- [ ] Service natif sous systemd et compte `stalwart`.
- [ ] Stockage local et emplacement de journalisation identifiés.
- [ ] A et MX corrects depuis les postes concernés.
- [ ] Deux utilisateurs ordinaires, mots de passe distincts.
- [ ] Aller-retour Alice/Bob réussi et événements retrouvés.

## Documentations

- [Version stable 1.0.0 et rupture de compatibilité](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)
- [Installation native Linux](https://stalw.art/docs/install/platform/linux/)
- [Assistant et choix initiaux](https://stalw.art/docs/install/setup-wizard/)
- [Configuration et stockage des paramètres](https://stalw.art/docs/configuration/)
- [Listeners et ports par défaut](https://stalw.art/docs/server/listener/)
- [Certificats et sources PEM](https://stalw.art/docs/server/tls/certificates/)
- [Mode de récupération](https://stalw.art/docs/configuration/recovery-mode/)
- [Domaines](https://stalw.art/docs/domains/) 
- [gestion des comptes](https://stalw.art/docs/auth/accounts/manage/)
