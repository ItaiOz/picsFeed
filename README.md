# PicsFeed

A full-stack image voting application built with React, FastAPI, and PostgreSQL.

## Features

- Browse 100 images from Picsum Photos
- Vote (like/dislike) on images
- View live vote counts
- Export votes to CSV
- Dockerized development environment with hot-reload

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Material-UI (MUI)
- React Scripts

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL

**Infrastructure:**
- Docker & Docker Compose
- Uvicorn (ASGI server)

## Prerequisites

- Docker Desktop installed and running
- Git (for cloning the repository)

## How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ItaiOz/picsFeed.git
   cd picsFeed
   ```

2. **Start the application with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Project Structure

```
picsFeed/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks (API requests)
│   │   └── App.tsx      # Main app component
│   ├── Dockerfile
│   └── package.json
├── server/              # FastAPI backend
│   ├── main.py          # API routes & startup logic
│   ├── models.py        # SQLAlchemy models
│   ├── database.py      # Database configuration
│   ├── Dockerfile
│   └── requirements.txt
└── docker-compose.yml   # Multi-container orchestration
```

## API Endpoints

- `GET /images` - Retrieve all images with vote counts
- `POST /vote` - Submit a vote (like/dislike)
- `GET /export` - Download votes as CSV
- `GET /health` - Health check endpoint

## Development

The application is configured for hot-reload in Docker:

- **Frontend**: Changes to files in `client/src/` will automatically refresh the browser
- **Backend**: Changes to `.py` files will restart the server automatically

## Testing

**Run backend tests:**
```bash
cd server
pip install -r requirements.txt
pytest
```

**Run frontend tests:**
```bash
cd client
npm test
```

**Test Coverage:**
- Backend: API endpoints, vote logic, data validation, CSV export
- Frontend: Component rendering, user interactions, vote handling

## Database Seeding

The application automatically seeds the database with 100 sample images from Picsum Photos on first startup.

## Environment Variables

The backend uses the following environment variable (configured in `docker-compose.yml`):
- `DATABASE_URL`: PostgreSQL connection string
- `WATCHPACK_POLLING`: Enables file watching on Windows for hot-reload

## License

MIT
