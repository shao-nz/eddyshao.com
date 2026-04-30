import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server.edge";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  await stream.allReady;

  responseHeaders.set("Content-Type", "text/html");
  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
