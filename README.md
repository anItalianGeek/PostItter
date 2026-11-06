# Post-itter

**Post-itter** is a social media platform designed for sharing thoughts, connecting with users, and engaging in real-time conversations. Inspired by Twitter, it provides an interface for posting updates, following other users, and interacting with content.

> **Personal project archive (2024).** A three-month challenge set by
> [CS nine Business Solutions](https://www.linkedin.com/company/csninegmbh/), which I worked
> on after my internship in Vienna: a working social platform, three months, whatever
> state it's in when the clock runs out. What follows is where it stood when time was up.
>
> Kept as a learning archive, without active development or maintenance. It isn't production software.

## Features

Interface modules developed during the three-month challenge:

- **Home Timeline**: View posts, like, comment, and share (posts fetched from the API with randomized client sorting).
- **Explore/Search**: Search for users, hashtags, and posts with filtering options.
- **Notifications**: View updates on likes, reposts, mentions, and new followers.
- **Direct Messages**: Real-time messaging with other users via SignalR.
- **User Profiles**: View and edit user profiles, including posts, followers, and following lists.
- **Settings Dashboard**: Adjust user preferences and application theme.

## Architecture & Companion Services

PostItter consists of three components:

1. **Frontend**: Angular 18 Single Page Application (`@angular/cli ^18.0.6`).
2. **Backend API**: ASP.NET Core 8 Web API with SignalR and MySQL ([anItalianGeek/PostItter_RESTfulAPI](https://github.com/anItalianGeek/PostItter_RESTfulAPI)), running by default on `http://localhost:5265`.
3. **Chat WebSocket Proxy**: Dedicated Node.js Express proxy with `http-proxy-middleware` located in `proxy/chatSocketServer.js`. It runs on port 3000 and forwards WebSocket and HTTP requests to the backend API (`http://localhost:5265`) with CORS support for `http://localhost:4200`.

## Getting Started

### Prerequisites

- **Node.js**: Versions supported by Angular CLI 18 tooling (`^18.19.1 || ^20.11.1 || >=22.0.0`, as specified in `package-lock.json` engines)
- **npm**: Version compatible with lockfile v3
- **Backend API**: Running instance of [PostItter_RESTfulAPI](https://github.com/anItalianGeek/PostItter_RESTfulAPI) on `http://localhost:5265` (.NET 8 SDK and MySQL; see backend repository for configuration instructions)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/anItalianGeek/PostItter.git
   cd PostItter
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm ci
   ```

3. **Start the Chat WebSocket Proxy:**
   Real-time chat functionality (`src/app/chat-detail`) connects to `http://localhost:3000/chatHub`. Start the dedicated Node proxy:
   ```bash
   npm ci --prefix proxy
   node proxy/chatSocketServer.js
   ```
   *(Or navigate into `proxy` and run `node chatSocketServer.js`.)*

4. **Start the Frontend Development Server:**
   In a separate terminal:
   ```bash
   npm start
   ```
   *(Runs `ng serve`). The application is available at `http://localhost:4200/`.*

### Available Scripts

- **`npm start`**: Runs `ng serve` to host the client locally at `http://localhost:4200/`.
- **`npm run build`**: Runs `ng build` to create a production bundle in `dist/post-itter`.
- **`npm run watch`**: Runs `ng build --watch --configuration development` for continuous compilation during development.
- **`npm test`**: Runs unit tests via Karma / Jasmine (`ng test`).

## Usage

- **Home Page**: View and interact with posts. Use the navigation sidebar to explore other sections.
- **Search Page**: Search and filter by posts, users, and hashtags.
- **Notifications Dashboard**: Monitor updates related to your account activity.
- **Chat Dashboard**: Access and manage real-time conversations.
- **Profile Page**: View your profile, posts, likes, comments, and follower details.
- **Settings Dashboard**: Modify account settings and application appearance.

## Design ideas and extensions from the original challenge

These were possible extensions considered during the original three-month challenge. They are recorded here as design ideas, without a release commitment:

- **Post Selection Algorithm**: An advanced algorithm to display posts based on user popularity and interests.
- **Responsive UI**: Improved user interface for all devices. The prototype was primarily built and experienced on desktop screens.
- **Repost Feature**: Ability to repost content from other users.
- **Profile Tooltip in Chats**: Hovering over a user in the chat will display a tooltip with quick profile details and navigation options.
- **Exclusively private chats**: Dedicated 1-to-1 private chats where external users cannot be added, keeping group conversations separate.
- **Chat Member Management**: In-chat controls to view members, rename the conversation, and manage membership.
- **Media messages support**: Allowing users to share photos and videos in chats (designed around cloud storage such as an AWS S3 bucket).
- **Popular Posts Page**: A dedicated page showcasing high-engagement posts.
- **Interest-Based Content** or **More User-Interest focused Homepage**: Exploration of dedicated sections or homepage sorting tailored to user interests.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License. Note that a standalone `LICENSE` file is not currently tracked in the repository root.

## Postmortem: the CORS problem

Throughout development the app hit persistent CORS failures between the Angular dev
server on `localhost:4200` and the .NET API on `localhost:8080`. At the time I worked
around it by disabling CORS checks on the API and bypassing token authorization on
requests. That was the wrong fix: it treated the symptom.

**The actual cause** wasn't the API's CORS configuration at all — it was the Angular dev
server proxy. The proxy forwarded requests while keeping the original `Host` header, so
the backend generated redirects with a `Location` pointing at its own origin. The browser
followed that redirect out of the proxy's origin, the request genuinely became
cross-origin, and preflight failed. No amount of server-side CORS configuration could fix
it, because the problem was upstream, in the routing.

**The correct fix**, in `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

`changeOrigin: true` rewrites the `Host` header to match the target, so redirects the
backend generates stay consistent with the origin the browser is actually talking to. The
browser never leaves its own origin, CORS never enters the picture, and the token
authorization — which is implemented in the code — works without any workaround.

**What it taught me.** When the symptom is CORS, the cause is usually somewhere else:
routing, proxying, or redirect handling. Turning off security checks to make an error
disappear just moves the problem to where it costs more. This configuration is routine in
my day job now. In 2024 it wasn't, and this section stays here to record that.
