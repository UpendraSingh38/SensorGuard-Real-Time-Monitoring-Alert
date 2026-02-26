from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.sql import func
from app.database.session import Base

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True)
    topic = Column(String(100))
    temperature = Column(Float)
    humidity = Column(Float)
    voltage = Column(Float)
    current = Column(Float)
    pressure = Column(Float)
    timestamp = Column(DateTime, server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    topic = Column(String(100))
    violated_keys = Column(JSON)
    actual_values = Column(JSON)
    timestamp = Column(DateTime, server_default=func.now())