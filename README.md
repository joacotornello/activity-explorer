# Activity Explorer

Small take-home app for exploring sticky-note activity.

## Requirements

- `Node.js >= 20`
- `yarn@4`

## Install

```bash
yarn install
```

## Development

Start client and API together:

```bash
yarn dev
```

Local URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:3001`

## Production bundle

Build client bundle:

```bash
yarn build
```

Run local production-like setup in two terminals.

Terminal 1:

```bash
yarn start:server
```

Terminal 2:

```bash
yarn preview
```

Preview URL:

- Built client: `http://localhost:4173`

`yarn preview` serves `dist/` and proxies `/api` to local API on port `3001`.

## Quality checks

```bash
yarn test
yarn typecheck
yarn lint
```

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Decisions](docs/DECISIONS.md)
- [Design](docs/DESIGN.md)
- [Principles](docs/PRINCIPLES.md)
- [Tasks / status](docs/TASKS.md)
