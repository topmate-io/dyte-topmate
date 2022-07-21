import React, { useEffect } from "react";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import { useNavigate, useParams } from "react-router-dom";
import { joinExistingRoom } from "../utils";
import DyteCustomMeeting from "./DyteCustomMeeting";

export const CustomLayout: React.FC<{}> = () => {
  let navigate = useNavigate();
  let params = useParams<{ id :  string; room : string}>();
  let auth = sessionStorage.getItem("auth");
  let roomName = sessionStorage.getItem("roomName");
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    if (auth && roomName && params.id) {
      initMeeting({
        authToken: auth,
        roomName
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
        <DyteCustomMeeting />
      </div>
    </DyteProvider>
  );
};
