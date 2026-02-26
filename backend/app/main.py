from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.api.routes import router
from app.mqtt.mqtt_client import start_mqtt

# 1️⃣ Create FastAPI app FIRST
app = FastAPI()

# 2️⃣ Create database tables
Base.metadata.create_all(bind=engine)

# 3️⃣ Add middleware AFTER app is created
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4️⃣ Include router
app.include_router(router)

# 5️⃣ Root endpoint
@app.get("/")
def root():
    return {"message": "Backend is running successfully 🚀"}

# 6️⃣ Startup event
@app.on_event("startup")
def startup_event():
    start_mqtt()