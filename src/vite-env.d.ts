/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for installer downloads, e.g. https://github.com/<owner>/<repo>/releases/latest/download/ */
  readonly VITE_DOWNLOAD_BASE?: string;
}
