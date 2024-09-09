# Post-itter

**Post-itter** is a social media platform designed for sharing thoughts, connecting with users, and engaging in real-time conversations. Inspired by Twitter, it provides a seamless experience for posting updates, following other users, and interacting with content.

## Features

- **Home Timeline**: View posts from users you follow, like, comment, and share.
- **Explore/Search**: Search for users, hashtags, and posts with advanced filtering.
- **Notifications**: Receive updates on likes, retweets, mentions, and new followers.
- **Direct Messages**: Engage in real-time chats with other users.
- **User Profiles**: View and edit profiles, including posts, followers, and following.
- **Lists**: Organize users into lists for better management.
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
   - Navigate to the backend directory:
     ```bash
     cd Post-itter/backend
     ```
   - Restore dependencies and run the application:
     ```bash
     dotnet restore
     dotnet run
     ```

3. **Set Up the Frontend:**
   - Navigate to the frontend directory:
     ```bash
     cd Post-itter/frontend
     ```
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
- **Search Page**: Search and Filter by posts, users, and hashtags.
- **Notifications Dashboard**: Monitor updates related to your activity.
- **Chat Dashboard**: Access and manage real-time conversations.
- **Profile Page**: View your profile, posts, likes, comments, and more.
- **Settings Dashboard**: Modify your account settings.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests. No specific contribution guidelines at the moment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
