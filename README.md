# Nexus Paste

Nexus Paste is a lightweight, self-hosted Pastebin-style application for sharing text and source code through unique URLs.

It is built with React, Flask, and PostgreSQL and is designed to eventually run as a Dockerized service on a personal home server.

## Features

* Create text or code pastes
* Unique paste URLs
* Syntax/language selection
* Paste expiration
* Copy paste content
* View raw paste content
* Delete pastes
* PostgreSQL persistence
* Responsive React frontend
* Flask REST API
* Designed for Docker and self-hosted deployment

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* React Syntax Highlighter

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-CORS
* PostgreSQL
* psycopg2

### Planned Deployment

* Docker
* Docker Compose
* GitHub Actions
* GitHub Container Registry
* Nexus home server

## Project Structure

```text
nexus-paste/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   └── routes.py
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
├── .gitignore
└── README.md
```

## Local Development

### Prerequisites

Install:

* Node.js
* npm
* Python 3
* PostgreSQL

### 1. Clone the repository

```bash
git clone git@github.com:YOUR_USERNAME/nexus-paste.git
cd nexus-paste
```

### 2. Backend setup

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

Create `.env`:

```env
DATABASE_URL=postgresql://nexus_paste:YOUR_PASSWORD@localhost:5432/nexus_paste
```

Start Flask:

```bash
python run.py
```

The API will be available at:

```text
http://localhost:5000
```

Health check:

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{
  "status": "ok"
}
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend

npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## API

### Health

```http
GET /api/health
```

### Create Paste

```http
POST /api/pastes
```

Example:

```json
{
  "title": "Docker Compose Example",
  "content": "services:\n  postgres:\n    image: postgres:17",
  "language": "yaml",
  "expiration": "1h"
}
```

### Get Paste

```http
GET /api/pastes/<paste_id>
```

### Get Raw Paste

```http
GET /api/pastes/<paste_id>/raw
```

### Delete Paste

```http
DELETE /api/pastes/<paste_id>
```

## Expiration

Supported expiration values:

| Value   | Duration   |
| ------- | ---------- |
| `never` | Never      |
| `10m`   | 10 minutes |
| `1h`    | 1 hour     |
| `1d`    | 1 day      |
| `7d`    | 7 days     |
| `30d`   | 30 days    |

Expired pastes are removed when they are requested.

## Development

Run the frontend and backend separately during development.

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
source .venv/bin/activate
python run.py
```

