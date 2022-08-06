import { DyteMeeting, extendConfig } from "@dytesdk/react-ui-kit";
import { useDyteClient } from "@dytesdk/react-web-core";
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

  useEffect(() => {
    const token = query.get("authToken");
    const { id, room } = params;
    const auth: string = sessionStorage.getItem("auth") || token;
    console.log("Params: ", id, room, token);
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

  useEffect(() => {
    if (meeting) {
      const { id } = params;
      meeting.meta.on("disconnected", () => {
        sessionStorage.clear();
        const meetingEndedRL = `/meeting/${id}/ended`;
        navigate(meetingEndedRL);
      });
    }
  }, [meeting, navigate]);

  const config = extendConfig({
    root: {
      "dyte-mixed-grid": {
        states: ["activeSpotlight"],
        children: [["dyte-simple-grid", { style: { flexGrow: "6" } }]],
      },
    },
  });

  if (!meeting) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ height: "100vh", width: "100vw" }}>
        <DyteMeeting
          mode="fill"
          meeting={meeting}
          config={config}
          showSetupScreen
        />
      </div>
    </div>
  );
};
