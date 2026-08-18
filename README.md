# Post-itter

**Post-itter** is a social media platform designed for sharing thoughts, connecting with users, and engaging in real-time conversations. Inspired by Twitter, it provides a seamless experience for posting updates, following other users, and interacting with content.

> Built between June and September 2024 as a challenge set by
> [CS nine Business Solutions](https://www.linkedin.com/company/csninegmbh/) at the end of
> my internship in Vienna: a working social platform, three months, whatever state it's
> in when the clock runs out. What follows is where it stood when time was up.

## Features

- **Home Timeline**: View posts from users you follow, like, comment, and share.
- **Explore/Search**: Search for users, hashtags, and posts with advanced filtering.
- **Notifications**: Receive updates on likes, retweets, mentions, and new followers.
- **Direct Messages**: Engage in real-time chats with other users.
- **User Profiles**: View and edit profiles, including posts, followers, and following.
- **Settings Dashboard**: Adjust user settings and preferences.

## Getting Started

### Prerequisites

- **Node.js**: Latest stable version
- **npm**: Latest version
- **.NET SDK**: Version 8.0 stable
- **MySQL**: Version 8.0.37
- **SignalR**: Required for real-time messaging (configured via the proxy in the project)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/username/Post-itter.git
   ```

2. **Set Up the Backend:**
   - Clone the backend repository:
     ```bash
     git clone https://github.com/anItalianGeek/PostItter_RESTfulAPI.git
     ```
   - Navigate to the backend directory.
   - Restore dependencies and run the application:
     ```bash
     dotnet restore
     dotnet run
     ```

3. **Set Up the Frontend:**
   - Navigate to the frontend directory.
   - Install dependencies and start the development server:
     ```bash
     npm install
     ng serve
     ```

4. **Configure the Database:**
   - Import the initial data using the provided SQL file (if available).
   - Update database connection settings in the backend configuration files.

## Usage

- **Home Page**: View and interact with posts. Use the navigation bar to explore other sections.
- **Search Page**: Search and filter by posts, users, and hashtags.
- **Notifications Dashboard**: Monitor updates related to your activity.
- **Chat Dashboard**: Access and manage real-time conversations.
- **Profile Page**: View your profile, posts, likes, comments, and more.
- **Settings Dashboard**: Modify your account settings.

## Upcoming Features for Future Versions

In the next version of Post-itter, we plan to introduce the following features:

- **Post Selection Algorithm**: An advanced algorithm to display posts based on user popularity and interests.
- **Responsive UI**: Improved user interface for all devices. Currently, the app is best experienced on larger screens like desktops.
- **Repost Feature**: Ability to repost content from other users.
- **Profile Tooltip in Chats**: Hovering over a user in the chat will display a tooltip with quick profile details and navigation options.
- **Exclusively private chats**: Currenty you can have either single or group chats, but in the next version it is planned to introduce exclusively private chats meaning that nobody outside will be able to join the chat. You will obviously be allowed to create group chats with the same person, but it will have to be another chat.
- **Chat Member Management**: Buttons in chats to view members, rename the chat, and remove users from the chat.
- **Media messages support**: Users will be able to share photos and videos in the chats, that is currently not available because I don't have a cloud. I plan to use AWS S3, so a bucket is what i need, to store content.
- **Popular Posts Page**: A page dedicated to showcasing the most popular posts at the moment.
- **Interest-Based Content** or **More User-Interest focused Homepage**: Consideration for either a dedicated section or a homepage tailored to user interests.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests. No specific contribution guidelines at the moment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
