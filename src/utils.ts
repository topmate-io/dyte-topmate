import axios from 'axios';

const { REACT_APP_MY_BACKEND: MY_BACKEND } = process.env;

export const joinExistingRoom = async (meetingId: string, roomName: string) => {
  const resp = await axios({
    url: `${MY_BACKEND}/participant/create`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    data: {
      meetingId: meetingId,
    },
  });

  const authResponse = resp.data.data.authResponse;
  const authToken = authResponse.authToken;

  //saving meeting details in session storage
  sessionStorage.setItem('auth', authToken);
  sessionStorage.setItem('meetingID', meetingId);
  sessionStorage.setItem('roomName', roomName);

  //reloading the page
  window.location.reload();
};
