import React from 'react'
import DocHeader from '../components/DocHeader'

const ConnectViaSSH = () => {
  const Command = ({ cmd }) => <div className="py-2 px-4 bg-[#1e1e1e] text-[#9cdcfe] rounded-md my-1">{cmd}</div>

  return (
    <div className='bg-slate-800 h-screen overflow-y-auto w-full text-gray-200'>
      <DocHeader />
      <div className='max-w-[1200px] m-auto px-3 py-2 pb-10'>
        <h1 className='text-2xl font-bold'>Overview of SSH Key</h1>
        <p className='py-1'>An SSH Key is a secure way to authenticate your identity when connecting to a remote server or repository. In Code Collaborate, users need to generate an SSH key and add it to their profile to clone repositories and push code changes. This eliminates the need for a username and password every time you interact with your repository.</p>


        <h1 className='text-2xl font-bold'>How to Create SSH Key and Clone Repository</h1>

        <h2 className='text-xl font-semibold pt-2'>1. Create SSH Key</h2>
        <p className='py-1 px-2'>To clone repositories, you need an SSH Key. Follow these steps:</p>
        <ol className='list-decimal pl-8'>
          <li>Open Terminal (or Git Bash) on your computer.</li>
          <li>Run the command:</li>
          <Command cmd={`ssh-keygen -t rsa -b 4096 -C "your-email@example.com"`} />
          <li>Press Enter to save the key in the default location.</li>
          <li>Once the key is generated, find your public key by running:</li>
          <Command cmd={`cat ~/.ssh/id_rsa.pub`} />
          <li>Copy the output key.</li>
          <li>Go to Code Collaborate &gt; Settings &gt; SSH Key and paste the key.</li>
          <img src="../../src/assets/ssh-past-screen-shot.jpg" alt="" />
        </ol>

        <h2 className='text-xl font-semibold pt-20' id='clone-repository'>2. Clone Repository</h2>
        <p className='py-1 px-2'>After adding your SSH key, follow these steps to clone a repository:</p>

        <ol className='list-decimal pl-8'>
          <li>Go to the repository page by click on repository in Code Collaborate.</li>
          <li>Click Clone Repository.</li>
          <img src="../../src/assets/click-plus-icon-screenshot.jpg" alt="" />
          <li>Copy the SSH URL (e.g., git@your-domain.com:username/repository.git).</li>
          <img src="../../src/assets/copy-sshrul.jpg" alt="" />
          <li>In your terminal, run:</li>
          <Command cmd={`git clone git@your-domain.com:username/repository.git`} />
          <li>The repository will be cloned to your local machine.</li>
          <li>Use git push to push your changes.</li>
        </ol>

        <div className='w-full h-[1px] bg-gray-200 m-auto my-7'></div>

        <h1 className='text-2xl font-bold '>Contribute to Code Collaborate</h1>
        <p>If you have any suggestions, ideas, or improvements for Code Collaborate, feel free to contribute to the project on GitHub. Your feedback and contributions are highly appreciated.</p>
        <p>👉 Contribute here: <a href='https://github.com/Tarun-Payan/CodeCollaborate' className='text-blue-400 underline' target='_blank'>https://github.com/Tarun-Payan/CodeCollaborate</a></p>

      </div>
    </div>
  )
}

export default ConnectViaSSH
