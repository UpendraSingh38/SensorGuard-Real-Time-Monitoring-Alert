import json
import paho.mqtt.client as mqtt
from app.core.config import settings
from app.services.sensor_service import process_sensor_data

TOPICS = [
    "sensor/device1",
    "sensor/device2",
    "sensor/device3",
    "sensor/device4",
    "sensor/device5"
]

def on_connect(client, userdata, flags, rc):
    for topic in TOPICS:
        client.subscribe(topic)

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    process_sensor_data(msg.topic, data)

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
    client.loop_start()