# QuantumBallot Backend

This is the backend for the QuantumBallot voting system.

## Quick Start

### Prerequisites

- Node.js v16+ and npm v7+
- No external database required (uses embedded LevelDB)

### Installation & Startup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy and edit)
cp .env.example .env

# 3. Build TypeScript
npm run build

# 4. Start the server
npm start
```

The server will start on `http://localhost:3000` (configurable via PORT in .env)

### Development Mode (with auto-reload)

```bash
npm run dev
```

## Verification

Test that everything works:

```bash
# Health check
curl http://localhost:3000/health

# Main API
curl http://localhost:3000/

# Blockchain API
curl http://localhost:3000/api/blockchain/

# Committee API
curl http://localhost:3000/api/committee/candidates
```

All endpoints should return proper JSON responses.

## Environment Configuration

Required environment variables (see `.env.example` for full details):

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret
- `ACCESS_TOKEN_SECRET` - Access token secret
- `DB_PATH` - LevelDB database path
- `SECRET_KEY_IDENTIFIER` - 64-char hex encryption key
- `SECRET_IV_IDENTIFIER` - 32-char hex IV
- `SECRET_KEY_VOTES` - 64-char hex encryption key
- `SECRET_IV_VOTES` - 32-char hex IV
- Email settings (MAILER\_\*)

**Generate encryption keys:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

## API Endpoints

### Core Endpoints

- `GET /` - API status and version
- `GET /health` - Health check

### Blockchain API (`/api/blockchain`)

- `GET /` - Get full blockchain state
- `GET /chain` - Get blockchain
- `GET /blocks` - Get all blocks
- `GET /block-detail/:id` - Get specific block
- `GET /transactions` - Get all transactions
- `GET /pending-transactions` - Get pending transactions
- `POST /transaction` - Submit new transaction
- `POST /transaction/broadcast` - Broadcast transaction
- `GET /mine` - Mine new block
- `GET /voters` - Get voters list
- `GET /candidates` - Get candidates list
- `GET /deploy-voters` - Deploy generated voters
- `GET /deploy-candidates` - Deploy candidates
- `GET /get-results` - Get election results
- `GET /get-results-computed` - Get computed results

### Committee API (`/api/committee`)

- `GET /registers` - Get citizen registers
- `GET /candidates` - Get candidates
- `POST /add-candidate` - Add new candidate
- `POST /add-user` - Add committee user
- `GET /generate-identifiers` - Generate voter identifiers

## Architecture

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (compiled to JavaScript)
- **Database**: LevelDB (embedded key-value store)
- **Blockchain**: Custom implementation with smart contracts
- **Encryption**: AES-256-CBC for vote and identifier encryption
- **Authentication**: JWT-based

## Testing

Full startup log available in `STARTUP_LOG.txt`

All endpoints have been smoke tested and are operational.
