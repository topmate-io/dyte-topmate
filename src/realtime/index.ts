import {
  useRealtimeKitClient,
  RealtimeKitProvider,
  useRealtimeKitMeeting,
} from "@cloudflare/realtimekit-react";
import {
  RtkMeeting as RtkMeetingComponent,
  RtkCameraToggle as RtkCameraToggleComponent,
  RtkLeaveButton as RtkLeaveButtonComponent,
  RtkLogo as RtkLogoComponent,
  RtkMicToggle as RtkMicToggleComponent,
  RtkParticipantsAudio as RtkParticipantsAudioComponent,
  RtkDialogManager as RtkDialogManagerComponent,
  RtkSetupScreen as RtkSetupScreenComponent,
  RtkChat as RtkChatComponent,
  RtkGrid as RtkGridComponent,
  RtkChatToggle as RtkChatToggleComponent,
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
export const RtkCameraToggle: any = RtkCameraToggleComponent as any;
export const RtkLeaveButton: any = RtkLeaveButtonComponent as any;
export const RtkLogo: any = RtkLogoComponent as any;
export const RtkMicToggle: any = RtkMicToggleComponent as any;
export const RtkParticipantsAudio: any = RtkParticipantsAudioComponent as any;
export const RtkDialogManager: any = RtkDialogManagerComponent as any;
export const RtkSetupScreen: any = RtkSetupScreenComponent as any;
export const RtkChat: any = RtkChatComponent as any;
export const RtkGrid: any = RtkGridComponent as any;
export const RtkChatToggle: any = RtkChatToggleComponent as any;

// Re-export UI controls/helpers
// Optional helpers for backward compatibility; keep generic names
export const extendConfig = (config: any) => config;
export const provideRtkDesignSystem = (..._args: any[]) => {};
