# dbCharts - Front

Branche de developpement et de test de la partie Front de dbCharts

## Prérequis

### NodeJS

Telecharger et installer NodeJS 

**WINDOWS** : [node.js](https://nodejs.org/en/).

**UNIX** : 

1. `curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -`. (curl prérequis)
2. `sudo apt-get install nodejs`

## Configuration

Lancer les commandes suivantes a la racine du projet : 

**WINDOWS** ou **UNIX** :

 1. `npm install -g mocha`
 2. `npm install chai`
 3. `npm install jquery`

## Utilisation

Ouvrir dans votre navigateur le index.html présent dans mocha_node_browser

*ou*

Lancer la commande `mocha mocha_node_browser/tests.js` qui executera tout les tests

**Attention** : le mode console ne permet pas l'utilisation de JQuery
