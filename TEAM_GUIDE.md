# Team guide: adding your feature to ShikkhaBridge

`main` holds the **base app**: sign in / register, the Kantha-paper design, page transitions,
the profile with the customizable Bengali character, and the Chibi study guide (Ctrl+M).
All other features are added by each team member on their own branch.

## 1. Git workflow

```bash
git clone <repo-url>
cd shikkha-bridge
git checkout main && git pull
git checkout -b feature/<your-feature>      # e.g. feature/absence-gap-engine

# ...work, then commit small and often...
git add .
git commit -m "feat(absence): add absence form"
git push -u origin feature/<your-feature>
```

Then open a **Pull Request** on GitHub from your branch into `main`. A teammate reviews it, you
merge it, and everybody runs `git checkout main && git pull` before starting the next piece.
Never commit directly to `main`, never commit `.env` or `node_modules`.

Keep your branch up to date so merging stays easy:

```bash
git checkout main && git pull
git checkout feature/<your-feature>
git merge main
```

## 2. Where your feature goes

| What | Where | Notes |
| --- | --- | --- |
| Page (View) | `client/src/modules/<feature>/pages/` | Use `PageHeader` from `shared/components/layout/PageHeader` |
| API calls | `client/src/modules/<feature>/services/` | Use `shared/utils/api.ts` (token is added for you) |
| Route | `client/src/App.tsx` | One `<Route>` inside the `<Layout>` block |
| Top-bar link + guide | `client/src/shared/features.ts` | One entry: the nav link AND the Chibi guide learn about your page |
| Model + Controller + Service | `server/src/<feature>/{models,controllers,services}/` | Plus a `<feature>.module.ts` |
| Register backend module | `server/src/app.module.ts` | Add it to `imports` |
| AI endpoint (if you need one) | `ai-service/app/routers/` | Include it in `ai-service/app/main.py` |

To have the guide say "Start with this lesson" or "Take this quiz next", fill `nextLesson`,
`nextQuiz` and `items` in `client/src/shared/study-guide/useStudyState.ts` from your data.

See `PROJECT_STRUCTURE.md` at the repo root for what every folder holds.

## 3. Rules that avoid merge conflicts

- Stay inside your own `modules/<feature>/` and `server/src/<feature>/` folders.
- The only shared files you touch are `App.tsx`, `features.ts`, `app.module.ts`, `main.py`
  and (for DB relations) `users/models/user.entity.ts`. Change only your own lines there.
- Use the design: paper cards (`className="paper rounded-xl p-5"`), Bangla kicker + title via `PageHeader`,
  colours `#C84B31` (terracotta), `#2D1B0E` (ink), `#6B5344` (muted). Keep pages simple.

## 4. Run it

```bash
cd server && npm install && npm run start:dev      # http://localhost:5000
cd client && npm install && npm run dev            # http://localhost:3000
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
```
