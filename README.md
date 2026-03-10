# Adapt AI Cadastre Exercise

Application web simple pour afficher des parcelles cadastrales sur une carte interactive OpenStreetMap.

## Fonctionnalités réalisées

- import de parcelles cadastrales dans PostgreSQL/PostGIS
- API FastAPI pour exposer les données
- interface React avec Leaflet
- affichage des parcelles sur une carte
- clic sur une parcelle pour afficher ses informations
- mise en surbrillance de la parcelle sélectionnée

## Stack technique

### Back-end

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- PostGIS

### Front-end

- React
- Vite
- React Leaflet
- OpenStreetMap

## Structure du projet

```text
adapt-ai-cadastre
├── backend
│   ├── app
│   │   ├── routes
│   │   │   └── parcels.py
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── data
├── scripts
└── README.md
Base de données

Base utilisée :

PostgreSQL 16

extension PostGIS activée

Nom de la base :

cadastre

Table principale :

parcels

Colonnes utilisées :

id

geom

object_rid

tex

supf

Lancer le projet
1. Back-end

Créer et activer l'environnement virtuel :

python -m venv backend/venv
backend/venv/Scripts/activate

Installer les dépendances :

pip install -r backend/requirements.txt

Lancer l'API :

uvicorn backend.app.main:app --reload

API disponible sur :

http://127.0.0.1:8000
2. Front-end

Aller dans le dossier front :

cd frontend

Installer les dépendances :

npm install

Lancer l'application :

npm run dev

Application disponible sur :

http://localhost:5173
Routes API
Tester l'API
GET /
GET /test-db
Obtenir toutes les parcelles
GET /parcels

Retour :

GeoJSON FeatureCollection

Obtenir une parcelle par identifiant
GET /parcels/{parcel_id}

Exemple :

GET /parcels/1
Données

Les données cadastrales utilisées proviennent de Parcellaire Express pour le département 02.

Dans cette version, un sous-ensemble de parcelles a été importé pour valider le fonctionnement complet :

base de données

API

affichage cartographique

interaction utilisateur

Travail restant possible

import complet du département

ajout des informations propriétaire via MAJIC

récupération du SIREN

appel de l'API SIREN

amélioration de l'interface utilisateur

ajout de filtres ou recherche

Auteur

Chaima Ben Yahia
```
