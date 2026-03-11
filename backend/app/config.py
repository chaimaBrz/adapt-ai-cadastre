import os
from pathlib import Path
from dotenv import load_dotenv

# Définit le chemin du dossier backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Définit le chemin complet vers le fichier .env
ENV_PATH = BASE_DIR / ".env"

# Charge les variables d'environnement depuis backend/.env
load_dotenv(dotenv_path=ENV_PATH)

# Récupère la clé API INSEE depuis les variables d'environnement
INSEE_API_KEY = os.getenv("INSEE_API_KEY")

# Affiche le chemin du fichier .env et la clé chargée pour le débogage
print("FICHIER .env =", ENV_PATH)
print("CLE INSEE CHARGEE =", INSEE_API_KEY)