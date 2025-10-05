/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
  
  var env: CloudflareEnv;
}

export {};