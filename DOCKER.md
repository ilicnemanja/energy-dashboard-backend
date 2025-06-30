# Docker Setup for Energy Dashboard Backend

This NestJS application is containerized with Docker and includes PostgreSQL database support.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Mode

1. Build and run the application with PostgreSQL:

```bash
docker-compose up --build
```

2. The application will be available at:
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - PostgreSQL: localhost:5432

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Key environment variables:

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Application port (default: 3000)
- `POSTGRES_HOST`: PostgreSQL host
- `POSTGRES_PORT`: PostgreSQL port
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: PostgreSQL database name

## Docker Commands

### Build only

```bash
docker build -t energy-dashboard-backend .
```

### Run with custom environment file

```bash
docker-compose --env-file .env.production up
```

### View logs

```bash
docker-compose logs -f app
```

### Access PostgreSQL container

```bash
docker-compose exec postgres psql -U postgres -d energy_dashboard
```

### Stop services

```bash
docker-compose down
```

### Remove volumes (⚠️ This will delete database data)

```bash
docker-compose down -v
```

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml` or use an external `.env` file
2. Use a strong PostgreSQL password
3. Consider using Docker secrets for sensitive data
4. Set up proper networking and reverse proxy (nginx/traefik)
5. Configure backup strategy for PostgreSQL data

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Verify network connectivity: `docker-compose exec app ping postgres`

### Port Conflicts

- If port 3000 or 5432 are in use, modify the ports in `docker-compose.yml`

### Permission Issues

- The application runs as non-root user for security
- Ensure proper file permissions if mounting volumes
