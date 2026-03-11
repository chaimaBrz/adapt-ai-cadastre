from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine
from backend.app.config import INSEE_API_KEY
import requests

router = APIRouter()

# Appelle l'API SIRENE de l'INSEE à partir d'un numéro SIREN
def get_sirene_data(siren: str):
    if not siren:
        return None

    url = f"https://api.insee.fr/api-sirene/3.11/siren/{siren}"
    headers = {
        "X-INSEE-Api-Key-Integration": INSEE_API_KEY
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        print("STATUT INSEE =", response.status_code)
        print("REPONSE INSEE =", response.text)

        if response.status_code == 200:
            return response.json()

        return None

    except Exception as e:
        print("ERREUR INSEE =", str(e))
        return None


# Retourne toutes les parcelles au format GeoJSON pour l'affichage sur la carte
@router.get("/parcels")
def get_parcels():
    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE(json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(p.geom)::json,
                    'properties', json_build_object(
                        'id', p.id,
                        'object_rid', p.object_rid,
                        'tex', p.tex,
                        'supf', p.supf
                    )
                )
            ), '[]'::json)
        )
        FROM parcels p;
    """)
    with engine.connect() as conn:
        result = conn.execute(query).scalar()
    return result

# Retourne les informations principales d'une parcelle à partir de son identifiant
@router.get("/parcels/{parcel_id}")
def get_parcel(parcel_id: int):
    query = text("""
        SELECT json_build_object(
            'id', p.id,
            'object_rid', p.object_rid,
            'tex', p.tex,
            'supf', p.supf
        )
        FROM parcels p
        WHERE p.id = :parcel_id;
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"parcel_id": parcel_id}).scalar()
    return result



# Retourne les informations du propriétaire liées à une parcelle
@router.get("/parcels/{parcel_id}/owner")
def get_parcel_owner(parcel_id: int):
    query = text("""
        SELECT json_build_object(
            'parcel_id', po.parcel_id,
            'owner_name', po.owner_name,
            'siren', po.siren
        )
        FROM parcel_owners po
        WHERE po.parcel_id = :parcel_id
        LIMIT 1;
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"parcel_id": parcel_id}).scalar()
    return result


# Retourne les informations SIRENE enrichies à partir du SIREN du propriétaire
@router.get("/parcels/{parcel_id}/sirene")
def get_parcel_sirene(parcel_id: int):
    query = text("""
        SELECT po.siren
        FROM parcel_owners po
        WHERE po.parcel_id = :parcel_id
        LIMIT 1;
    """)
    with engine.connect() as conn:
        siren = conn.execute(query, {"parcel_id": parcel_id}).scalar()

    if not siren:
        return {"message": "Aucun SIREN trouvé pour cette parcelle"}

    sirene_data = get_sirene_data(siren)

    if not sirene_data:
        return {
            "siren": siren,
            "message": "Impossible de récupérer les données SIRENE"
        }

    unite_legale = sirene_data.get("uniteLegale", {})

    return {
        "siren": siren,
        "denomination": unite_legale.get("denominationUniteLegale"),
        "nom": unite_legale.get("nomUniteLegale"),
        "prenom": unite_legale.get("prenom1UniteLegale"),
        "categorie_juridique": unite_legale.get("categorieJuridiqueUniteLegale"),
        "etat_administratif": unite_legale.get("etatAdministratifUniteLegale"),
        "date_creation": unite_legale.get("dateCreationUniteLegale")
    }


# Retourne toutes les informations utiles d'une parcelle en une seule réponse
@router.get("/parcels/{parcel_id}/full-details")
def get_parcel_full_details(parcel_id: int):
    query = text("""
        SELECT json_build_object(
            'id', p.id,
            'object_rid', p.object_rid,
            'tex', p.tex,
            'supf', p.supf,
            'owner_name', po.owner_name,
            'siren', po.siren,
            'geometry', ST_AsGeoJSON(p.geom)::json,
            'center', ST_AsGeoJSON(ST_PointOnSurface(p.geom))::json
        )
        FROM parcels p
        LEFT JOIN parcel_owners po ON po.parcel_id = p.id
        WHERE p.id = :parcel_id
        LIMIT 1;
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"parcel_id": parcel_id}).scalar()
    return result


@router.get("/parcels/search/{search_value}")
def search_parcel(search_value: str):
    query = text("""
        SELECT json_build_object(
            'id', p.id,
            'object_rid', p.object_rid,
            'tex', p.tex,
            'supf', p.supf,
            'owner_name', po.owner_name,
            'siren', po.siren,
            'geometry', ST_AsGeoJSON(p.geom)::json,
            'center', ST_AsGeoJSON(ST_PointOnSurface(p.geom))::json
        )
        FROM parcels p
        LEFT JOIN parcel_owners po ON po.parcel_id = p.id
        WHERE CAST(p.id AS TEXT) = :search_value
           OR LOWER(p.object_rid) = LOWER(:search_value)
           OR CAST(po.siren AS TEXT) = :search_value
        LIMIT 1;
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"search_value": search_value}).scalar()
    return result