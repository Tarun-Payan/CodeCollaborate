import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import RepoCard from './RepoCard'
import CustmizeModelPin from '../modals/CustmizeModelPin';

const ProfileShowReposComponent = () => {
  const { selectedUser, authUser } = useAuthStore();

  const [Repositories, setRepositories] = useState([])

  const [showCustmizePinModal, setShowCustmizePinModal] = useState(false)
  const closeCustmizePinModal = () => setShowCustmizePinModal(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/get-repos-data`, { params: { suser: selectedUser?.username }, withCredentials: true });
        // console.log(response.data)
        setRepositories(response.data)
      } catch (err) {
        console.error(err)
      }
    })();
  }, [selectedUser])

  return (
    <>
      <div className='header flex justify-between items-end font-light mb-2'>
        <div className='text-base'>Repositories</div>
        {authUser?.username == selectedUser?.username && <div className='text-blue-600 text-xs hover:underline cursor-pointer' onClick={() => setShowCustmizePinModal(true)}>Customize your pins</div>}
        {showCustmizePinModal && <CustmizeModelPin closeModal={closeCustmizePinModal} repositories={Repositories} />}
      </div>


      {Repositories?.repos?.length > 0 ?
        <div className='grid gap-3 grid-cols-2'>
          {Repositories?.repos.map(repo => {
              if(repo.type == "Public" && repo.pin) return <RepoCard key={repo._id} repo={repo} />
            }
          )}
        </div>
        : <div className='text-center text-gray-400 text-base'>No repositories found</div>
      }
    </>
  )
}

export default ProfileShowReposComponent
