import React from "react";

export const MainScreenComponent = () => {

  return (
    <div className="main-screen-wrapper">
      <img src="/topmate-logo.svg" alt="topmate-logo" />
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
            <option value="simple">simple</option>
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
