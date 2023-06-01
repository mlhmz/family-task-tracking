# Family Task Tracking

## Links

- [About](#about)
- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Docs](#documentation)
- [Help](HELP.md)

## About

A family task tracking app to give family members (mostly kids) tasks and reward them for completing the tasks.

## Requirements

- [Docker](https://www.docker.com/)
- [Java 17](https://adoptium.net/de/temurin/releases/?version=17) (Backend, can also be built with Docker)
- [Node.js](https://nodejs.org/en/) (optionally with [nvm](https://github.com/nvm-sh/nvm)) (Frontend)

## Quickstart

Launch Compose in Root Directory

```bash
$ docker compose up
```

Installing frontend dependencies in frontend directory

```bash
$ npm install
```

Starting Frontend Dev Environment with Vite in frontend directory

```bash
$ npm run dev
```

Navigate to Keycloak on

```
http://localhost:8080
```

Keycloak Credentials

```
Username - admin
Password - admin
```

## Production

FTT will be delivered as Docker Containers, so a Compose is the best way to go, to host it.

### Prerequisites

- Keycloak
- Reverse Proxy (For TLS) like Traeffik or NGINX

### Compose

```yaml
version: "3.1"

# Services that are required for a production instance
# Ports are not required if a reverse proxy is used
services:
  db:
    image: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: "${POSTGRES_DB:-tasktracking}"
      POSTGRES_USER: "${POSTGRES_USER:-tasktracking}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD:-tasktracking}"
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test:
        [
          "CMD",
          "pg_isready",
          "-q",
          "-d",
          "${POSTGRES_DB:-tasktracking}",
          "-U",
          "${POSTGRES_USER:-tasktracking}",
        ]
      retries: 3
      timeout: 5s
  api:
    image: mlhmz/family-task-tracking:main
    restart: unless-stopped
    labels:
      - "com.centurylinklabs.watchtower.scope=ftt"
    environment:
      DB_HOST: db
      DB_NAME: "${POSTGRES_DB:-tasktracking}"
      DB_USERNAME: "${POSTGRES_USER:-tasktracking}"
      DB_PASSWORD: "${POSTGRES_PASSWORD:-tasktracking}"
      KC_ISSUER_HOST: # URL of the Keycloak Instance
      KC_JWK_HOST: # URL of the Keycloak Instance
      KC_REALM: # Keycloak Realm
    links:
      - db
    depends_on:
      - db
    networks:
      - default
      - reverse_proxy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 15s
      timeout: 2s
      retries: 15
  frontend:
    image: mlhmz/family-task-tracking-frontend:main
    networks:
      - default
      - reverse_proxy
    links:
      - api
    depends_on:
      - api
    labels:
      - "com.centurylinklabs.watchtower.scope=ftt"
    environment:
      LOCAL_AUTH_URL: http://localhost:3000
      NEXTAUTH_URL: # URL of the Frontend URL with Reverse Proxy on it
      NEXTAUTH_SECRET: NONE
      # API Url
      BACKEND_API_URL: # Can be external, can be internal with dockers internal url
      KEYCLOAK_CLIENT_ID: # Keycloak Client
      KEYCLOAK_ISSUER: # URL of the Keycloak Instance
      KEYCLOAK_CLIENT_SECRET: # Keycloak Client Secret
  # Watchtower for CD (optional)
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30 --scope ftt
    labels:
      - "com.centurylinklabs.watchtower.scope=ftt"
networks:
  default:
    driver: bridge
  # Link to the reverse proxy, go with the reverse proxy you want
  reverse_proxy:
    external: true

volumes:
  db-data:
```

## Documentation

- API Documentation (Can be found under <APP-URL>/swagger) [`localhost` Link](http://localhost:8081/swagger)
