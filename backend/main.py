from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import company, generate, chat

# Create all DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PDPL Compliance Platform API",
    description="Demo API for Saudi Arabia PDPL compliance automation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(company.router)
app.include_router(generate.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "name": "PDPL Compliance Platform",
        "version": "1.0.0-demo",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
