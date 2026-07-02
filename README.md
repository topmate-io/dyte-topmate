<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://topmate.io">
    <img src="public/topmate-logo.svg" alt="Topmate" height="40">
  </a>

  <h3 align="center">Topmate Meet</h3>

  <p align="center">
    Topmate's video-call frontend, built on <b>Cloudflare RealtimeKit</b>.
    <br />
    <a href="https://developers.cloudflare.com/realtime/realtimekit/"><strong>RealtimeKit docs »</strong></a>
  </p>
</p>

## About

React (CRA) single-page app that hosts 1:1 and group video calls. Deployed on Vercel:

- Production: `meet.topmate.io` (branch `main`)
- Staging: `meet-staging.topmate.io` (branch `develop`)

The app fetches a participant auth token from the Topmate backend
(`${REACT_APP_MY_BACKEND}/realtimekit-add-participant/{meetingId}/`) and joins the
meeting with the [RealtimeKit React SDK](https://www.npmjs.com/package/@cloudflare/realtimekit-react).

> Migrated from Dyte after Cloudflare's acquisition. Frontend uses
> `@cloudflare/realtimekit*` 2.x (targets `api.realtime.cloudflare.com`); the
> backend REST integration uses
> `https://api.cloudflare.com/client/v4/accounts/{account}/realtime/kit/{app}/…`
> with Bearer auth.

### Built With

- [@cloudflare/realtimekit-react](https://www.npmjs.com/package/@cloudflare/realtimekit-react)
- [@cloudflare/realtimekit-react-ui](https://www.npmjs.com/package/@cloudflare/realtimekit-react-ui)
- [react](https://react.dev/) + [react-router-dom](https://reactrouter.com/)
- [create-react-app](https://github.com/facebook/create-react-app)

## Getting Started

```sh
bun install
cp .env.example .env   # then fill in the values below
bun start              # http://localhost:3000
bun run build          # production build (react-scripts)
```

### Environment

```
REACT_APP_MY_BACKEND=<topmate backend base url>
REACT_APP_TOPMATE_BASE_URL=https://topmate.io
REACT_APP_RAYGUN_API_KEY=<raygun key>
```

## Routes

- `/meeting/:id` and `/meeting/:room/:id` — join a meeting.
  Query params: `?type=expert|follower`, optional `?authToken=` (skips the backend token fetch).

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.
