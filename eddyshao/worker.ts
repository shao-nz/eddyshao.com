import { createRequestHandler } from "@react-router/cloudflare";
import type { ExportedHandler } from "@cloudflare/workers-types";

// @ts-ignore - build output has no types
import * as build from "./build/server";

const handleRequest = createRequestHandler(build as any);

const handler: ExportedHandler = {
  async fetch(request, env, ctx) {
    try {
      const loadContext = {
        cloudflare: {
          env,
          ctx,
          cf: request.cf,
          caches,
        },
      };
      return await handleRequest(request, loadContext);
    } catch (error) {
      console.error(error);
      return new Response("Internal Error", { status: 500 });
    }
  },
};

export default handler;
