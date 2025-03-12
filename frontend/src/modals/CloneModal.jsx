import { useState } from 'react';

import OuterModal from './OuterModal'
import { X, Copy, Check } from 'lucide-react'

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Link } from 'react-router-dom';

const CloneModal = ({ closeModal, username, reponame }) => {
    const [isCopied, setIsCopied] = useState(false)
    const cloneUrl = `git@${import.meta.env.VITE_GIT_SERVER_DOMAIN}:${username}/${reponame}.git`

    const handleCopyText = () => {
        setIsCopied(true)
        navigator.clipboard.writeText(cloneUrl)

        setTimeout(() => {
            setIsCopied(false)
        }, 700);
    }

    return (
        <OuterModal closeModal={closeModal}>
            <div className='ModalHeader py-2 px-3 relative w-full flex'>
            <h4 className="modal-title m-auto font-semibold">Clone Repository</h4>
                <button type="button" className="close" onClick={closeModal}>
                    <X />
                </button>
            </div>

            <div className='h-[1px] w-full bg-gray-300'></div>

            <div className='my-2 mx-3 flex gap-2'>
                <img src='../../web-programming.png' alt="" width={22} height={22}/>
                <span className='font-medium'>Clone to your local PC</span>
            </div>

            <div className='my-2 mx-3 flex items-center gap-2'>
                <p className='border text-xs py-[4px] px-2 w-fit rounded-md bg-[#f6f8fa] text-[#272b30]'>{cloneUrl}</p>

                {isCopied ?
                    <Tooltip title="Copied">
                        <IconButton className='cursor-pointer' >
                            <Check size={18} strokeWidth={1.5} />
                        </IconButton>
                    </Tooltip>
                :
                    <Tooltip title="Copy to clipboard">
                        <IconButton className='cursor-pointer' onClick={handleCopyText}>
                            <Copy size={18} strokeWidth={1.5} />
                        </IconButton>
                    </Tooltip>
                }
            </div>

            <p className="px-3 text-xs text-gray-600">Check out our guide to <Link to="/doc/ssh" className="text-blue-600 underline">clone repository to Local PC.</Link></p>
        </OuterModal>
    )
}

export default CloneModal
