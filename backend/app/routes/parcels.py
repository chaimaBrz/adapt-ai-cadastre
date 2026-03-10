from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine

router = APIRouter()


@router.get("/parcels")
def get_parcels():
    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE(json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(geom)::json,
                    'properties', json_build_object(
                        'id', id,
                        'object_rid', object_rid,
                        'tex', tex,
                        'supf', supf,
                        'siren', siren
                    )
                )
            ), '[]'::json)
        )
        FROM parcels;
    """)
    with engine.connect() as conn:
        result = conn.execute(query).scalar()
    return result


@router.get("/parcels/{parcel_id}")
def get_parcel(parcel_id: int):
    query = text("""
        SELECT json_build_object(
            'id', id,
            'object_rid', object_rid,
            'tex', tex,
            'supf', supf,
            'siren', siren
        )
        FROM parcels
        WHERE id = :parcel_id;
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"parcel_id": parcel_id}).scalar()
    return result