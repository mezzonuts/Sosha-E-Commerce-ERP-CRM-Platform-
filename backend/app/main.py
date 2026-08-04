from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.database.session import engine
from app.models.user import Base
from app.routers import auth, products, customers, orders, mobile, inventory, payments, shipments, crm, reporting, categories, marketplace, whatsapp, cart
from app.core.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler

app = FastAPI(
    title="Sosha E-Commerce ERP CRM API",
    version="0.1.0",
    description="Integrated E-Commerce, ERP, and CRM Platform API"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

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
app.include_router(inventory.router)
app.include_router(payments.router)
app.include_router(shipments.router)
app.include_router(crm.router)
app.include_router(reporting.router)
app.include_router(categories.router)
app.include_router(marketplace.router)
app.include_router(whatsapp.router)
app.include_router(cart.router)

@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "The requested resource was not found", "path": request.url.path},
    )

@app.exception_handler(500)
async def internal_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )

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
