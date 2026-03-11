# Adapt AI Cadastre Exercise

Application web permettant d'afficher des parcelles cadastrales sur une carte interactive OpenStreetMap.

---

## Objectif

Ce projet répond à l'exercice technique demandant de :

- Récupérer des données cadastrales du département 02
- Les stocker dans une base PostgreSQL avec PostGIS
- Créer une API pour exposer les données
- Développer une interface web simple avec carte interactive
- Permettre le clic sur une parcelle pour afficher ses informations
- Afficher le numéro SIREN associé au propriétaire

---

## Fonctionnalités

- Import de données cadastrales Parcellaire Express dans PostgreSQL/PostGIS
- Création d'une API FastAPI pour exposer les parcelles
- Affichage des parcelles sur une carte OpenStreetMap
- Clic sur une parcelle pour afficher ses détails
- Recherche d'une parcelle par ID, Object RID ou SIREN
- Mise en surbrillance de la parcelle sélectionnée
- Récupération des informations de propriétaire depuis une table séparée `parcel_owners`
- Affichage du SIREN dans le panneau de détail
- Appel à l'API SIRENE de l'INSEE pour enrichir les informations d'une parcelle

---

## Stack technique

### Back-end

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL + PostGIS
- Requests
- python-dotenv

### Front-end

- React
- Vite
- React Leaflet
- OpenStreetMap

---

## Structure du projet

```
adapt-ai-cadastre/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── parcels.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── data/
└── README.md
```

---

## Base de données

| Paramètre      | Valeur        |
| -------------- | ------------- |
| SGBD           | PostgreSQL 16 |
| Extension      | PostGIS       |
| Nom de la base | `cadastre`    |

### Table principale — `parcels`

| Colonne      | Description              |
| ------------ | ------------------------ |
| `id`         | Identifiant unique       |
| `geom`       | Géométrie de la parcelle |
| `object_rid` | Référence objet          |
| `tex`        | Texte associé            |
| `supf`       | Superficie               |

### Table complémentaire — `parcel_owners`

| Colonne      | Description              |
| ------------ | ------------------------ |
| `id`         | Identifiant unique       |
| `parcel_id`  | Référence vers `parcels` |
| `owner_name` | Nom du propriétaire      |
| `siren`      | Numéro SIREN             |

---

## Lancer le projet

### 1. Back-end

Créer et activer l'environnement virtuel :

```bash
python -m venv backend/venv
backend\venv\Scripts\activate
```

Installer les dépendances :

```bash
pip install -r backend/requirements.txt
```

Créer le fichier `backend/.env` :

```env
INSEE_API_KEY=votre_cle_api_insee
```

Lancer l'API :

```bash
uvicorn backend.app.main:app --reload
```

> API disponible sur : `http://127.0.0.1:8000`

---

### 2. Front-end

Aller dans le dossier frontend :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer l'application :

```bash
npm run dev
```

> Application disponible sur : `http://localhost:5173`

---

## Routes API

| Méthode | Route                         | Description                                      |
| ------- | ----------------------------- | ------------------------------------------------ |
| `GET`   | `/`                           | Test de l'API                                    |
| `GET`   | `/test-db`                    | Test de la connexion base de données             |
| `GET`   | `/parcels`                    | Toutes les parcelles (GeoJSON FeatureCollection) |
| `GET`   | `/parcels/{parcel_id}`        | Une parcelle par identifiant                     |
| `GET`   | `/parcels/{parcel_id}/owner`  | Propriétaire d'une parcelle                      |
| `GET`   | `/parcels/{parcel_id}/sirene` | Informations SIRENE d'une parcelle               |
| `GET`   | `/parcels/search/{value}`     | Recherche par ID, Object RID ou SIREN            |

### Exemples

```
GET /parcels/1
GET /parcels/1/owner
GET /parcels/1/sirene
GET /parcels/search/1
GET /parcels/search/Objet_2188298
GET /parcels/search/552100554
```

---

## Données

Les données cadastrales proviennent de **Parcellaire Express** pour le département 02.

Dans cette version, un sous-ensemble de parcelles a été importé afin de valider le fonctionnement complet de l'application : stockage en base, exposition via API, affichage cartographique, interaction utilisateur, recherche et consultation détaillée.

---

## Propriétaire & SIREN

Les informations de propriétaire sont stockées dans une table dédiée `parcel_owners`, reliée aux parcelles via `parcel_id`. Cette structure permet de simuler proprement l'intégration de données MAJIC dans le flux applicatif :

1. Sélection d'une parcelle
2. Récupération du propriétaire lié
3. Affichage du numéro SIREN

Le bonus a également été amorcé avec un appel réel à l'**API SIRENE de l'INSEE** à partir du SIREN stocké pour la parcelle. Dans cette version, la donnée propriétaire est stockée localement dans la base et les données SIRENE sont enrichies via l'API INSEE.

---

## Améliorations possibles

- Import d'un volume plus important de données du département 02
- Intégration complète d'une vraie source MAJIC
- Enrichissement plus complet via l'API SIRENE
- Amélioration de l'interface utilisateur
- Ajout de filtres avancés
- Affichage d'informations complémentaires sur les parcelles

---

## Auteur

**Chaima Ben Yahia**
