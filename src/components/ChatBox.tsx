"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, Window, MessageList, MessageInput } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { Channel as StreamChannel } from "stream-chat";

interface ChatBoxProps {
  user1: string;
  user2: string;
  callId: string; // Ensure this is here
}

const ChatBox: React.FC<ChatBoxProps> = ({ user1, user2 }) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

  useEffect(() => {
    if (!API_KEY) return;
    const chatClient = new StreamChat(API_KEY);

    const fetchToken = async (userId: string) => {
      try {
        const res = await fetch(`/api/token?user_id=${userId}`);
        const data = await res.json();
        return data.token;
      } catch (error) {
        console.error("Failed to fetch token", error);
        return null;
      }
    };

    const initClient = async () => {
      const token = await fetchToken(user1);
      if (!token) return;

      await chatClient.connectUser({ id: user1, name: user1 }, token);

      const conversation = chatClient.channel("messaging", {
        members: [user1, user2],
      });

      await conversation.watch();
      setChannel(conversation);

      setClient(chatClient);
    };

    initClient();

    return () => {
      chatClient.disconnectUser();
    };
  }, [API_KEY, user1, user2]);

  if (!client || !channel) return <p>Loading Chat...</p>;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatBox;
