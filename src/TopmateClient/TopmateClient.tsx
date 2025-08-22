/* eslint-disable react-hooks/exhaustive-deps */
import { RtkMeeting, RtkEndedScreen, RealtimeProvider } from "src/realtime";
import { useRealtimeClient } from "src/realtime";
import { createParticipantAndGetToken } from "src/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRealtimeKitSelector } from "@cloudflare/realtimekit-react";

const { REACT_APP_MY_BACKEND: MY_BACKEND } = process.env;
const TOPMATE_BASE_URL =
  process.env.TOPMATE_BASE_URL ||
  process.env.REACT_APP_TOPMATE_BASE_URL ||
  "https://topmate.io";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// Internal component that uses RealtimeKit hooks properly
const MeetingComponent: React.FC<{ meeting: any }> = ({ meeting }) => {
  const navigate = useNavigate();
  const params: any = useParams<{
    id: string;
    room: string;
    token: string;
  }>();
  let query: any = useQuery();
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  // Use the proper RealtimeKit selector for room state
  const roomState = useRealtimeKitSelector(
    (state: any) => state?.self?.roomState
  );

  // Function to handle meeting end API call and redirect
  const handleMeetingEndRedirect = async () => {
    try {
      setIsRedirecting(true);
      setRedirectError(null);

      // Get user type from URL params
      const userType = query.get("type") || "follower";
      const meetingId = params.id;

      // Call backend using configured host (same pattern as createParticipantAndGetToken)
      const resp = await axios({
        url: `${MY_BACKEND}/booking-detail-by-meeting-id/${meetingId}/`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // Support common response shapes
      const bookingId: string | undefined = resp?.data?.id;

      if (!bookingId) {
        throw new Error("Booking ID not received from API");
      }

      // Redirect to Topmate videocall-ended page (open in new tab)
      const redirectUrl = `${TOPMATE_BASE_URL.replace(
        /\/$/,
        ""
      )}/booking/${bookingId}/videocall-ended?user_type=${userType}`;
      const newWin = window.open(redirectUrl, "_blank", "noopener,noreferrer");
      if (newWin) newWin.focus();
    } catch (error) {
      console.error("Error during meeting end redirect:", error);
      setRedirectError(
        error instanceof Error ? error.message : "Failed to redirect"
      );
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    if (!meeting) return;

    const handleRoomLeft = () => {
      sessionStorage.clear();
      setMeetingEnded(true);
      handleMeetingEndRedirect();
    };

    const handleDisconnected = () => {
      sessionStorage.clear();
      setMeetingEnded(true);
      handleMeetingEndRedirect();
    };

    // Listen for meeting end events
    meeting?.self?.on?.("roomLeft", handleRoomLeft);
    meeting?.meta?.on?.("disconnected", handleDisconnected);

    return () => {
      meeting?.self?.off?.("roomLeft", handleRoomLeft);
      meeting?.meta?.off?.("disconnected", handleDisconnected);
    };
  }, [meeting]);

  // If meeting has ended or room state is ended, show the ended screen
  if (meetingEnded || roomState === "ended") {
    return (
      <>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a1a",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "2.5rem",
              background: "#2d2d2d",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: "1px solid #404040",
              maxWidth: "480px",
              width: "90%",
            }}
          >
            {isRedirecting ? (
              <>
                <h2
                  style={{
                    color: "#ffffff",
                    marginBottom: "1rem",
                    fontSize: "24px",
                    fontWeight: "500",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Meeting Ended
                </h2>
                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    marginBottom: "2rem",
                  }}
                >
                  Thank you for using Topmate. Redirecting you to the booking
                  page...
                </p>
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid #404040",
                    fontSize: "14px",
                    color: "#999999",
                  }}
                >
                  Please wait while we redirect you.
                </div>
              </>
            ) : redirectError ? (
              <>
                <div
                  style={{
                    fontSize: "24px",
                    marginBottom: "1.5rem",
                    opacity: "0.8",
                  }}
                >
                  !
                </div>
                <h2
                  style={{
                    color: "#ffffff",
                    marginBottom: "1rem",
                    fontSize: "24px",
                    fontWeight: "500",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Meeting Ended
                </h2>
                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    marginBottom: "1.5rem",
                  }}
                >
                  Thank you for using Topmate. The meeting has ended
                  successfully.
                </p>
                <div
                  style={{
                    color: "#ff6b6b",
                    fontSize: "14px",
                    marginBottom: "2rem",
                    padding: "1rem",
                    background: "#2a1818",
                    borderRadius: "8px",
                    border: "1px solid #4a2a2a",
                    textAlign: "left",
                  }}
                >
                  <strong>Error:</strong> {redirectError}
                </div>
                <button
                  onClick={handleMeetingEndRedirect}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 2rem",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginBottom: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#0056b3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#007bff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Try Again
                </button>
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid #404040",
                    fontSize: "14px",
                    color: "#999999",
                  }}
                >
                  You can also close this tab manually.
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "24px",
                    marginBottom: "1.5rem",
                    opacity: "0.8",
                  }}
                >
                  ✔
                </div>
                <h2
                  style={{
                    color: "#ffffff",
                    marginBottom: "1rem",
                    fontSize: "24px",
                    fontWeight: "500",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Meeting Ended
                </h2>
                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    marginBottom: "2rem",
                  }}
                >
                  Thank you for using Topmate. The meeting has ended
                  successfully.
                </p>
                <button
                  onClick={handleMeetingEndRedirect}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 2rem",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginBottom: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#0056b3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#007bff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Continue to Booking Page
                </button>
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid #404040",
                    fontSize: "14px",
                    color: "#999999",
                  }}
                >
                  You can now close this tab or continue to the booking page.
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ height: "100vh", width: "100vw" }}>
        <RtkMeeting
          mode="fill"
          meeting={meeting}
          showSetupScreen
          endMeeting={() => {
            sessionStorage.clear();
            setMeetingEnded(true);
            handleMeetingEndRedirect();
          }}
        />
      </div>
    </div>
  );
};

export const TopmateClient: React.FC<{}> = () => {
  const navigate = useNavigate();
  const params: any = useParams<{
    id: string;
    room: string;
    token: string;
  }>();
  let query: any = useQuery();
  const [meeting, initMeeting] = useRealtimeClient();

  const run = async () => {
    const urlToken = query.get("authToken") as string | null;
    const participantTypeParam = query.get("type") as string | null; // expert | follower
    const type = participantTypeParam === "expert" ? "expert" : "follower";
    const { id, room } = params;
    const sessionToken = sessionStorage.getItem("auth");

    // Persist meeting metadata if present
    if (id) sessionStorage.setItem("meetingID", id);
    if (room) sessionStorage.setItem("roomName", room);

    // Ensure we have a token: prefer session -> URL -> backend fetch
    let finalToken = sessionToken || urlToken || null;
    if (!finalToken && id) {
      finalToken = await createParticipantAndGetToken(id, type);
      sessionStorage.setItem("auth", finalToken);
    }

    if (finalToken && id) {
      initMeeting({
        authToken: finalToken,
        ...(room ? { roomName: room } : {}),
        defaults: {
          video: false,
          audio: false,
        },
      });
    }
  };

  useEffect(() => {
    run();
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.clear();
    };
  }, []);

  if (!meeting) {
    return null;
  }

  // Wrap the meeting component with RealtimeProvider to enable proper hook usage
  return (
    <RealtimeProvider value={meeting}>
      <MeetingComponent meeting={meeting} />
    </RealtimeProvider>
  );
};
