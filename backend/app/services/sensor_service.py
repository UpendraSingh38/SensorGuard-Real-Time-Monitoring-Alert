from app.database.models import SensorData
from app.database.session import SessionLocal
from app.core.thresholds import THRESHOLDS
from app.services.alert_service import create_alert

def process_sensor_data(topic, data):
    db = SessionLocal()

    sensor = SensorData(
        topic=topic,
        temperature=data["temperature"],
        humidity=data["humidity"],
        voltage=data["voltage"],
        current=data["current"],
        pressure=data["pressure"],
    )
    db.add(sensor)
    db.commit()

    violated = []
    for key, value in data.items():
        if key in THRESHOLDS:
            if value < THRESHOLDS[key]["min"] or value > THRESHOLDS[key]["max"]:
                violated.append(key)

    if violated:
        create_alert(topic, violated, data)

    db.close()