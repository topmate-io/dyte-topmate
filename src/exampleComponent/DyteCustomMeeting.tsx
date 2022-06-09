import React, { useCallback, useEffect, useState } from 'react';
import { useDyteSelector, useDyteMeeting } from '@dytesdk/react-web-core';
import { States } from "@dytesdk/ui-kit";
import {
  DyteCameraToggle,
  DyteGrid,
  DyteLeaveButton,
  DyteLogo,
  DyteMicToggle,
  DyteParticipantsAudio,
  DyteNotifications,
  DyteDialogManager,
  DyteSettingsToggle,
} from '@dytesdk/react-ui-kit';

function isCustomEvent(event: Event): event is CustomEvent {
  return 'detail' in event;
}

const DyteCustomMeeting = () => {
  const { meeting } = useDyteMeeting();

  const roomJoined = useDyteSelector((m) => m.self.roomJoined);

  const [meetingState, setMeetingState] = useState<States>({
    meeting: roomJoined ? 'joined' : 'idle',
    activeLeaveConfirmation: false,
    prefs: {
      muteNotificationSounds: true
    }
  });

  const stateChanges = useCallback((e: Event) => {
    if (!isCustomEvent(e)) return;
    setMeetingState({ ...meetingState, ...e.detail });
  }, [meetingState]);

  useEffect(() => {
    if (!roomJoined) {
      meeting?.joinRoom();
    }
  }, [meeting, roomJoined]);

  /*
   * Watch for dyte meeting state changes
   */
  useEffect(() => {
    document.addEventListener("dyteStateUpdate", stateChanges);
    return () => {
      document.removeEventListener("dyteStateUpdate", stateChanges);
    }
  }, [stateChanges]);

  if (!roomJoined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'black', color: 'white'}}>
        Joining...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'black', color: 'white'}}>
      <div style={{ height: '50px', width: '100%', padding: '10px' }}>
        <div style={{ maxWidth: '100px' }}>
          <DyteLogo config={{ designTokens: { logo: "http://localhost:3000/logo.svg" }}} />
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <DyteGrid gap={8} meeting={meeting}/>
      </div>
      <DyteNotifications meeting={meeting} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <DyteCameraToggle meeting={meeting} />
        <DyteMicToggle meeting={meeting} />
        <DyteSettingsToggle meeting={meeting} states={meetingState} />
        <DyteLeaveButton />
      </div>
      <DyteParticipantsAudio meeting={meeting} />
      <DyteDialogManager meeting={meeting} states={meetingState} />
    </div>
  );
};

export default DyteCustomMeeting;
