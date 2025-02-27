import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

import OuterModal from './OuterModal'
import { X } from 'lucide-react'
import ReactLoading from 'react-loading';

import Select from 'react-select'
import { Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom'

const RepoPermissionModal = ({ closeModal, permission, type }) => {
    // const options = [
    //     { value: 'chocolate', label: 'Chocolate' },
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' }
    // ]
    const { username, reponame } = useParams();
    const { setRepoPermissions } = useAuthStore()

    const [pickedUser, setPickedUser] = useState("")
    const [branch, setBranch] = useState("")
    const [access, setAccess] = useState("RW+")
    const [error, setError] = useState("")
    const [options, setOptions] = useState([])
    const [branches, setBranches] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (type == "update") {
            setPickedUser(permission.username)
            setBranch(permission.branch)
            setAccess(permission.access)
        }

        (async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/getAllUsers`)
                setOptions(response.data.allUsers)

                // get branches
                const branchesResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/get-repos-branches`, { params: { username, repo: reponame } })
                setBranches(branchesResponse.data.branches)
            } catch (error) {
                console.log(error)
            } finally{
                setIsLoading(false)
            }
        })()
    }, [])

    const handlePermission = async () => {
        // console.log("Handle Permission")
        if (pickedUser === "") {
            setError("User not selected")
            return;
        }
        setError("")

        try{
            setIsLoading(true)
            // console.log(pickedUser, branch, access)

            if(type == "add"){
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/updateRepoPermission`, { reponame: reponame, permission: { username: pickedUser, access, branch}, type }, { withCredentials: true })
            } else{
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/updateRepoPermission`, { reponame: reponame, permission, type, updatedPermission: { username: pickedUser, access, branch} }, { withCredentials: true })
            }

            
            setRepoPermissions(reponame)
            closeModal();
        } catch(error){
            console.log(error)
            setError(error.messange)
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <OuterModal closeModal={closeModal}>
            {isLoading &&
                <ReactLoading
                    type={"bubbles"}
                    color={"#86ad8a"}
                    height={"64px"}
                    width={"64px"}
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
                />
            }
            <div className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"} h-full`}>
                <div className='ModalHeader py-2 px-3 relative w-full flex'>
                    <h4 className="modal-title m-auto font-semibold">{type == "add" ? "Add new permission" : "Update permission"}</h4>
                    <button type="button" className="close" onClick={closeModal}>
                        <X />
                    </button>
                </div>

                <div className='h-[1px] w-full bg-gray-300'></div>

                <div className='h-[calc(100%-50px)] overflow-y-auto scrollbar-hide'>
                    <div className='px-2 py-2'>
                        <h1 className='text-gray-600 text-lg font-semibold'>Select User</h1>
                        <Select
                            options={options}
                            isClearable={true}
                            isSearchable={true}
                            isDisabled={type == "update" ? true : false}
                            value={(options.length != 0) ? options[options.findIndex((x) => x.value === pickedUser)] : null}
                            onChange={(option) => setPickedUser(option.value)}
                        />

                        <h1 className='text-gray-600 text-lg font-semibold mt-2'>Select Branch</h1>
                        <div className='flex flex-wrap gap-2 text-gray-400 max-w-[350px]'>
                            <div className='flex gap-1'>
                                <input
                                    type="radio"
                                    name='branch'
                                    id="all"
                                    value=""
                                    checked={branch === ""}
                                    onChange={() => setBranch("")}
                                />
                                <label htmlFor="all">All</label>
                            </div>
                            {branches.map(element => <div key={element} className='flex gap-1'>
                                    <input
                                        type="radio"
                                        name='branch'
                                        id={element}
                                        value={element}
                                        checked={branch === element}
                                        onChange={() => setBranch(element)}
                                    />
                                    <label htmlFor={element}>{element}</label>
                                </div>
                            )}  
                        </div>

                        <h1 className='text-gray-600 text-lg font-semibold mt-2'>Select Access Level</h1>
                        <div className='flex flex-wrap gap-2 text-gray-400 max-w-[350px]'>
                            <div className='flex gap-1'>
                                <input
                                    type="radio"
                                    name='access-level'
                                    id="RW+"
                                    value="RW+"
                                    checked={access && access === "RW+"}
                                    onChange={() => setAccess("RW+")}
                                />
                                <label htmlFor='RW+'>Full</label>
                            </div>
                            <div className='flex gap-1'>
                                <input
                                    type="radio"
                                    name='access-level'
                                    id="RW"
                                    value="RW"
                                    checked={access && access === "RW"}
                                    onChange={() => setAccess("RW")}
                                />
                                <label htmlFor='RW'>Read & Write</label>
                            </div>
                            <div className='flex gap-1'>
                                <input
                                    type="radio"
                                    name='access-level'
                                    id="R"
                                    value="R"
                                    checked={access && access === "R"}
                                    onChange={() => setAccess("R")}
                                />
                                <label htmlFor='R'>Read Only</label>
                            </div>
                        </div>

                        <p className='my-2 text-xs text-red-500'>{error}</p>

                        <div className='mt-2 m-auto w-fit'>
                            <Button variant="outlined" size="small" onClick={handlePermission} disabled={!pickedUser ? true : false}>{type == "add" ? "Add" : "Update"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </OuterModal>
    )
}

export default RepoPermissionModal
