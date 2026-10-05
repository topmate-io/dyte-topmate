// @cloudflare/realtimekit-ui-addons 0.1.0 lists every add-on in its "typesVersions" except
// reactions-manager, so with this repo's moduleResolution "Node" TypeScript cannot find that
// module's types (webpack resolves the code through "exports" either way). Typed loosely, like the
// rest of src/realtime. Delete once the package lists it.
declare module "@cloudflare/realtimekit-ui-addons/reactions-manager" {
  const ReactionsManagerAddon: any;
  export default ReactionsManagerAddon;
}
