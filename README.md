# Code-Collaborate

Code-Collaborate is a modern web platform designed to simplify version control and enhance team collaboration. It provides developers with tools to create, manage, and collaborate on repositories efficiently, all within an intuitive and secure environment.

## Features

### Profile Management

- Create and edit user profiles with the following details:
  - Username
  - Name
  - Bio
  - Profile picture (stored securely on AWS S3).

### Repository Management

- Create, update, and delete repositories directly on the platform.
- Choose between public and private repositories:
  - **Public repositories**: Visible to all users.
  - **Private repositories**: Restricted to the owner and authorized collaborators.
- Manage repository permissions, including branch-level access control.

### Git Server Integration

- Host repositories on a Git server set up on an AWS EC2 instance.
- Repositories are created as bare repositories to enable local cloning and pushing updates.
- Use Gitolite to manage permissions for collaborators.
- Users can upload their PC’s public SSH key for secure cloning and pushing.

## Technology Stack

### Frontend

- **Framework**: Vite.js
- **State Management**: Zustand
- **Features**:
  - Responsive, dynamic, and user-friendly interface.

### Backend

- **Framework**: Node.js with Express.js
- **Database**: MongoDB for storing user profiles, metadata, and repository information.
- **File Storage**: AWS S3 for profile pictures and related assets.

### Git Server

- **Hosting**: AWS EC2 instance
- **Repository Management**: Git and Gitolite

## Installation and Setup

### Prerequisites

- Node.js
- MongoDB
- AWS account for S3 and EC2 setup
- Git installed on the server

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd code-collaborate
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables for backend:
   - Create a `.env` file in the backend.
   - Add the following:
     ```
     PORT=<Port>
     MONGO_URI=<MongoDB Connection String>
     SECRET_KEY=<jwt secret_key>
     NODE_ENV="development"
     CLIENT_URL=<client url>
     AWS_ACCESS_KEY=<Your AWS Access Key>
     AWS_SECRET_ACCESS_KEY=<Your AWS Secret Key>
     AWS_S3_BUCKET=<Your S3 Bucket Name>
     GIT_SERVER_IP=<Git Server IP Address>
     GITOLITE_ADMIN_PATH=<server gitolite-admin repo path>
     GIT_SERVER_INTANCE_ID=<ec2 instance id>
     MAILTRAP_TOKEN=<mailtrap token for email>
     ```
5. Set up environment variables for frontend
   - Create a .env file in the frontend
   - Add the following:
     ```
     VITE\_SERVER\_URL=\<server url>
     ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign Up**: Create a profile with a username, name, bio, and profile picture.
2. **Create Repositories**: Set up public or private repositories.
3. **Manage Collaborators**: Grant permissions at repository or branch level.
4. **Collaborate**: Clone repositories, push updates, and chat in real-time.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Push to your fork and submit a pull request.

---

Thank you for using Code-Collaborate! Together, let’s build and collaborate effectively.

