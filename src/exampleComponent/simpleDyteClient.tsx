import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { joinExistingRoom } from "../utils";

export const SimpleDyteClient: React.FC<{}> = () => {
  const navigate = useNavigate();
  const params = useParams<{ id :  string; room : string}>();
  const auth = sessionStorage.getItem("auth");
  const roomName = sessionStorage.getItem("roomName");
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {

    if (auth && roomName && params.id) {
      initMeeting({
        authToken: auth,
        roomName,
      });
    }

    if (!auth && !roomName && params.id && params.room) {
      //creating a new participant
      joinExistingRoom(params.id, params.room)
    }
  }, []);

  useEffect(() => {
    if (meeting) {
      meeting.meta.on('disconnected', () => {
        sessionStorage.clear();
        navigate("/");
      });
    }
  }, [meeting, navigate]);

  return (
    <DyteProvider value={meeting}>
      <div style={{height:'100vh', width: '100vw'}}>
        <DyteMeeting mode="fill" showSetupScreen={false} meeting={meeting} />      
      </div>
    </DyteProvider>
  );
};
