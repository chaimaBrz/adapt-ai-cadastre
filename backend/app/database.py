from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/cadastre"
engine = create_engine(DATABASE_URL)