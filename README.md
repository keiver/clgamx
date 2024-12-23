# People Directory Application

## Overview

Awesome sample webapp demonstrating server-side rendering and client-side data management with offline support via service worker.

The project leverages React for component rendering, MSW (Mock Service Worker) for API mocking, and a custom caching layer to optimize data fetching. The application displays a directory of people with their details including names, email addresses, balances, and creation dates.

## Getting Started

```bash
npm i
npm start
```

Visit `http://localhost:3000` to access:

- `/appWithSSRData`: Server-side rendered version
- `/appWithoutSSRData`: Client-side rendered version

### Building

```bash
npm run build:server # Build server with MSW
npm run build:client # Build client code
npm run build        # Builds both
```

### Testing

Running tests via jest:

```bash
npm test
```

## Architecture

```bash
challenge/
├── framework/                    # Core framework
│   ├── mock-server/
│   │   ├── client.ts
│   │   ├── handler.ts
│   │   ├── server.ts
│   │   └── mockServiceWorker.js
│   │
│   └── server/                   # Server-side rendering
│       ├── buildHtmlDoc.ts
│       ├── index.ts
│       ├── renderApp.tsx
│       ├── index.tsx
│       └── window.d.ts
│
├── application/                  # React client application components
│   ├── App.tsx
│   ├── Person.tsx
│   ├── Name.tsx
│   ├── validation.ts
│   └── data.d.ts
│
└── caching-fetch-library/        # Data fetching and caching layer
   ├── CacheManager.ts
   └── cachingFetch.ts
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
