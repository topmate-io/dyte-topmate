import axios from "axios";

const { REACT_APP_MY_BACKEND: MY_BACKEND } = process.env;

export const joinExistingRoom = async (
  meetingId: string,
  roomName: string,
  participantType: string = "follower"
) => {
  const authToken = await createParticipantAndGetToken(
    meetingId,
    participantType
  );

  //saving meeting details in session storage
  sessionStorage.setItem("auth", authToken);
  sessionStorage.setItem("meetingID", meetingId);
  sessionStorage.setItem("roomName", roomName);

  //reloading the page
  window.location.reload();
};

/**
 * Create a participant via backend and return the realtime auth token.
 * POST to: ${MY_BACKEND}/realtimekit-add-participant/{meetingId}/
 * Body: { booking_id, participant_type }
 */
export const createParticipantAndGetToken = async (
  meetingId: string,
  participantType: string
): Promise<string> => {
  const resp = await axios({
    url: `${MY_BACKEND}/realtimekit-add-participant/${meetingId}/`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      participant_type: participantType,
    },
  });

  // Support responses where token is at top-level or nested
  const token: string | undefined =
    resp?.data?.token ??
    resp?.data?.data?.token ??
    resp?.data?.authResponse?.authToken;

  if (!token) {
    throw new Error(
      "Auth token not found in createRealtimeParticipant response"
    );
  }

  return token;
};
