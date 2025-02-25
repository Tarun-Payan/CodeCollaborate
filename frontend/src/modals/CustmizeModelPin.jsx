import React, { useState, useEffect } from 'react'
import OuterModal from './OuterModal'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { Loader } from 'lucide-react'
import axios from 'axios'

const CustmizeModelPin = ({ closeModal, repositories }) => {
    const [repoPins, setRepoPins] = useState([])
    const [isLoader, setIsLoader] = useState(false)

    useEffect(() => {
        let pins = repositories.repos.map(repo => { return { name: repo.name, pin: repo.pin } })
        setRepoPins(pins)
    }, [repositories.repos])

    const handleChange = (repo) => {
        // console.log(repo)
        let newRepoPins = [...repoPins];
        const index = newRepoPins.findIndex(item => item.name === repo.name);
        newRepoPins[index].pin = !newRepoPins[index].pin;
        setRepoPins(newRepoPins);
    }

    const handleCustomisePins = async (e) => {
        e.preventDefault();
        setIsLoader(true)

        let pins = repositories.repos.map(repo => { return { name: repo.name, pin: repo.pin } })

        if (repoPins.length > 0) {
            for (let i = 0; i < repoPins.length; i++) {
                if (repoPins[i].pin != pins[i].pin) {
                    try{
                        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/manage-pins`, { reponame: repoPins[i].name, pin: repoPins[i].pin }, { withCredentials: true });
                    } catch(err){
                        console.log(err)
                    }
                }
            }
        }

        setIsLoader(false)
        closeModal();
    }

    return (
        <OuterModal closeModal={closeModal}>
            <div className='ModalHeader py-2 px-3 relative w-full flex'>
                <h4 className="modal-title m-auto font-semibold">Customize Pins</h4>
                <button type="button" className="close" onClick={closeModal}>
                    <X />
                </button>
            </div>

            <div className='h-[1px] w-full bg-gray-300'></div>

            <div className='p-2'>
                {repoPins.map((repo) => {
                    return (<div key={repo.name} className='flex gap-2'>
                        <input type='checkbox' value={repo.name} id={repo.name} checked={repo.pin} onChange={() => handleChange(repo)} />
                        <label htmlFor={repo.name}>{repo.name}</label>
                    </div>)
                })}
            </div>

            <div className='px-2'>
                {/* add save and cancle butto */}
                <motion.button
                    className="bg-[#d2d3d4b0] py-[5px] text-sm px-4 rounded-md font-sans w-fit mb-3 mr-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={(e) => handleCustomisePins(e)}
                    disabled={isLoader}
                >
                    {isLoader ?
                        <div className='flex items-center gap-1'>
                            <Loader size={14} strokeWidth={1.75} className='animate-spin' />
                            <span>Loading...</span>
                        </div> :
                        <span>Save</span>
                    }
                </motion.button>

                {/* cancle button */}
                <motion.button
                    className="bg-[#d2d3d4b0] py-[5px] text-sm px-4 rounded-md font-sans w-fit mb-3"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                    }}
                    disabled={isLoader}
                >
                    Cancle
                </motion.button>
            </div>

        </OuterModal>
    )
}

export default CustmizeModelPin
