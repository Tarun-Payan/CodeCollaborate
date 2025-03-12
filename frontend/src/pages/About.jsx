import React from 'react'
import DocHeader from '../components/DocHeader'

const About = () => {
  return (
    <div className='bg-slate-800 h-screen overflow-y-auto w-full text-gray-200'>
        <DocHeader />
        <div className='max-w-[1200px] m-auto px-3 py-2 pb-10'>
            <h1 className='text-2xl font-bold'>Code Collaborate - About / Guide</h1>
            <h2 className='text-xl font-semibold pt-2'>Overview</h2>
            <p className='py-1'>Code Collaborate is a web-based platform designed to simplify version control and collaboration for developers. It allows users to create repositories, manage repository permissions, collaborate with other users, and track project changes. The platform acts as a central hub where developers can easily clone repositories, push updates, and manage repository access. It is especially useful for team-based development, where access control, branch management, and collaboration are crucial.</p>

            <p className='py-1'>The platform uses:</p>
            <ul className='list-disc pl-7'>
                <li><span className='font-semibold'>Frontend:</span> Vite.js with Zustand for state management.</li>
                <li><span className='font-semibold'>Backend::</span> Node.js with Express.js.</li>
                <li><span className='font-semibold'>Database:</span> MongoDB.</li>
                <li><span className='font-semibold'>File Storage:</span> AWS S3 for profile pictures.</li>
                <li><span className='font-semibold'>Git Server:</span> Hosted on AWS EC2 instance.</li>
                <li><span className='font-semibold'>Storage for Repositories:</span> Mounted EFS on EC2 to store repositories.</li>
                <li><span className='font-semibold'>Command Execution:</span> AWS SSM (Systems Manager) to manage EC2 server operations from the backend.</li>
            </ul>

            <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

            {/*  Features  */}
            <h1 className='text-2xl font-bold'>Features</h1>

            <h2 className='text-xl font-semibold pt-2'>1. User Authentication</h2>
            <ul className='list-disc pl-7'>
                <li><span className='font-semibold'>Signup:</span> Users can register an account on Code Collaborate.</li>
                <li><span className='font-semibold'>Email Verification::</span> Upon signup, a verification email is sent to the user&#39;s email address to verify the account.</li>
                <li><span className='font-semibold'>Welcome Email:</span> Once the account is verified, a welcome email is sent to the user.</li>
                <li><span className='font-semibold'>Login:</span> Registered users can log in to their accounts.</li>
                <li><span className='font-semibold'>Forgot Password:</span> If users forget their password, they can request a password reset link via email.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>2. User Profile Management</h2>
            <ul className='list-disc pl-7'>
                <li>Users can update their profile picture, name, and bio.</li>
                <li>Profile pictures are uploaded to AWS S3, and their metadata (URL) is stored in MongoDB.</li>
                <li>Users can search for other users&#39; profiles.</li>
                <li>Users can follow and unfollow other users.</li>
                <li>Users can see their followers and following list.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>3. Repository Management</h2>
            <ul className='list-disc pl-7'>
                <li>Users can create repositories from the Code Collaborate platform.</li>
                <li>Repositories can be public or private.</li>
                <li>Public repositories are visible to everyone.</li>
                <li>Private repositories are only visible to the owner and users who have been granted access.</li>
                <li>Users can delete repositories if they no longer need them.</li>
                <li>Users can clone repositories by adding their SSH key to their profile.</li>
                <li>Once a repository is created, it automatically gets stored as a bare repository on the Git Server (hosted on EC2).</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>4. Repository Code View</h2>
            <ul className='list-disc pl-7'>
                <li>Each repository has a code page where users can view code files.</li>
                <li>The code page consists of two parts:
                    <ul className='list-disc pl-7'>
                        <li>File Tree: Displays all files and folders of the repository.</li>
                        <li>Code Viewer: Displays the content of the selected file.</li>
                    </ul>
                </li>
                <li>This helps users to easily browse repository files without cloning the repository.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>5. Repository Permissions Management</h2>
            <ul className='list-disc pl-7'>
                <li>The repository owner can add, update, or delete permissions for other users.</li>
                <li>Permissions include:
                    <ul className='list-disc pl-7'>
                        <li>Read: User can only view the repository.</li>
                        <li>Read & Write: User can view and push changes to the repository.</li>
                        <li>Full Access: User can view, push changes, and create branches.</li>
                    </ul>
                </li>
                <li>Users can also set branch-specific permissions (e.g., a user can modify only the dev branch).</li>
                <li>Permissions are handled by Gitolite installed on the Git Server.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>6. Git Server Setup & Management</h2>
            <ul className='list-disc pl-7'>
                <li>Code Collaborate uses a Git Server hosted on AWS EC2.</li>
                <li>All repositories are created as bare repositories to act as a central repository.</li>
                <li>Gitolite is used to manage repository permissions.</li>
                <li>EFS (Elastic File System) is mounted on the EC2 server to store repositories, reducing storage limitations.</li>
                <li>AWS SSM (Systems Manager) is integrated to execute server-side Git commands from the backend.</li>
                <li>This setup allows seamless repository management without manually accessing the EC2 instance.</li>
            </ul>

            <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

            {/* Technical Architecture */}
            <h1 className='text-2xl font-bold'>Technical Architecture</h1>

            <h2 className='text-xl font-semibold pt-2'>1. Frontend (Vite.js)</h2>
            <ul className='list-disc pl-7'>
                <li>Developed using Vite.js with Zustand for state management.</li>
                <li>Provides an intuitive and user-friendly interface.</li>
                <li>Handles profile management, repository creation, and collaboration management.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>2. Backend (Node.js + Express.js)</h2>
            <ul className='list-disc pl-7'>
                <li>Built using Node.js and Express.js.</li>
                <li>Handles user authentication, repository management, and permission control.</li>
                <li>Integrates with AWS services (EC2, S3, SSM, EFS).</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>3. Database (MongoDB)</h2>
            <ul className='list-disc pl-7'>
                <li>Stores user data, repository details, permissions, and profile picture metadata.</li>
                <li>Provides a fast and scalable database solution.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>4. Git Server (EC2 + Gitolite)</h2>
            <ul className='list-disc pl-7'>
                <li>Git server is hosted on an AWS EC2 instance..</li>
                <li>Gitolite is used for repository permission management.</li>
                <li>All repositories are stored as bare repositories.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>5. Storage (EFS + S3)</h2>
            <ul className='list-disc pl-7'>
                <li>EFS (Elastic File System): Mounted on EC2 to store repositories.</li>
                <li>S3 (Simple Storage Service): Used to store user profile pictures.</li>
            </ul>

            <h2 className='text-xl font-semibold pt-2'>6. Command Execution (SSM)</h2>
            <ul className='list-disc pl-7'>
                <li>AWS SSM (Systems Manager): Used to execute commands on the EC2 server from the backend.</li>
                <li>Allows creating repositories, managing folders, and updating Gitolite configurations programmatically.</li>
            </ul>

            <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

            {/* How It Works */}
            <h1 className='text-2xl font-bold'>Technical Architecture</h1>

            <ol className='list-decimal pl-7'>
                <li><span className='font-semibold'>User Signup:</span> User signs up and verifies their email.</li>
                <li><span className='font-semibold'>Create Repository:</span> User creates a repository from the platform.</li>
                <li><span className='font-semibold'>Upload SSH Key:</span>  User adds their SSH key to clone repositories to their local PC.</li>
                <li><span className='font-semibold'>Push Changes:</span> User can push code changes to their repository.</li>
                <li><span className='font-semibold'>Manage Permissions:</span> User can add collaborators with different access levels.</li>
                <li><span className='font-semibold'>Profile Management:</span> Users can follow/unfollow other users and view profiles.</li>
                <li><span className='font-semibold'>Central Repository:</span> All repositories are managed on the Git Server (EC2 instance).</li>
                <li><span className='font-semibold'>Command Execution:</span> Backend uses SSM to execute server-side commands.</li>
            </ol>

            <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

            {/* Conclusion */}
            <h1 className='text-2xl font-bold'>Conclusion</h1>
            <p><span className='font-medium'>Code Collaborate</span> is built to simplify the process of version control and collaboration. With Git server integration, repository permission management, and seamless profile handling, the platform enables developers to work efficiently. The use of AWS services like EC2, S3, EFS, and SSM ensures scalability and performance. This project aims to provide a robust and efficient platform for code collaboration.</p>

            <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

            <h1 className='text-2xl font-bold '>Contribute to Code Collaborate</h1>
            <p>If you have any suggestions, ideas, or improvements for Code Collaborate, feel free to contribute to the project on GitHub. Your feedback and contributions are highly appreciated.</p>
            <p>👉 Contribute here: <a href='https://github.com/Tarun-Payan/CodeCollaborate' className='text-blue-400 underline' target='_blank'>https://github.com/Tarun-Payan/CodeCollaborate</a></p>
        </div>
    </div>
  )
}

export default About
