import rg4js from "raygun4js";

// TOP-609: background blur on meet.topmate.io, using Cloudflare's UI Kit add-on
// (https://developers.cloudflare.com/realtime/realtimekit/ui-kit/addons/). Experts moved here
// from Zoom could not find blur, which is what the ENG-966 support ticket was about.

// 0-100. 50 is the default of the underlying blur middleware
// (https://developers.cloudflare.com/realtime/realtimekit/core/video-effects/).
const BLUR_STRENGTH = 50;

/**
 * Build the meeting UI config with an "Effects" (None / Blur) control-bar button, or return
 * undefined to keep the stock meeting UI. Never throws: blur must never stop anyone joining.
 *
 * - The browser check runs first, as the video-effects docs require. The add-on itself adds its
 *   button on any browser, so without the check iPhone/iPad, Safari < 17 and no-WebGL users
 *   would get a button that fails with UNSUPPORTED_BROWSER.
 * - registerAddons starts from the config the participant's preset already produces
 *   (generateConfig(meeting.self.config)) and only adds the button, so nothing else changes.
 * - The packages are loaded with import(), so they stay out of the main bundle. The segmentation
 *   model and wasm (~3.4 MB) are fetched by the add-on only when someone turns blur on.
 */
export async function buildMeetingUiConfig(meeting: any): Promise<any | undefined> {
  try {
    const { default: VideoBackgroundTransformer } = await import(
      "@cloudflare/realtimekit-virtual-background"
    );
    if (!VideoBackgroundTransformer.isSupported()) {
      return undefined;
    }

    const [{ default: RealtimeKitVideoBackground }, { registerAddons }] = await Promise.all([
      import("@cloudflare/realtimekit-ui-addons/video-background"),
      import("@cloudflare/realtimekit-ui"),
    ]);
    const videoBackground = await RealtimeKitVideoBackground.init({
      meeting,
      modes: ["blur"],
      blurStrength: BLUR_STRENGTH,
    });
    return registerAddons([videoBackground], meeting);
  } catch (error) {
    console.error("Video background add-on unavailable; using the default meeting UI", error);
    rg4js("send", { error, tags: ["realtimekit-addons"] });
    return undefined;
  }
}
