"use client";

import { useSearchParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import { Suspense } from "react";

const ChatPage = () => {
  return (
    <Suspense fallback={<p>Loading chat...</p>}>
      <ChatPageContent />
    </Suspense>
  );
};

const ChatPageContent = () => {
  const searchParams = useSearchParams();
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) return <p>Invalid chat users.</p>;

  // Ensure both users join the same call by sorting the IDs alphabetically
  const callId = [user1, user2].sort().join("-");

  return (
    <div>
      <h1>Chat between {user1} and {user2}</h1>
      <ChatBox user1={user1} user2={user2} callId={callId} />
    </div>
  );
};

export default ChatPage;
