# ShikkhaBridge UI/UX update

Copy these over your project (same folder layout): everything in `client/`.
Then run `npm run dev` in client/ and server/ as before.

New: Kantha-paper theme (src/shared/styles/theme.css), top-bar shell, curtain page transitions,
Today page, My Path page (/student/path), Profile (/profile) with customizable Bengali character,
and the Chibi guide (walks along the bottom; click it or press Ctrl+M / Alt+M; Esc to close).

Also fixed: vite proxy rewrite for /api, token key mismatch, auth guard redirect to /login.
Not run in a browser here (no network): please run it and tell me anything that looks off.
Commit or stash your uncommitted develop changes first.
