import type { ActionFunctionArgs } from "react-router";
import Pusher from "pusher";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const env = (context as any)?.cloudflare?.env as Record<string, string>;

  const pusher = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
  });

  const { gameBoard, yellow } = await request.json();
  await pusher.trigger("connect4", "connect4-event", {
    gameBoard,
    yellow,
  });

  return Response.json({ message: "Move made" });
};
