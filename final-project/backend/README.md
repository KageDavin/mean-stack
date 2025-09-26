# Online Quiz Backend (Scaffold)

## Setup (local)

1. copy `.env.example` to `.env` and fill values.
2. install:

   ```bash
   npm install
   ```

3. Start in Dev mode

   ```bash
   npm run dev
   ```

-- or for production

-- npm start

-- If needed, create an admin
 curl -X POST <http://localhost:3000/api/v1/auth/register> \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"StrongP@ssw0rd","role":"admin"}'
5. Refresh-token storage and basic JWT handling (see src/services/token.service.js).
