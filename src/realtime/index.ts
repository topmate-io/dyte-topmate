import {
  useRealtimeKitClient,
  RealtimeKitProvider,
  useRealtimeKitMeeting,
} from "@cloudflare/realtimekit-react";
import {
  RtkMeeting as RtkMeetingComponent,
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
} from "@cloudflare/realtimekit-react-ui";

// Core meeting hooks/providers (typed as any to avoid SDK version type conflicts)
export function useRealtimeClient(): any {
  return useRealtimeKitClient() as any;
}
export const RealtimeProvider = RealtimeKitProvider as any;
export const useRealtimeMeeting = useRealtimeKitMeeting as any;

// Minimal selector shim to preserve existing component API
export function useRealtimeSelector<T>(selector: (m: any) => T): T | undefined {
  const meetingCtx: any = useRealtimeKitMeeting() as any;
  const meeting = meetingCtx?.meeting ?? meetingCtx;
  // Basic selector without memoization to avoid async import hacks
  return meeting ? selector(meeting) : undefined;
}

// UI: Re-export DyteMeeting under a neutral name without JSX here to avoid TS confusions.
// Consumers can render it directly; type is relaxed as any.
export const RtkMeeting: any = RtkMeetingComponent as any;

// Re-export UI controls/helpers
export const DyteCameraToggle = RtkCameraToggle as any;
export const DyteLeaveButton = RtkLeaveButton as any;
export const DyteLogo = RtkLogo as any;
export const DyteMicToggle = RtkMicToggle as any;
export const DyteParticipantsAudio = RtkParticipantsAudio as any;
export const DyteDialogManager = RtkDialogManager as any;
export const DyteSetupScreen = RtkSetupScreen as any;
export const DyteChat = RtkChat as any;
export const DyteGrid = RtkGrid as any;
export const DyteChatToggle = RtkChatToggle as any;

// Stubs to preserve existing API shape without breaking compile
export const provideDyteDesignSystem = (..._args: any[]) => {};
export const extendConfig = (config: any) => config;
