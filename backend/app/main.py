from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes.parcels import router as parcels_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parcels_router)


@app.get("/")
def root():
    return {"message": "API cadastre OK"}