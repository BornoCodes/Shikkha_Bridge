/// <reference types="vite/client" />

// Backstop in case the triple-slash reference above doesn't resolve in some
// environments: this guarantees `import.meta.env.VITE_*` always type-checks.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AI_SERVICE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
