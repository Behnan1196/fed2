"use client";

import { useEffect, useState } from "react";
import { StreamVideoClient, StreamCall, CallControls, StreamTheme, SpeakerLayout } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Call } from "@stream-io/video-react-sdk";

// Define props
interface VideoCallBoxProps {
  user1: string;
  callId: string;
}

const VideoCallBox: React.FC<VideoCallBoxProps> = ({ user1, callId }) => {

  const [,setVideoClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

  useEffect(() => {
    if (!API_KEY) return;
    
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

    const initClient = async () => {
      const token = await fetchToken(user1);
      if (!token) return;

      await videoClient.connectUser({ id: user1, name: user1 }, token);

      // Join or create a call
      const newCall = videoClient.call("default", callId);
      await newCall.join({ create: true });

      setVideoClient(videoClient);
      setCall(newCall);
    };

    initClient();

    return () => {
      videoClient.disconnectUser();
    };
  }, [API_KEY, user1, callId]);

  if (!call) return <p>Loading video call...</p>;

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls />
      </StreamTheme>
    </StreamCall>
  );
};

export default VideoCallBox;
