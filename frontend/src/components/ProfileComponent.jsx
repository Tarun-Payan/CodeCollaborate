import React, { useState, useEffect, useRef } from 'react'
import avatar from "../assets/avtar.jpg"
import { motion } from 'motion/react'
import { UsersRound, Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Loader } from 'lucide-react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileComponent = () => {
    const { username } = useParams();

    const { authUser, updateAuthUser, isAuthenticated, profilePicUrl, selectedUser, selectedUserProfilePicUrl, setSelectedUser } = useAuthStore();
    const [isEdit, setIsEdit] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [editData, setEditData] = useState({ name: '', bio: '' })
    const [isLoader, setIsLoader] = useState(false)

    const fileInputRef = useRef(null)

    useEffect(() => {
        if (isAuthenticated) {
            setEditData({ name: selectedUser?.name, bio: selectedUser?.bio })
            console.log(username)
            if(!username) setSelectedUser(authUser)
        }
    }, [isAuthenticated, selectedUser, authUser])

    // useEffect(() => {
    //     if(isAuthenticated && selectedUser == null){
    //         console.log("Selected User", selectedUser)
    //         setSelectedUser(authUser)
    //     }
    // }, [authUser, isAuthenticated, selectedUser, setSelectedUser])
    

    const handleUploadImage = (e) => {
        // console.log(selectedImage)
        const imageFile = e.target.files[0]

        if (!imageFile) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile)

        fileReader.onload = () => {
            const base64Image = fileReader.result;
            setSelectedImage(base64Image)
            setSelectedImageFile(imageFile)
        }

    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setIsLoader(true)

        try {
            let key = '';

            if (selectedImageFile) {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/getUploadObjectUrl`, { params: { contentType: selectedImageFile.type, key: 'profileImage' } })
                const url = response.data.url
                key = response.data.key

                // upload image on aws s3 bucket
                await axios.put(url, selectedImageFile, {
                    headers: { 'Content-Type': selectedImageFile.type },
                })
            }
            else {
                key = authUser.profilePic
            }

            // if selectedImage is remove means that user want to remove profile image
            if(selectedImage == "remove"){
                key = null
            }

            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/update-profile`, { name: editData.name, bio: editData.bio, profilePicture: key }, { withCredentials: true })

            if(key == null) key = ''
            updateAuthUser(editData.name, editData.bio, key)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoader(false)
            setIsEdit(false)
        }
    }

    return (
        <div className='w-fit p-2 flex flex-col gap-3'>
            <div className='flex flex-col gap-2 w-min'>
                <div className='relative'>
                    <div className='w-[300px] h-[300px]'>
                        <img
                            src={(selectedImage && selectedImage != "remove") ? selectedImage : (selectedUserProfilePicUrl && selectedImage != "remove") ? selectedUserProfilePicUrl : avatar}
                            alt="avatar"
                            className='rounded-full object-cover object-center h-full w-full' />
                    </div>
                    {isEdit && <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                        }}
                        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                    >
                        <SpeedDialAction
                            icon={<Camera />}
                            tooltipTitle="Upload"
                            onClick={() => fileInputRef.current.click()}
                        />

                        {((selectedImage && selectedImage != "remove") || (selectedUserProfilePicUrl && selectedImage != "remove")) && <SpeedDialAction
                            icon={<DeleteIcon />}
                            tooltipTitle="Remove"
                            onClick={() => setSelectedImage("remove")}
                        />}

                        <input
                            type='file'
                            id='avatar-upload'
                            className='hidden'
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => handleUploadImage(e)}
                        />
                    </SpeedDial>}
                </div>
                {!isEdit && <div>
                    {editData.name !== '' && <p className='text-[#1f2328] text-xl leading-4'>{editData.name}</p>}
                    <p className='text-gray-700 font-light text-lg'>{isAuthenticated ? selectedUser?.username : ''}</p>
                    {editData.bio !== '' && <p className='text-[#1f2328] mt-2 text-sm'>{editData.bio}</p>}
                </div>}
            </div>

            {!isEdit ?
                <div>
                    {/* Edit Profile button */}
                    {selectedUser?.username == authUser?.username ? <motion.button
                        className="bg-[#d2d3d3b0] py-[5px] text-sm px-4 rounded-md font-sans w-full mb-3"
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => setIsEdit(true)}
                    >
                        Edit Profile
                    </motion.button>
                    :
                    // follow button
                    <motion.button
                        className="bg-[#d2d3d3b0] py-[5px] text-sm px-4 rounded-md font-sans w-full mb-3"
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        // onClick={() => setIsEdit(true)}
                    >
                        Follow
                    </motion.button>}

                    <div className='flex gap-1 text-sm text-gray-700'>
                        <span className='group flex items-center gap-1 hover:text-blue-800 cursor-pointer' >
                            <UsersRound size={14} strokeWidth={1.75} />
                            <span><span className='text-black group-hover:text-inherit font-semibold'>0</span> followers </span>
                        </span>
                        · <span className='group cursor-pointer hover:text-blue-800'><span className='text-black group-hover:text-inherit font-semibold'>3</span> following</span>
                    </div>
                </div>
                :
                <div>
                    <form className='flex flex-col gap-2 text-sm'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="name" className='text-gray-700 font-light'>Name:</label>
                            <input
                                id="name"
                                type="text"
                                className='w-full px-2 py-1 rounded-md border border-gray-300 outline-blue-400 text-[#1f2328]'
                                value={editData.name}
                                onChange={(e) => setEditData({ name: e.target.value, bio: editData.bio })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='bio' className='text-gray-700 font-light'>Bio:</label>
                            <textarea
                                id="bio"
                                className='w-full px-2 py-1 rounded-md border border-gray-300 outline-blue-400 text-[#1f2328]'
                                value={editData.bio}
                                onChange={(e) => setEditData({ name: editData.name, bio: e.target.value })}
                            />
                        </div>
                        <div>
                            {/* add save and cancle butto */}
                            <motion.button
                                className="bg-[#d2d3d4b0] py-[5px] text-sm px-4 rounded-md font-sans w-fit mb-3 mr-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onClick={(e) => handleUpdateProfile(e)}
                                disabled={isLoader}
                            >
                                {isLoader ?
                                    <div className='flex items-center gap-1'>
                                        <Loader size={14} strokeWidth={1.75} />
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
                                    setEditData({ name: authUser.name, bio: authUser.bio });
                                    setIsEdit(false);
                                    setSelectedImage(null)
                                }}
                                disabled={isLoader}
                            >
                                Cancle
                            </motion.button>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default ProfileComponent
