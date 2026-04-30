import { createRequestHandler } from "react-router";
import type { ExecutionContext } from "@cloudflare/workers-types";

export interface Env {
  GA_MEASUREMENT_ID: string;
  EMAILJS_SERVICE_ID: string;
  EMAILJS_TEMPLATE_ID: string;
  EMAILJS_PUBLIC_KEY: string;
  PUSHER_KEY: string;
  PUSHER_CLUSTER: string;
  PUSHER_APP_ID: string;
  PUSHER_SECRET: string;
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
};
