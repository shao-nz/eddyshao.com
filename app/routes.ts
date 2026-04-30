import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("connectFour/:lobbyId?", "routes/connectFour.tsx"),
  route("api/pusher/auth", "routes/api.pusher.auth.ts"),
  route("api/pusher", "routes/api.pusher.ts"),
] satisfies RouteConfig;
