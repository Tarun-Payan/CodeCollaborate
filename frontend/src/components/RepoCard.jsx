import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore';

const RepoCard = ({ repo }) => {
  const { selectedUser } = useAuthStore();

  return (
    <div className='border w-full rounded-md p-2 h-full'>
      <div className='repo-header flex justify-between mb-2'>
        <h2 className='text-sm text-blue-800 font-medium cursor-pointer hover:underline'><Link to={`/${selectedUser?.username}/${repo.name}`}>{ repo?.name }</Link></h2>
        <div className='repo-type border rounded-full text-xs pl-[6px] pr-[6px]'>{ repo?.type}</div>
      </div>
      <p className='text-xs text-[#59636e]'>{ repo?.description }</p>
    </div>
  )
}

export default RepoCard
