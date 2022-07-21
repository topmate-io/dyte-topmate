import React, { useEffect, useState } from 'react';
import { useDyteSelector, useDyteMeeting } from '@dytesdk/react-web-core';
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
} from '@dytesdk/react-ui-kit';

const LOGO = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8ZGVmcz4KICA8Y2xpcFBhdGggaWQ9ImEiPgogICA8cGF0aCBkPSJtMTM5LjIxIDEzOS4yMWg0NzMuNTh2NDczLjU4aC00NzMuNTh6Ii8+CiAgPC9jbGlwUGF0aD4KIDwvZGVmcz4KIDxnIGNsaXAtcGF0aD0idXJsKCNhKSI+CiAgPHBhdGggZD0ibTYxMi43OSAzNzZjMCAxMzAuNDYtMTA2LjMzIDIzNi43OS0yMzYuNzkgMjM2Ljc5LTEzMS4yMSAwLTIzNi43OS0xMDYuMzMtMjM2Ljc5LTIzNi43OSAwLTEzMS4yMSAxMDUuNTctMjM2Ljc5IDIzNi43OS0yMzYuNzkgMTMwLjQ2IDAgMjM2Ljc5IDEwNS41NyAyMzYuNzkgMjM2Ljc5em0tMTUyLjMzIDI0LjEzM2MtMjEuODcxLTIzLjM3OS00MS40NzcgMy43Njk1LTU1LjA1MSAxNy4zNDQtMjguNjU2LTE1LjA4Mi01OC4wNjYtNDEuNDc3LTcxLjY0MS03MC44ODcgNDEuNDc3LTM3LjcwNyAzMy4xOC00Mi45ODQtMTIuODItODcuNDc3LTIzLjM3OS0yMS44NzEtNDIuMjMgNC41MjM0LTU3LjMxMiAxOS42MDUtNi43ODUyIDYuNzg1Mi0xMC41NTkgMTUuODM2LTEyLjA2NiAyNi4zOTUtNi43ODUyIDY3LjExNyAxMDEuMDUgMTkwLjc5IDE4Ny4wMiAxOTUuMzEgMjUuNjQxIDEuNTA3OCAzNS40NDEtMTIuODIgNTIuNzg5LTMwLjkxOCAyNC44ODctMjUuNjQxLTEyLjgyLTUxLjI4MS0zMC45MTgtNjkuMzc5em0xMTYuMTMtMjQuMTMzYzAtMTEwLjg2LTg5LjczOC0yMDAuNTktMjAwLjU5LTIwMC41OXMtMjAwLjU5IDg5LjczOC0yMDAuNTkgMjAwLjU5IDg5LjczOCAyMDAuNTkgMjAwLjU5IDIwMC41OSAyMDAuNTktODkuNzM4IDIwMC41OS0yMDAuNTl6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KIDwvZz4KPC9zdmc+Cg=='; 

const Meeting = () => {
  const { meeting } = useDyteMeeting();
  const roomJoined = useDyteSelector((m) => m.self.roomJoined);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      // sets light background colors
      theme: 'light',
      colors: {
        danger: '#ffac00',
        brand: {
          300: '#00FFE1',
          400: '#00FFFF',
          500: '#00E1D4',
          600: '#007B74',
          700: '#00655F',
        },
        text: '#071428',
        'text-on-brand': '#ffffff',
        'video-bg': '#E5E7EB',
      },
      borderRadius: 'extra-rounded',
    });
  }, []);
  if (!meeting) {
    return null;
  }

  if (!roomJoined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <DyteSetupScreen meeting={meeting} states={{meeting: 'setup'}}/>
        <DyteDialogManager meeting={meeting} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '400px', height: '100vh', background: 'white', color: 'black', margin: '0 auto' }}>
      <div style={{ height: '50px', width: '100%', padding: '10px', display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignContent: 'center', alignItems: 'center' }}>
        <div style={{ height: '50px', maxWidth: '50px' }}>
          <DyteLogo config={{ designTokens: { logo: LOGO } }} />
        </div>
        Your App
      </div>
      <div style={{ flexGrow: 1 }}>
        {!showChat && <DyteGrid gap={8} meeting={meeting} size="sm" />}
        {showChat && <DyteChat meeting={meeting} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
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
