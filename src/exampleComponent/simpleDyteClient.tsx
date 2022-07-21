import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDyteClient } from "@dytesdk/react-web-core";
import { DyteControlbar, DyteControlbarButton, DyteMeeting, extendConfig } from "@dytesdk/react-ui-kit";
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
        defaults: {
          video: false,
          audio: false,
        }
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

  const config = extendConfig({
    root: {
      'dyte-mixed-grid': {
        states: ['activeSpotlight'],
        children: [['dyte-simple-grid', { style: { flexGrow: '6' } }]],
      },
    },
  });


  if (!meeting) {
    return null;
  }
  
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div style={{height:'100vh', width: '20vw', paddingTop: '15px'}}>

      </div>
      <div style={{height:'100vh', width: '80vw'}}>
        <DyteMeeting mode="fill" meeting={meeting} config={config} />
      </div>
    </div>
  );
};
