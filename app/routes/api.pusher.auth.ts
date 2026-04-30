import type { ActionFunctionArgs } from "react-router";
import Pusher from "pusher";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const pusher = new Pusher({
    appId: context.cloudflare.env.PUSHER_APP_ID,
    key: context.cloudflare.env.PUSHER_KEY,
    secret: context.cloudflare.env.PUSHER_SECRET,
    cluster: context.cloudflare.env.PUSHER_CLUSTER,
  });

  let socket_id: string;
  let channel_name: string;

  const contentType = request.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = (await request.json()) as { socket_id: string; channel_name: string };
    socket_id = json.socket_id;
    channel_name = json.channel_name;
  } else {
    const formData = await request.formData();
    socket_id = formData.get("socket_id") as string;
    channel_name = formData.get("channel_name") as string;
  }

  const auth = pusher.authorizeChannel(socket_id, channel_name);
  return Response.json(auth);
};
