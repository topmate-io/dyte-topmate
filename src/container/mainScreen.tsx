import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const folderNameMap: any = {
  "simple-dyte-client": "simpleDyteClient",
  "custom-layout": "customLayout",
};

const { REACT_APP_MY_BACKEND: MY_BACKEND } = process.env;

export const MainScreenComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [allMeeetings, setAllMeeting] = useState<any[]>([]);
  const [newMeetingTitle, setNewMeetingTitle] = useState<string>("");
  const [selectedExample, setSelectedExample] =
    useState<string>("simple-dyte-client");

  let navigate = useNavigate();

  const handleCreateRoomClick = useCallback(
    (title: string) => {
      axios({
        url: `${MY_BACKEND}/meeting/create`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          title: title,
        },
      })
        .then((res) => {
          let rooms = [...allMeeetings];
          rooms.push(res.data.data.meeting);
          setAllMeeting([...rooms]);
          setNewMeetingTitle("");
        })
        .catch((err) => console.error(err));
    },
    [allMeeetings]
  );

  const joinRoom = async (
    meetingId: string,
    roomName: string,
    isHost: boolean = false
  ) => {
    const resp = await axios({
      url: `${MY_BACKEND}/participant/create`,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        roleName: isHost ? "host" : "participant",
        meetingId: meetingId,
        clientSpecificId: Math.random().toString(36).substring(7),
      },
    });

    const authResponse = resp.data.data.authResponse;
    const authToken = authResponse.authToken;

    //saving meeting details in session storage
    sessionStorage.setItem("auth", authToken);
    sessionStorage.setItem("meetingID", meetingId);
    sessionStorage.setItem("roomName", roomName);

    // redirecting to the example meeting page
    navigate(`/${selectedExample}/meeting/${roomName}/${meetingId}`);
  };

  useEffect(() => {
    // api call to get list of available/existing meeting rooms
    axios({
      url: `${MY_BACKEND}/meetings`,
      method: "GET",
    })
      .then((response) => {
        setAllMeeting(response.data.data.meetings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-screen-wrapper">
      <img src="/topmate-logo.svg" alt="dyte-logo" />
      <h1>Welcome to the Topmate App.</h1>
      {/* <div className="flex row">
        <input
          type="text"
          value={newMeetingTitle}
          placeholder="New meeting title"
          onChange={(e) => setNewMeetingTitle(e.target.value)}
        />
        <button
          className="margin-left"
          onClick={() => handleCreateRoomClick(newMeetingTitle)}
        >
          Create Room
        </button>
      </div>
      <div className="divider" />
      <h3>Choose Example </h3>
      <select onChange={(e) => setSelectedExample(e.target.value)}>
        <option value="simple-dyte-client">simple-dyte-client</option>
        <option value="custom-layout">custom-layout</option>
      </select>
      <div className="ex-det">
        <div>Check the example component here</div>
        <br />
        <code>/src/exampleComponent/{folderNameMap[selectedExample]}</code>
      </div>
      <div className="divider" />
      <div className="existing-meeting-wrapper flex column ">
        <h3>List of created rooms.</h3>
        <h5>Click to join as new participant or as a host.</h5>
        <div className="existing-meeting-list flex row">
          {!loading &&
            allMeeetings.map((el, k) => {
              return (
                <div key={el.id} className="flex column meeting-list-wrapper">
                  <li key={k}>{el.title}</li>
                  <div className="flex row">
                    <button onClick={() => joinRoom(el.id, el.roomName, true)}>
                      Join as Host{" "}
                    </button>
                    <button
                      className="margin-left"
                      onClick={() => joinRoom(el.id, el.roomName)}
                    >
                      Join as Participant{" "}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {!loading && !allMeeetings.length && (
          <div className="flex no-rooms column">
            <div>No existing rooms 🙁 !</div>
            <div>Create a new room above</div>
          </div>
        )}
        {loading && "Loading..."}
      </div> */}
    </div>
  );
};
