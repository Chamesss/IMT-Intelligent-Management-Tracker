/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEY_API_URL: string
  readonly VITE_KEY_API_URL_PING: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
