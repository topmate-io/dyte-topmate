import React, { useEffect, useState } from "react";
import { useDyteSelector, useDyteMeeting } from "@dytesdk/react-web-core";
import {
  DyteCameraToggle,
  DyteLeaveButton,
  DyteLogo,
  DyteMicToggle,
  DyteParticipantsAudio,
  DyteDialogManager,
  DyteSetupScreen,
  DyteChat,
  DyteGrid,
  DyteChatToggle,
  provideDyteDesignSystem,
} from "@dytesdk/react-ui-kit";

const Meeting = () => {
  const { meeting } = useDyteMeeting();
  const roomJoined = useDyteSelector((m) => m.self.roomJoined);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      // sets light background colors
      theme: "dark",
      colors: {
        danger: "#ffac00",
        brand: {
          300: "#00FFE1",
          400: "#00FFFF",
          500: "#00E1D4",
          600: "#007B74",
          700: "#00655F",
        },
        text: "#071428",
        "text-on-brand": "#ffffff",
        "video-bg": "#E5E7EB",
      },
      borderRadius: "extra-rounded",
    });
  }, []);
  if (!meeting) {
    return null;
  }

  if (!roomJoined) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <DyteSetupScreen meeting={meeting} />
        {/* <DyteSetupScreen meeting={meeting} states={{ meeting: "setup" }} /> */}
        <DyteDialogManager meeting={meeting} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "400px",
        height: "100vh",
        background: "white",
        color: "black",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          height: "50px",
          width: "100%",
          padding: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ height: "50px", maxWidth: "50px" }}>
          <DyteLogo
            config={{
              designTokens: { logo: "https://topmate.io/topmatelogo.svg" },
            }}
          />
        </div>
        Your App
      </div>
      <div style={{ flexGrow: 1 }}>
        {!showChat && <DyteGrid gap={8} meeting={meeting} size="sm" />}
        {showChat && <DyteChat meeting={meeting} />}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <DyteCameraToggle meeting={meeting} />
        <DyteMicToggle meeting={meeting} />
        <DyteChatToggle
          meeting={meeting}
          onDyteStateUpdate={({ detail }) => {
            setShowChat(!!detail.activeSidebar);
          }}
        />
        <DyteLeaveButton />
      </div>
      <DyteParticipantsAudio meeting={meeting} />
      <DyteDialogManager meeting={meeting} />
    </div>
  );
};

export default Meeting;
