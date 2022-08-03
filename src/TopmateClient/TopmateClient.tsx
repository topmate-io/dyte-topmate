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
  const params: any = useParams<{
    id: string;
    room: string;
    authToken: string;
  }>();
  let query: any = useQuery();
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const authToken = query.get("authToken");
    const { id, room } = params;
    const auth = sessionStorage.getItem("auth");
    const roomName = sessionStorage.getItem("roomName");
    console.log("Params: ", id, room, authToken);
    sessionStorage.setItem("auth", authToken);
    sessionStorage.setItem("meetingID", id);
    sessionStorage.setItem("roomName", room);
    if (auth && roomName && params?.id) {
      initMeeting({
        authToken: auth,
        roomName,
        defaults: {
          video: false,
          audio: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (meeting) {
      meeting.meta.on("disconnected", () => {
        sessionStorage.clear();
        navigate("/");
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
