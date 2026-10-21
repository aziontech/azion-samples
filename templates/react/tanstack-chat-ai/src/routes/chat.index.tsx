import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "~/components/Chat";
export const Route = createFileRoute("/chat/")({
  component: Chat,
});
