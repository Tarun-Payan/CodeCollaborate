import React, { useState, useEffect } from 'react';
import OuterModal from './OuterModal'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'
import ReactLoading from 'react-loading';
import { motion } from 'motion/react';
import axios from 'axios';

const CreateRepoModal = ({ closeModal, setIsNewRepoCreated }) => {
    const { authUser } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)

    const [repoName, setRepoName] = useState({ data: '', isValid: false })
    const [repoDescription, setRepoDescription] = useState('')
    const [error, seterror] = useState('')

    const handleCreateRepo = async () => {
        setIsLoading(true)
        // console.log(repoName, repoDescription)
        let repoType;
        document.getElementsByName('repoType')[0].checked == true ? repoType = 'Public' : repoType = 'Private'
        // console.log(document.getElementsByName('repoType')[0].checked)
        // console.log(document.getElementsByName('repoType')[0].value)

        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/create-repo`, { reponame: repoName.data, description: repoDescription, repoType: repoType }, { withCredentials: true })
            setIsNewRepoCreated(true)
            closeModal()
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!repoName.data) {
            seterror('');
            if (repoName.isValid) setRepoName({ data: repoName.data, isValid: false })
            return;
        }

        const delayDebounce = setTimeout(async () => {
            // validating repoName
            const reponameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
            // console.log(usernameRegex.test(username.data))
            if (!reponameRegex.test(repoName.data)) {
                seterror('Repo name is invalid or already taken')
                if (repoName.isValid) setRepoName({ data: repoName.data, isValid: false })
                return;
            }

            // check username is available or not in database
            try {
                await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/checkRepoName`, { params: { repoName: repoName.data }, withCredentials: true })
            } catch (error) {
                seterror('Repo name is invalid or already taken')
                if (repoName.isValid) setRepoName({ data: repoName.data, isValid: false })
                return;
            }

            setRepoName({ data: repoName.data, isValid: true })
            seterror('')
        }, 1000)

        return () => clearTimeout(delayDebounce);
    }, [repoName.data])

    return (
        <>
            <OuterModal closeModal={closeModal} isLoading={isLoading}>
                {isLoading &&
                    <ReactLoading
                        type={"bubbles"}
                        color={"#86ad8a"}
                        height={"64px"}
                        width={"64px"}
                        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
                    />
                }
                <div className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}>
                    <div className='ModalHeader py-2 px-3 relative w-full flex'>
                        <h4 className="modal-title m-auto">Create Repository</h4>
                        <button type="button" className="close" onClick={closeModal}>
                            <X />
                        </button>
                    </div>

                    <div className='h-[1px] w-full bg-gray-300'></div>

                    <div className='px-2 py-2 flex flex-col'>
                        <label className="text-gray-700 text-base font-semibold mb-2" htmlFor="repoName">Repository Name</label>
                        <input type="text" id="repoName" name="repoName" className="text-gray-600 outline-none text-sm rounded-[4px] border px-2 py-1 focus:border-green-300" placeholder="Enter repository name" value={repoName.data} onChange={(e) => setRepoName({ data: e.target.value, isValid: repoName.isValid })} />
                    </div>

                    <div className='px-2 py-2 flex flex-col'>
                        <label className="text-gray-700 text-base font-semibold mb-2" htmlFor="repoDesc">Description</label>
                        <input type="text" id="repoDesc" name="repoDesc" className="text-gray-600 outline-none text-sm rounded-[4px] border px-2 py-1 focus:border-green-300" placeholder='Enter repository description' value={repoDescription} onChange={(e) => setRepoDescription(e.target.value)} />
                    </div>

                    <div className='px-2 py-2'>
                        <div className='flex gap-1 items-center'>
                            <input type='radio' id='repoTypePublic' name='repoType' value='Public' defaultChecked />
                            <label className="text-gray-700 text-base font-semibold" htmlFor="repoTypePublic">Public</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type='radio' id='repoTypePrivate' name='repoType' value='Private' />
                            <label className="text-gray-700 text-base font-semibold" htmlFor="repoTypePrivate">Private</label>
                        </div>
                    </div>

                    {error && <p className="text-sm text-orange-700 font-mono ml-2">{error}</p>}

                    <motion.button
                        className="bg-blue-400 text-white rounded-md px-2 py-[2px] hover:bg-blue-500 flex items-center gap-1 m-auto"
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={handleCreateRepo}
                        disabled={!repoName.isValid}
                    >
                        Create repository
                    </motion.button>
                </div>
            </OuterModal>
        </>
    )
}

export default CreateRepoModal
