from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.database.models import SensorData, Alert

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/sensors")
def get_sensors(db: Session = Depends(get_db)):
    return db.query(SensorData).order_by(SensorData.timestamp.desc()).limit(50).all()

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    # return a plain list of dictionaries so we can easily add derived fields
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
    return [
        {
            "id": a.id,
            "topic": a.topic,
            "timestamp": a.timestamp,
            "violated_keys": a.violated_keys,
            "actual_values": a.actual_values,
            # human readable message could be computed on frontend as well
        }
        for a in alerts
    ]

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(SensorData).count()
    alerts = db.query(Alert).count()
    return {"total_messages": total, "total_alerts": alerts}


@router.post("/seed")
def seed_data(db: Session = Depends(get_db)):
    """Insert a handful of random sensor records for use in the frontend.

    Usage: POST /seed  (no body required)
    """
    from random import uniform

    from app.services.alert_service import create_alert

    for i in range(10):
        sd = SensorData(
            topic=f"sensor/device{(i % 5) + 1}",
            temperature=uniform(20, 60),
            humidity=uniform(30, 90),
            voltage=uniform(3.0, 3.5),
            current=uniform(0.1, 1.0),
            pressure=uniform(100, 110),
        )
        db.add(sd)
    db.commit()

    # also create a couple of sample alerts to illustrate the alerts page
    create_alert("sensor/device1", ["temperature"], {"temperature": 99})
    create_alert("sensor/device2", ["humidity", "pressure"], {"humidity": 10, "pressure": 2000})

    return {"message": "seeded 10 records and 2 alerts"}