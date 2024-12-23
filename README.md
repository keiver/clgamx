# People Directory Application

## Overview

Awesome webapp demonstrating server-side rendering and client-side data management with offline support via service worker.

```bash
challenge/
├── application/            # React application components
├── caching-fetch-library/  # Custom caching implementation
└── framework/              # Server and runtime implementation
├── mock-server/            # MSW configuration
└── server/                 # Fastify server setup
```

## Getting Started

```bash
npm i
npm start
```

Visit http://localhost:3000 to access:

- `/appWithSSRData`: Server-side rendered version
- `/appWithoutSSRData`: Client-side rendered version

## Building

```bash
npm run build:server # Build server with MSW
npm run build:client # Build client code
npm run build        # Builds both
```

## Architecture

### Framework

- Fastify server with SSR support
- React client with hydration
- Service worker for offline capability via MSW

### Caching Library

- In-memory caching (50MB max size)
- Request deduplication using in-flight tracking
- Response size calculation
- Entry timestamps
- JSON serialization for SSR hydration

### Testing

Running tests via jest:

```bash
npm test
```

## Known Issues

- Cache size management not implemented (structure exists)
- Stale-while-revalidate pattern could be added using existing timestamps
- Memory cleanup tests incomplete
- Build process needs optimization
- Error boundaries for component error handling needed
- Testing coverage incomplete

## Setup monitoring for prod (out of time)

- Security headers configuration
- Production build optimizations
- CI/CD pipeline setup, maybe Jenkins or Github Actions
- Environment variable management for API keys and other sensitive data
- Health check endpoints for monitoring
- Create custom containers for the main app components

## License

ISC. See [LICENSE.md](LICENSE.md) for details.
