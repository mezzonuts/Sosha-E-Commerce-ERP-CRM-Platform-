import sys
from pathlib import Path

backend_root = Path(__file__).resolve().parents[2]
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.database.connection import engine


try:
    connection = engine.connect()
    print("Database Connected")
    connection.close()

except Exception as e:
    print(e)