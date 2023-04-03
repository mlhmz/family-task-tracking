# Family Task Tracking

## Links

* [About](#about)
* [Requirements](#requirements)
* [Quickstart](#quickstart)
* [Docs](#documentation)
* [Help](HELP.md)

## About

A family task tracking app to give family members (mostly kids) tasks and reward them for completing the tasks.

## Requirements

* [Docker](https://www.docker.com/)
* [Java 17](https://adoptium.net/de/temurin/releases/?version=17) (Backend, can also be built with Docker)
* [Node.js](https://nodejs.org/en/) (optionally with [nvm](https://github.com/nvm-sh/nvm)) (Frontend)

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

## Documentation

* API Documentation (Can be found under <APP-URL>/swagger) (`localhost` Link)[http://localhost:8081/swagger]
