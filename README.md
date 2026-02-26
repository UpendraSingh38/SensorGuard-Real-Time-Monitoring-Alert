"""
Project Overview
================

This repository contains a simple sensor monitoring application with both
backend and frontend components. The backend is a FastAPI server using
SQLAlchemy and an MQTT client to receive sensor data. The frontend is a
React application built with Vite and Tailwind CSS.

Backend Functionality
---------------------

* **Database models** (`app/database/models.py`):
  - `SensorData` stores metrics such as temperature, humidity, voltage, etc.
  - `Alert` logs threshold violations with JSON fields `violated_keys` and
    `actual_values`.

* **Services**:
  - `sensor_service.process_sensor_data` receives MQTT messages, creates
    `SensorData` rows, and triggers alerts when values exceed thresholds
    defined in `app/core/thresholds.py`.
  - `alert_service.create_alert` inserts alerts into the database.

* **API Routes** (`app/api/routes.py`):
  - `GET /sensors` returns the most recent 50 sensor records.
  - `GET /alerts` serializes alert objects into simple dictionaries with
    timestamp, topic/device, violated parameters, and current values.
  - `GET /stats` returns total messages and alerts counts.
  - `POST /seed` populates the database with random sample sensor data and
    example alerts for development/testing.

* **MQTT Client** (`app/mqtt/mqtt_client.py`):
  - Subscribes to a set of sensor topics and forwards incoming JSON payloads
    to the sensor service.
  - Started automatically on FastAPI startup event in `app/main.py`.

* **Configuration**: CORS is enabled for `http://localhost:5173` to allow the
  frontend to communicate with the API.

Frontend Functionality
----------------------

* **React components**:
  - `Dashboard.jsx` shows stats, a temperature/humidity time series chart, and
    recent alerts. It polls the API every 5 seconds and handles empty
    database states by prompting the user to seed data.
  - `RawData.jsx` displays a table of raw sensor records.
  - `Alerts.jsx` lists triggered alerts, highlighting violated parameters,
    with a dramatic header graphic and a persistent dark mode toggle.
    Alerts are refreshed periodically.

* **API client** (`src/api/api.js`): Uses Axios to make HTTP GET requests to
  `/sensors`, `/alerts`, and `/stats`.

* **Styling**: Tailwind CSS with dark mode enabled via `class`, and
  additional UI polish such as cards, gradients, and responsive layouts.

* **Utilities**:
  - A manual "Seed sample data" button on the dashboard triggers the
    `/seed` endpoint and reloads the data immediately.
  - Dark mode toggle persists preference in `localStorage`.

Operational Logic
-----------------

1. Sensor devices publish JSON payloads via MQTT.
2. Backend MQTT client receives messages and stores readings in the database.
3. Any values outside the predefined thresholds generate an alert
   immediately, stored in the `alerts` table.
4. Frontend periodically requests data from the API to update charts and
   listings.
5. When no data exists, users can seed the database or wait for real
   messages.

This Python file serves as documentation of the application's components and
the logic tying them together.
"""
Author- Upendra Singh
