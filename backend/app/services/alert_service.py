from app.database.models import Alert
from app.database.session import SessionLocal

def create_alert(topic, violated_keys, actual_values):
    db = SessionLocal()
    alert = Alert(
        topic=topic,
        violated_keys=violated_keys,
        actual_values=actual_values
    )
    db.add(alert)
    db.commit()
    db.close()