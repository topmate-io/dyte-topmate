import rg4js from "raygun4js";

// TOP-609: meeting add-ons on meet.topmate.io, using Cloudflare's UI Kit add-ons
// (https://developers.cloudflare.com/realtime/realtimekit/ui-kit/addons/). Experts moved here
// from Zoom could not find background blur, which is what the ENG-966 support ticket was about.

// 0-100. 50 is the default of the underlying blur middleware
// (https://developers.cloudflare.com/realtime/realtimekit/core/video-effects/).
const BLUR_STRENGTH = 50;

// Served from this app's public/ folder, i.e. the same origin as the meeting, so the add-on can
// draw them onto its canvas without CORS (the video-effects docs require CORS-safe images).
const VIRTUAL_BACKGROUNDS = [
  "topmate-warm",
  "topmate-calm-blue",
  "topmate-sage",
  "topmate-charcoal",
].map((name) => new URL(`/backgrounds/${name}.jpg`, window.location.origin).href);

/**
 * Build the meeting UI config with Topmate's add-ons, or return undefined to keep the stock
 * meeting UI. Never throws: an add-on must never stop anyone joining.
 *
 * - Effects (None / Blur / backgrounds): only where the blur engine runs. The browser check
 *   comes first, as the video-effects docs require; the add-on itself shows its button anywhere,
 *   so iPhone/iPad, Safari < 17 and no-WebGL users would otherwise get a button that fails.
 * - Reactions, and hand raise (any participant raises; only the host's preset may manage them).
 *
 * Each add-on is set up independently, so one failing (e.g. blur on an unsupported browser) does
 * not take the others with it. registerAddons starts from the config the participant's preset
 * already produces (generateConfig(meeting.self.config)) and applies each add-on on top.
 * Everything is loaded with import(), so it stays out of the main bundle; the blur model and wasm
 * (~3.4 MB) download only when someone picks Blur or a background.
 */
/**
 * Start downloading the add-on code while the meeting connects, so buildMeetingUiConfig() is not
 * waiting on the network when the meeting is ready. Without this, a slow or cold CDN load could
 * outrun the meeting's wait for the add-ons and open the stock UI without Effects (seen on a first
 * load of a fresh deployment). Same import() specifiers, so webpack reuses the chunks.
 */
export function preloadMeetingAddons(): void {
  [
    import("@cloudflare/realtimekit-virtual-background"),
    import("@cloudflare/realtimekit-ui-addons/video-background"),
    import("@cloudflare/realtimekit-ui-addons/reactions-manager"),
    import("@cloudflare/realtimekit-ui-addons/hand-raise"),
    import("@cloudflare/realtimekit-ui"),
  ].forEach((loading) => loading.catch(() => undefined));
}

export async function buildMeetingUiConfig(meeting: any): Promise<any | undefined> {
  try {
    const results = await Promise.allSettled([
      videoBackgroundAddon(meeting),
      reactionsAddon(meeting),
      handRaiseAddon(meeting),
    ]);
    const addons: any[] = [];
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        addons.push(result.value);
      } else if (result.status === "rejected") {
        reportAddonError(result.reason);
      }
    });
    if (addons.length === 0) {
      return undefined;
    }
    const { registerAddons } = await import("@cloudflare/realtimekit-ui");
    return registerAddons(addons, meeting);
  } catch (error) {
    reportAddonError(error);
    return undefined;
  }
}

async function videoBackgroundAddon(meeting: any) {
  const { default: VideoBackgroundTransformer } = await import(
    "@cloudflare/realtimekit-virtual-background"
  );
  if (!VideoBackgroundTransformer.isSupported()) {
    return undefined;
  }
  const { default: RealtimeKitVideoBackground } = await import(
    "@cloudflare/realtimekit-ui-addons/video-background"
  );
  return RealtimeKitVideoBackground.init({
    meeting,
    modes: ["blur", "virtual"],
    blurStrength: BLUR_STRENGTH,
    images: VIRTUAL_BACKGROUNDS,
  });
}

async function reactionsAddon(meeting: any) {
  const { default: ReactionsManagerAddon } = await import(
    "@cloudflare/realtimekit-ui-addons/reactions-manager"
  );
  return ReactionsManagerAddon.init({ meeting, canSendReactions: true });
}

async function handRaiseAddon(meeting: any) {
  const { default: HandRaiseAddon } = await import(
    "@cloudflare/realtimekit-ui-addons/hand-raise"
  );
  return HandRaiseAddon.init({
    meeting,
    canRaiseHand: true,
    // Only group_call_host has kick_participant in our RealtimeKit presets.
    canManageRaisedHand: meeting?.self?.permissions?.kickParticipant === true,
  });
}

function reportAddonError(error: unknown) {
  console.error("Meeting add-on unavailable; continuing without it", error);
  rg4js("send", { error, tags: ["realtimekit-addons"] });
}
