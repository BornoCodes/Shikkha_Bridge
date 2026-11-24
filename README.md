# 🎓 ShikkhaBridge — Learning Recovery System

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> **Current status:** `main` contains the base app only (sign in / register, the design and page
> transitions, profile with a customizable Bengali character, and the Chibi study guide). Everything else
> described below is built by team members on feature branches. See [TEAM_GUIDE.md](TEAM_GUIDE.md).

**ShikkhaBridge** (শিক্ষাব্রিজ) is a comprehensive learning recovery platform designed for students who miss school due to illness, family emergencies, or other circumstances. The platform bridges the gap between absence and academic continuity by providing personalized catch-up plans, AI-powered lesson summaries, peer collaboration tools, and progress tracking.

## ✨ Design Philosophy

The UI draws inspiration from **Bengali art and cultural motifs**:

- **Nakshi Kantha-inspired borders** — decorative patterns reminiscent of traditional Bengali quilting stitchwork
- **Deep Terracotta & Golden Turmeric** — a warm, earthy color palette rooted in Bengali folk art
- **Lotus Pink accents** — subtle nods to the national flower of Bangladesh
- **Warm Cream & Soft Parchment surfaces** — evoking the feel of handmade paper and aged manuscripts
- **River Blue highlights** — inspired by the rivers that define Bengal's landscape
- **Hind Siliguri typography** — for an authentic Bengali textual feel alongside modern display fonts

## 🏗️ Architecture

```
shikkha-bridge/
├── client/          # React 18 + TypeScript + Vite (Port 3000)
├── server/          # NestJS + TypeORM + MySQL (Port 5000)
├── ai-service/      # FastAPI + Gemini AI (Port 8000)
├── docker-compose.yml
├── .env.example
└── README.md
```

| Service        | Tech Stack                     | Port  | Description                          |
| -------------- | ------------------------------ | ----- | ------------------------------------ |
| **Client**     | React 18, Vite, TailwindCSS    | 3000  | Student & teacher-facing SPA         |
| **Server**     | NestJS, TypeORM, MySQL         | 5000  | REST API, auth, business logic       |
| **AI Service** | FastAPI, Google Gemini API      | 8000  | AI-powered lesson summaries & plans  |
| **Database**   | MySQL 8                        | 3306  | Persistent data store                |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **Python** >= 3.11
- **MySQL** >= 8.0
- **Docker** & **Docker Compose** (optional, for containerized setup)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/shikkha-bridge.git
cd shikkha-bridge

# 2. Create environment file
cp .env.example .env
# Edit .env with your configuration

# 3. Start all services
docker-compose up --build

# 4. Access the application
# Client:     http://localhost:3000
# Server API: http://localhost:5000
# AI Service: http://localhost:8000
```

### Option 2: Manual Setup

#### Database

```bash
# Start MySQL and create the database
mysql -u root -p -e "CREATE DATABASE shikkha_bridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### Server (NestJS)

```bash
cd server

# Install dependencies
npm install

# Copy and configure environment variables
cp ../.env.example ../.env

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The server will be available at `http://localhost:5000`.

#### Client (React)

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The client will be available at `http://localhost:3000`.

#### AI Service (FastAPI)

```bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The AI service will be available at `http://localhost:8000`.

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in the required values. See the `.env.example` file for a complete list of configuration options.

## 📜 Available Scripts

### Client

| Script         | Command           | Description                  |
| -------------- | ----------------- | ---------------------------- |
| `dev`          | `npm run dev`     | Start Vite dev server        |
| `build`        | `npm run build`   | Production build             |
| `lint`         | `npm run lint`    | Run ESLint                   |
| `test`         | `npm run test`    | Run Vitest                   |

### Server

| Script                | Command                        | Description                    |
| --------------------- | ------------------------------ | ------------------------------ |
| `start:dev`           | `npm run start:dev`            | Start NestJS in watch mode     |
| `build`               | `npm run build`                | Compile TypeScript             |
| `start:prod`          | `npm run start:prod`           | Start production build         |
| `migration:generate`  | `npm run migration:generate`   | Generate a new migration       |
| `migration:run`       | `npm run migration:run`        | Run pending migrations         |

### AI Service

| Script     | Command                                                  | Description             |
| ---------- | -------------------------------------------------------- | ----------------------- |
| `dev`      | `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`  | Start FastAPI dev server|

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

1. **Fork** the repository and create a feature branch from `main`.
2. **Branch naming**: Use `feature/description`, `fix/description`, or `chore/description`.
3. **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/) — e.g., `feat(client): add dashboard progress chart`.
4. **Code style**:
   - TypeScript: Follow the existing ESLint + Prettier configuration.
   - Python: Follow PEP 8 and use type hints throughout.
5. **Testing**: Add tests for new features. Ensure all existing tests pass before submitting a PR.
6. **Pull requests**: Provide a clear description, link related issues, and request review from at least one maintainer.

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat(scope): description of changes"

# Push and create a pull request
git push origin feature/my-feature
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>শিক্ষাব্রিজ</strong> — Bridging the gap between absence and learning 🌉
</p>
