import React from "react";
import "./Client.css";
import { RtkEndedScreen, useRealtimeMeeting } from "src/realtime";

const MeetingEnded: React.FC = () => {
  const meeting = useRealtimeMeeting();

  // If we don't have a meeting context, show a basic message
  if (!meeting) {
    return (
      <div className="meeting-ended-fallback">
        <div className="meeting-ended-content">
          <h2>Meeting Ended</h2>
          <p>Thank you for using Topmate!</p>
        </div>
      </div>
    );
  }

  // Use the proper RtkEndedScreen component with meeting context
  return (
    <div className="meeting-ended-container">
      <RtkEndedScreen
        meeting={meeting}
        size="lg"
        message="Thank you for using Topmate! The meeting has ended."
      />
    </div>
  );
};

export default MeetingEnded;
