/* eslint-disable react-hooks/exhaustive-deps */
import { RtkMeeting } from "src/realtime";
import { useRealtimeClient } from "src/realtime";
import { createParticipantAndGetToken } from "src/utils";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const TopmateClient: React.FC<{}> = () => {
  const navigate = useNavigate();
  const params: any = useParams<{
    id: string;
    room: string;
    token: string;
  }>();
  let query: any = useQuery();
  const [meeting, initMeeting] = useRealtimeClient();

  // Retro Theme Plugin
  const RetroTheme = (): any => {
    return (canvas: any, ctx: any) => {
      ctx.filter = "grayscale(1)";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 20;
      ctx.lineWidth = 50;
      ctx.strokeStyle = "#000";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    const run = async () => {
      const urlToken = query.get("authToken") as string | null;
      const participantTypeParam = query.get("type") as string | null; // expert | follower
      const type = participantTypeParam === "expert" ? "expert" : "follower";
      const { id, room } = params;
      const sessionToken = sessionStorage.getItem("auth");

      // Persist meeting metadata if present
      if (id) sessionStorage.setItem("meetingID", id);
      if (room) sessionStorage.setItem("roomName", room);

      // Ensure we have a token: prefer session -> URL -> backend fetch
      let finalToken = sessionToken || urlToken || null;
      if (!finalToken && id) {
        finalToken = await createParticipantAndGetToken(id, type);
        sessionStorage.setItem("auth", finalToken);
      }

      if (finalToken && id) {
        initMeeting({
          authToken: finalToken,
          ...(room ? { roomName: room } : {}),
          defaults: {
            video: false,
            audio: false,
          },
        });
      }
    };
    run();
  }, []);

  const updateMeetingEvents = async () => {
    const { id } = params;
    // const videoBackgroundTransformer =
    //   await DyteVideoBackgroundTransformer.init();
    // meeting.self.addVideoMiddleware(RetroTheme);
    // meeting?.self?.addVideoMiddleware(
    //   await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware()
    // );
    meeting?.meta.on("disconnected", () => {
      sessionStorage.clear();
      const meetingEndedRL = `/meeting/${id}/ended`;
      navigate(meetingEndedRL);
    });
  };

  useEffect(() => {
    if (meeting) {
      updateMeetingEvents();
    }
  }, [meeting, navigate]);

  useEffect(() => {
    return () => {
      sessionStorage.clear();
    };
  }, []);

  // const config = extendConfig({
  //   designTokens: {
  //     logo: "https://topmate.io/topmatelogo.svg",
  //   },
  // });

  if (!meeting) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ height: "100vh", width: "100vw" }}>
        <RtkMeeting
          mode="fill"
          meeting={meeting}
          // config={config}
          showSetupScreen
        />
      </div>
    </div>
  );
};
