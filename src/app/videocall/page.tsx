"use client";

import { useSearchParams } from "next/navigation";
import VideoCallBox from "@/components/VideoCallBox";
import { Suspense } from "react";

const VideoCallPage = () => {
  return (
    <Suspense fallback={<p>Loading video call...</p>}>
      <VideoCallPageContent />
    </Suspense>
  );
};

const VideoCallPageContent = () => {
  const searchParams = useSearchParams();
  const user1 = searchParams.get("user1");
   const user2 = searchParams.get("user2");

  if (!user1 || !user2) return <p>Invalid video call users.</p>;

  // Generate a unique call ID by sorting user names
  const callId = [user1, user2].sort().join("-");

  return (
    <div>
      <h1>Video Call between {user1} and {user2}</h1>
      <VideoCallBox user1={user1}  callId={callId} />
    </div>
  );
};

export default VideoCallPage;
