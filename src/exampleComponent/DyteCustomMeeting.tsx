import React, { useEffect, useState } from "react";
import {
  useRealtimeSelector,
  useRealtimeMeeting,
  RtkCameraToggle,
  RtkLeaveButton,
  RtkLogo,
  RtkMicToggle,
  RtkParticipantsAudio,
  RtkDialogManager,
  RtkSetupScreen,
  RtkChat,
  RtkGrid,
  RtkChatToggle,
  provideRtkDesignSystem,
} from "src/realtime";

const Meeting = () => {
  const { meeting } = useRealtimeMeeting();
  const roomJoined = useRealtimeSelector((m) => m.self.roomJoined);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    provideRtkDesignSystem(document.body, {
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
        <RtkSetupScreen meeting={meeting} />
        {/* <DyteSetupScreen meeting={meeting} states={{ meeting: "setup" }} /> */}
        <RtkDialogManager meeting={meeting} />
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
          <RtkLogo
            config={{
              designTokens: { logo: "https://topmate.io/topmatelogo.svg" },
            }}
          />
        </div>
        Your App
      </div>
      <div style={{ flexGrow: 1 }}>
        {!showChat && <RtkGrid gap={8} meeting={meeting} size="sm" />}
        {showChat && <RtkChat meeting={meeting} />}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <RtkCameraToggle meeting={meeting} />
        <RtkMicToggle meeting={meeting} />
        <RtkChatToggle
          meeting={meeting}
          onRtkStateUpdate={(evt: any) => {
            const detail = (evt && (evt as any).detail) || {};
            setShowChat(!!(detail as any).activeSidebar);
          }}
        />
        <RtkLeaveButton />
      </div>
      <RtkParticipantsAudio meeting={meeting} />
      <RtkDialogManager meeting={meeting} />
    </div>
  );
};

export default Meeting;
