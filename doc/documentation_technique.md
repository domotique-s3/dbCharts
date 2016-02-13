# Projet Domotique S3 - dbCharts

#### Documentation technique

## Introdution

Le projet *Domotique S3* vise à générer des graphiques représentant des données enregistrées par des capteurs dans une base de données.

*dbCharts* est la partie du projet qui génère les graphiques à partir de données renvoyées par dbData. Ce programme est développé en JavaScript et peut être exécuté n'importe où sur votre ordinateur, toutefois, *dbData* est requis pour que *dbCharts* puisse fonctionner. Son but est de recevoir une requête HTTP, dans laquelle sont spécifiés les paramètres de la base de données (nom des tables, noms des colonnes, IDs des capteurs, etc.), d'interroger *dbData* qui va renvoyer les données correspondantes et de formater les données reçues afin de construire un graphique.

## Cahier des charges

### Requête HTTP

La requête envoyée à *dbData* doit contenir les informations suivantes :

- Le nom de la colonne des identifiants des capteurs
- Le nom de la colonne des valeurs enregistrées
- Le nom de la colonne des horodatages
- Les horodatages de début et de fin (optionnels, par défaut toutes les entrées seront renvoyées)
- Les noms des tables (au moins une) et la liste des capteurs de chaque table, et optionnellement, leur type (`line`, noté `l`; `column`, noté `c`; `binary`, noté `b`). Si le type n'est pas indiqué, le type par defaut sera `line`
- Le titre du graphique

Ces informations, à fournir via l'URL seront transmises via une requête AJAX par le protocole GET à *dbData* :

- `sensorIdColumn` : colonne des IDs des capteurs
- `valuesColumn` : colonne des valeurs
- `timestampColumn` : colonne des horodatages
- `start` : horodatage de début keen'v un monde meilleur(optionel)
- `end` : horodatage de fin (optionel)
- `sensors[<nom_table>]` : liste des capteurs d'une table de la forme `[<id>_<type>, <id>_<type>, ...]` (au moins un ID)
- `chartTitle` : titre du graphique (optionel)

**Une URL ressemblerait à cela :**

`<lien_vers_dbData>?sensorIdColumn=sensor_id&valuesColumn=value&timestampColumn=timestamp&start=1417962686.2894&end=1418176473.2971&sensors[measurments]=[63_b,34,78_c]&sensors[othertable]=[102_l]&chartTitle=Pluie`

- Colonne des IDs : *sensor_id*
- Colonne des valeurs : *value*
- Colonne des horodatages : *timestamp*
- Horodatage de début : 1417962686.2894
- Horodatage de fin : 1418176473.2971
- Capteurs des tables :
    - *measurments* : 63 (binary), 34 (line, par défaut) et 78 (column)
    - *othertable* : 102 (line)
- Titre du graphique : *Pluie*

### Réponse attendue de *dbData*

La réponse est renvoyée via le protocole HTTP et est au format JSON. Elle peut avoir trois formats différents : 

- Si tout se passe bien, la réponse sera composée des séries de relevés
- Si une ou plusieurs erreurs de validation (URL non valide) surviennent, la réponse contiendra la liste de ces erreurs
- Si une exception survient, l'utilisateur sera informé qu'un problème est survenu mais l'exception ne sera pas affiché.


#### Format général des séries de relevés

```javascript=
{
    "<table>": {
        "<sensor>" : [
            {
                "timestamp": "<timestamp>",
                "value": "<value>"
            },
            {
                "timestamp": "<timestamp>",
                "value": "<value>"
            },
            {
                "timestamp": "<timestamp>",
                "value": "<value>"
            }
            ...
        ],
        "<sensor>" : [
            {
                "timestamp": "<timestamp>",
                "value": "<value>"
            },
            ...
        ]
        ...
    },
	...
}
```

#### Format général des erreurs de validation

```javascript=
[
    {
		"field": "<attribut1>",
		"code": "xxx",
		"message": "Message 1"
    },
    {
		"type": "key"
		"field": "<attribut2>",
		"code": "xxx",
		"message": "Message 1"
    },
	...
]
```

## Documentation des classes

Le code JavaScript présent dans ce projet a été pensé Orienté Objet

### Class Application

Cette classe est la classe principale qui va coordonner toutes les autres. Elle contient une unique méthode : `launch()`

### Class Request

Permet d'envoyer une requete.

`send(file, parameters)` : 
- `file` : fichier vers lequel doit etre envoyé la requête
- `parameters` (optionnel) : parametres à envoyer avec la requête, peut être une query string ou un objet

### Class Parser

Permet de parser, formater : 

`getTitle(url)` : retourne le titre du graphique passé dans l'url, s'il n'y en a pas, retourne une chaine vide
`getType(url)` : retourne un objet contenant le type des capteurs (`sensors`) par table, à partir des informations fournies dans l'URL : 

```j=
{
	<table> : {
		<sensor_id> : <type>,
		...
	}
}
```

> Exemple :
```JSON=
{
	measurments : {
		72 : 'column',
		70 : 'binary',
		67 : 'line',
		...
	}
}
```

`responseForChart(data, type)` : 
- `data` : objet qui est la reponse de *dbData*
- `type` : objet qui est le retour de `Parser.getType(url)`

Cette méthode permet de construire un objet qui sera de la forme attendue par HighCharts : 

```JSON=
[
	{
		name : <table>.<sensor_id>,
		type : <sensor_type>,
		data : [
			[<horodatage>, <valeur>],
			[<horodatage>, <valeur>],
			...
		]
	},
	...
]
```

> Exemple
```JSON=
[
	{
		name : measurments.72,
		type : 'line',
		data : [
			[1487787659.096, 23],
			[1487967579.572, 27],
			...
		]
	}
]
```

`getQueryString(url)` : retourne uniquement la query string, autrement dit, uniquement les parametres passés dans l'URL

### Class Chart

`construct(title, data, container)` : 
- `title` : titre du graphique
- `data` : données necessaire pour construire un graphique. Doit avoir la meme structure que celle retourné par `Parser.responseForChart`
- `container` : id d'un element DOM (ex : `"#chart"`)

## Class ErrorManager

`createModal(content)` : méthode permettant d'afficher un modal d'erreur à l'ecran

`display(errors)` : Affiche les erreurs contenues dans l'objet `errors` (erreurs de formulaire renvoyées par *dbData*)


## Fonctionnement du programme

Le fichier 'index.html' est l'entrée du programme. Une classe Application est contruite et la méthode `Application.launch` est appelée. Celle-ci recupère l'URL, envoie la requête vers *dbData*, parse la réponse et enfin construit le graphique.