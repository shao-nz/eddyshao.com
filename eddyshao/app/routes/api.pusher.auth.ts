import type { ActionFunctionArgs } from "react-router";
import Pusher from "pusher";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const env = (context as any)?.cloudflare?.env as Record<string, string>;

  const pusher = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
  });

  let socket_id: string;
  let channel_name: string;

  const contentType = request.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = await request.json();
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
