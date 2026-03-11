import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

INSEE_API_KEY = os.getenv("INSEE_API_KEY")
print("FICHIER .env =", ENV_PATH)
print("CLE INSEE CHARGEE =", INSEE_API_KEY)