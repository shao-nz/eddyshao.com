import type { ActionFunctionArgs } from "react-router";
import Pusher from "pusher";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const pusher = new Pusher({
    appId: context.cloudflare.env.PUSHER_APP_ID,
    key: context.cloudflare.env.PUSHER_KEY,
    secret: context.cloudflare.env.PUSHER_SECRET,
    cluster: context.cloudflare.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  const { gameBoard, yellow } = (await request.json()) as { gameBoard: unknown; yellow: boolean };
  await pusher.trigger("connect4", "connect4-event", {
    gameBoard,
    yellow,
  });

  return Response.json({ message: "Move made" });
};
