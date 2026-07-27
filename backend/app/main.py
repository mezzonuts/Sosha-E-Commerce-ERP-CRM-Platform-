from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine
from app.models.user import Base
from app.routers import auth, products, customers, orders, mobile

try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

app = FastAPI(
    title="Sosha E-Commerce ERP CRM API",
    version="0.1.0",
    description="Integrated E-Commerce, ERP, and CRM Platform API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(mobile.router)

@app.get("/")
def root():
    return {
        "message": "Sosha Backend ERP CRM API Running",
        "version": "0.1.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }
