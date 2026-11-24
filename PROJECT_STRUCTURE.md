# Project structure — what each folder holds

Three separate apps, each run on its own:

```
shikkha-bridge/
├── client/          React app you see in the browser (http://localhost:3000)
├── server/          NestJS API (http://localhost:5000)
└── ai-service/       FastAPI service for AI features (http://localhost:8000) — just a health check for now
```

Each part has its own `README` command below. See `TEAM_GUIDE.md` for the branch workflow.

## client/src — the frontend

```
src/
├── App.tsx                   All routes/pages are listed here (one line per page)
├── main.tsx                  App entry point: loads styles, routing, React Query
│
├── modules/                  One folder per feature. Add your feature here.
│   ├── auth/                 Sign in / register (DO NOT CHANGE — shared by everyone)
│   │   ├── pages/              LoginPage.tsx, RegisterPage.tsx — what the user sees
│   │   └── services/           auth.service.ts — the API calls to the backend
│   ├── home/pages/            HomePage.tsx — the page after signing in
│   ├── landing/pages/         LandingPage.tsx — the public page before signing in
│   └── profile/pages/         ProfilePage.tsx — the customizable Bengali character
│
└── shared/                   Things every feature can reuse
    ├── components/
    │   ├── layout/              The app's shell: AppShell (page frame + auth guard),
    │   │                        TopNav (top bar), RouteTransition (page-change animation),
    │   │                        PageHeader (title bar used on every page), Logo
    │   └── form/                Reusable Button, Input, Loader
    ├── bengali-art/            The Bengali design pieces: BengaliAvatar + avatarConfig
    │                           (the customizable character), BridgeScene, KanthaBorder,
    │                           Motifs, kanthaPatterns (the nakshi kantha / alpona art)
    ├── study-guide/            The Chibi AI guide: GuideProvider (state), GuideWalker
    │                           (walks at the bottom), GuideDialog (the 8-bit chat box),
    │                           ChibiSprite (the character drawing), guideBrain.ts (its
    │                           replies), useStudyState.ts (what it knows), pixelAudio.ts
    │                           (its beeps)
    ├── styles/                 globals.css, patterns.css, theme.css — the paper/Kantha look
    ├── hooks/                  useAuth (who is signed in), useLocalStore (saves to the browser)
    ├── utils/api.ts            The one place that calls the backend (adds your login token)
    ├── types/index.ts          Shared TypeScript types
    └── features.ts             THE PAGE REGISTRY — add one entry here per feature so it
                                shows in the top bar AND the Chibi guide can find it
```

## server/src — the backend (NestJS)

Each feature is its own folder, split the same way (Model / Controller / Service):

```
src/
├── app.module.ts              Registers every feature module — add yours here
├── main.ts                    Server startup (CORS, validation, port 5000)
│
├── auth/                      Sign in / register (DO NOT CHANGE)
│   ├── controllers/             auth.controller.ts — the /auth/... endpoints
│   ├── services/                auth.service.ts — password hashing + JWT
│   ├── dto/                     what a valid request body looks like
│   ├── guards/                  JwtAuthGuard, RolesGuard — who may call what
│   └── models/jwt.strategy.ts    reads the token on every request
│
├── users/                     The User model and its own endpoints
│   ├── models/user.entity.ts     the User table (MySQL, via TypeORM) — the "M" in MVC
│   ├── controllers/              users.controller.ts — the "C"
│   └── services/                 users.service.ts — the "S" (business logic)
│
├── common/                    Small shared pieces (decorators, filters, pipes)
├── config/database.config.ts  MySQL connection settings
└── database/                  seeds/ and migrations/ (empty for now)
```

## ai-service/app — the AI service (FastAPI, Python)

```
app/
├── main.py                    Just GET /health right now
├── routers/                   Teammates add their feature's endpoints here
├── services/                  Teammates add the logic that calls Gemini here
└── schemas/                   Teammates add the request/response shapes here
```

## How to run each part locally (without Docker)

```bash
cd server && npm install && npm run start:dev      # http://localhost:5000
cd client && npm install && npm run dev            # http://localhost:3000
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
```
This needs your own MySQL (XAMPP or otherwise) running, with `server/.env` pointing at it.

## How to run everything with Docker instead

No XAMPP, no `npm install`, no Python needed on your machine — just Docker.

```bash
copy .env.example .env        # (Mac/Linux: cp .env.example .env)
docker compose up --build
```
First edit `.env` and set real values for `DB_PASSWORD`, `DB_ROOT_PASSWORD` and `JWT_SECRET`
(anything you like, just not the placeholder text). Then:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI service: http://localhost:8000

Docker builds four containers from `docker-compose.yml`: MySQL, the server, the client (built and
served by nginx) and the AI service. MySQL's data is kept in a Docker volume, so stopping and
restarting (`docker compose up`, no `--build`) keeps your data; `docker compose down -v` wipes it.
To stop everything: `docker compose down` (in the project root, same folder as `docker-compose.yml`).

Rebuild after changing code: `docker compose up --build` again (only rebuilds what changed).
