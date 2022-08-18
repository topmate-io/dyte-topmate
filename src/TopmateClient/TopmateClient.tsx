/* eslint-disable react-hooks/exhaustive-deps */
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteClient } from "@dytesdk/react-web-core";
import DyteVideoBackgroundTransformer from "@dytesdk/video-background-transformer";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const TopmateClient: React.FC<{}> = () => {
  const navigate = useNavigate();
  console.log("Navigate: ", navigate);
  const params: any = useParams<{
    id: string;
    room: string;
    token: string;
  }>();
  let query: any = useQuery();
  const [meeting, initMeeting] = useDyteClient();

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
    const token = query.get("authToken");
    const { id, room } = params;
    const auth: string = sessionStorage.getItem("auth") || token;
    sessionStorage.setItem("auth", token);
    sessionStorage.setItem("meetingID", id);
    sessionStorage.setItem("roomName", room);
    if (token && room && id) {
      initMeeting({
        authToken: auth,
        roomName: room,
        defaults: {
          video: false,
          audio: false,
        },
      });
    }
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
    sessionStorage.clear();
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
        <DyteMeeting
          mode="fill"
          meeting={meeting}
          // config={config}
          showSetupScreen
        />
      </div>
    </div>
  );
};
