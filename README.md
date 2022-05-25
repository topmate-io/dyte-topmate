<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://dyte.io">
    <img src="https://dyte-uploads.s3.ap-south-1.amazonaws.com/dyte-logo-dark.svg" alt="Logo" height="40">
  </a>

  <h3 align="center">React UI Kit Sample App</h3>

  <p align="center">
    A basic project demonstrating how you can integrate <b>dyte</b> in your React app.
    <br />
    <a href="https://docs.dyte.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://dyte-react-sample.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/dyte-in/react-sample-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/dyte-in/react-sample-app/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Structure](#structure)
- [Application FLow](#application-flow)
- [Getting Started](#getting-started)
- [License](#license)

<!-- ABOUT THE PROJECT -->

## About The Project

A basic project demonstrating how you can integrate **dyte** in your React app.

### Built With

- [create-react-app](https://github.com/facebook/create-react-app)
- [@dytesdk/web-core](https://www.npmjs.com/package/@dytesdk/web-core)
- [@dytesdk/react-ui-kit](https://www.npmjs.com/package/@dytesdk/react-ui-kit)

<!-- GETTING STARTED -->

## Structure

React App structure:

```
├── src
│   ├── App.tsx // Dyte Meeting Component
│   ├── index.tsx // application js entry point
```

## Getting Started

Please make sure you have an organization ID and API Key for your application. These can be obtained from the developer portal.

1. Clone the repo

```sh
git clone https://github.com/dyte-in/react-ui-kit-sample-app.git
```

2. Install NPM packages

```sh
npm install
```

3. Create an `.env` file with your credentials. Use `.env.example` as a template.
```
cp .env.example .env
```

4. Run the application

```sh
npm start
```


<!-- You can use this example as a reference on how you can integrate your webapp with dyte. -->

_For documentation on APIs and client SDKs, please refer to our [official documentation](https://docs.dyte.io)._

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.