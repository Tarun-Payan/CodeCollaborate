import React from 'react'

const RepoCard = ({ repo }) => {
  const content = "This is simple clone of Spotify Website I add some new feature in this clone, like I make responsive for mobile, original spotify website is responsive for mobile"
  return (
    <div className='border w-full rounded-md p-2 h-full'>
      <div className='repo-header flex justify-between mb-2'>
        <h2 className='text-sm text-blue-800 font-medium'>{ repo?.name }</h2>
        <div className='repo-type border rounded-full text-xs pl-[6px] pr-[6px]'>{ repo?.type}</div>
      </div>
      <p className='text-xs text-[#59636e]'>{ repo?.description }</p>
    </div>
  )
}

export default RepoCard
