from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/cadastre"
engine = create_engine(DATABASE_URL)


@app.get("/")
def root():
    return {"message": "API cadastre OK"}


@app.get("/test-db")
def test_db():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM parcels"))
        count = result.scalar()
    return {"parcels_count": count}


@app.get("/parcels")
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
                        'supf', supf
                    )
                )
            ), '[]'::json)
        )
        FROM parcels;
    """)
    with engine.connect() as conn:
        result = conn.execute(query).scalar()
    return result