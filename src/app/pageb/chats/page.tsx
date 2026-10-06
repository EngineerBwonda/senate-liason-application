import { redirect } from "next/navigation";

export default async function LegacyChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { conversation } = await searchParams;
  const conversationId = Array.isArray(conversation)
    ? conversation[0]
    : conversation;

  redirect(
    conversationId
      ? `/chats?conversation=${encodeURIComponent(conversationId)}`
      : "/chats",
  );
}
