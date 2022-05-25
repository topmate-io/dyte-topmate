/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import DyteClient from '@dytesdk/web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import JoinMeeting from './components/joinMeeting';
import axios from 'axios';
// import { config } from './config';


function App() {
  const [meeting, setMeeting] = useState<DyteClient>();
  const [name, setName] = useState<string>('');

  const API_BASE = process.env.REACT_APP_API_BASE
  const ORG_ID = process.env.REACT_APP_ORG_ID
  const MEETING_ID = process.env.REACT_APP_MEETING_ID
  const API_KEY = String(process.env.REACT_APP_API_KEY)

  const joinMeetingHandler = (val: string) => {
    setName(val);
  }
  

  useEffect(() => {
    const init = async () => {
      if (meeting || !name) return;
    
      try {
        const participant = await axios.post(`${API_BASE}/v1/organizations/${ORG_ID}/meetings/${MEETING_ID}/participant`, {
          clientSpecificId: `${name}-${new Date().getTime()}`,
          userDetails: {
            name
          }
        }, {
          headers: {
            'Authorization': API_KEY
          }
        })
        const authToken = participant.data.data?.authResponse?.authToken;
        const meeting = await DyteClient.init({
          authToken,
          roomName: 'nbrnwl-xeymgj',
          defaults: {
            audio: false,
            video: false,
          },
        });
        setMeeting(meeting);
      } catch(e) {
        console.log(e);
      }
    };
  
    init();
  }, [name]);

  if (name) return (
    <div className='meeting'>
      <DyteMeeting
        meeting={meeting}
        style={{ width: '100vw', height: '100vh' }}
        showSetupScreen={true}
      />
    </div>
  );
  return <JoinMeeting onJoin={joinMeetingHandler} />
}

export default App;
