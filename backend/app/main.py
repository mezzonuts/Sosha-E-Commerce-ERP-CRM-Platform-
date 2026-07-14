from fastapi import FastAPI


app = FastAPI(
    title="Sosha E-Commerce ERP CRM API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Sosha ERP CRM API Running",
        "version": "0.1.0"
    }