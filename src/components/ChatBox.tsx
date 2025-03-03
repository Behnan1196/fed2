"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, Window, MessageList, MessageInput } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { StreamVideoClient, StreamCall, CallControls, StreamTheme, SpeakerLayout } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Channel as StreamChannel } from "stream-chat";
import { Call } from "@stream-io/video-react-sdk";

interface ChatBoxProps {
  user1: string;
  user2: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user1, user2 }) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

  useEffect(() => {
    if (!API_KEY) return;
    const chatClient = new StreamChat(API_KEY);
    const videoClient = new StreamVideoClient({ apiKey: API_KEY });

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

    const initClients = async () => {
      const token = await fetchToken(user1);
      if (!token) return;

      await chatClient.connectUser({ id: user1, name: user1 }, token);
      await videoClient.connectUser({ id: user1, name: user1 }, token);

      // Create or join chat
      const conversation = chatClient.channel("messaging", {
        members: [user1, user2],
      });

      await conversation.watch();
      setChannel(conversation);

      setClient(chatClient);
      setVideoClient(videoClient);
    };

    initClients();

    return () => {
      chatClient.disconnectUser();
      videoClient.disconnectUser();
    };
  }, [API_KEY, user1, user2]);  // ✅ Include API_KEY

  const startCall = async () => {
    if (!videoClient) return;

    const callId = `${user1}-${user2}-call`;
    const newCall = videoClient.call("default", callId);
    await newCall.join({ create: true });

    setCall(newCall);
  };

  if (!client || !channel) return <p>Loading Chat...</p>;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>

      {/* Start Video Call Button */}
      <button 
        onClick={startCall} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start Video Call
      </button>

      {/* Video Call Section */}
      {call && (
        <StreamCall call={call}>
          <StreamTheme>
            <SpeakerLayout participantsBarPosition="bottom" />
            <CallControls />
          </StreamTheme>
        </StreamCall>
      )}
    </Chat>
  );
};

export default ChatBox;
