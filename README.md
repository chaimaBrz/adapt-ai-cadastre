# Adapt AI Cadastre Exercise

Application web simple permettant d’afficher des parcelles cadastrales sur une carte interactive OpenStreetMap.

## Objectif

Ce projet répond à l’exercice technique demandant de :

- récupérer des données cadastrales du département 02
- les stocker dans une base PostgreSQL avec PostGIS
- créer une API pour exposer les données
- développer une interface web simple avec carte interactive
- permettre le clic sur une parcelle pour afficher ses informations
- afficher le numéro SIREN associé au propriétaire

## Fonctionnalités réalisées

- import de données cadastrales Parcellaire Express dans PostgreSQL/PostGIS
- création d’une API FastAPI pour exposer les parcelles
- affichage des parcelles sur une carte OpenStreetMap
- clic sur une parcelle pour afficher ses détails
- recherche d’une parcelle par ID, Object RID ou SIREN
- mise en surbrillance de la parcelle sélectionnée
- récupération des informations de propriétaire depuis une table séparée parcel_owners
- affichage du SIREN dans le panneau de détail
- appel à l’API SIRENE de l’INSEE pour enrichir les informations d’une parcelle

## Stack technique

### Back-end

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- PostGIS
- Requests
- python-dotenv

### Front-end

- React
- Vite
- React Leaflet
- OpenStreetMap

## Structure du projet

adapt-ai-cadastre
├── backend
│ ├── app
│ │ ├── routes
│ │ │ └── parcels.py
│ │ ├── config.py
│ │ ├── database.py
│ │ └── main.py
│ └── requirements.txt
├── frontend
│ ├── src
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ └── package.json
├── data
└── README.md

## Base de données

Base utilisée :

- PostgreSQL 16
- extension PostGIS activée

Nom de la base :

- `cadastre`

Table principale :

- `parcels`

Colonnes utilisées :

- `id`
- `geom`
- `object_rid`
- `tex`
- `supf`

Table complémentaire :

- `parcel_owners`

Colonnes utilisées :

- `id`
- `parcel_id`
- `owner_name`
- `siren`

## Lancer le projet

### 1. Back-end

Créer et activer l’environnement virtuel :

```bash
python -m venv backend/venv
backend\venv\Scripts\activate
```
