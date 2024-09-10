# Post-itter

**Post-itter** is a social media platform designed for sharing thoughts, connecting with users, and engaging in real-time conversations. Inspired by Twitter, it provides a seamless experience for posting updates, following other users, and interacting with content.

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
- **Chat Member Management**: Buttons in chats to view members, rename the chat, and remove users from the chat.
- **Popular Posts Page**: A page dedicated to showcasing the most popular posts at the moment.
- **Interest-Based Content** or **More User-Interest focused Homepage**: Consideration for either a dedicated section or a homepage tailored to user interests.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests. No specific contribution guidelines at the moment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Issues

During development, significant issues were encountered related to CORS (Cross-Origin Resource Sharing). Multiple solutions were attempted without success. Eventually, a workaround was found by bypassing CORS issues through disabling security checks on the API side and omitting token authorization in requests. Note that this approach should be reconsidered for production environments to ensure proper security measures are in place.
