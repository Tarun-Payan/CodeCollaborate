import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import avtar from "../assets/avtar.jpg"
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Loader } from 'lucide-react'

const UserComponent = ({ userId, closeModal }) => {
    const { getS3ObjectUrl, authUser, followUnfollow } = useAuthStore()

    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [profilePicUrl, setProfilePicUrl] = useState("")
    const [isFollow, setIsFollow] = useState(false)

    const [followLoader, setfollowLoader] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/get-users-follow-unfollow-data`, { params: { followId: userId }, withCredentials: true })
                setName(response.data.name)
                setUsername(response.data.username)
                setIsFollow(response.data.isFollowed)

                const url = await getS3ObjectUrl(response.data.profilePic)
                setProfilePicUrl(url)
            } catch (error) {
                console.log(error)
            }
        })();
    }, [])

    const handleFollowUnfollow = () => {
        followUnfollow(setfollowLoader, setIsFollow, isFollow, userId)
    }

    return (
        <div className='w-full hover:bg-[#f3f3f394] py-1 px-3 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <Link to={username ? `/${username}` : '#'} className='w-[35px] h-[35px] min-w-[44px] min-h-[44px]' onClick={closeModal}>
                    <img src={profilePicUrl ? profilePicUrl : avtar} alt="ProfileImage" className='rounded-full object-cover object-center h-full w-full' />
                </Link>
                <div className='flex flex-col '>
                    <Link to={username ? `/${username}` : '#'} className='text-xs font-semibold leading-3' onClick={closeModal}>{name}</Link>
                    <p className='text-xs text-gray-600'>{username}</p>
                </div>
            </div>

            {/* Follow button - show if login userid and userId are not same */}
            {authUser?._id != userId && <motion.button
                className="bg-[#d2d3d3b0] py-[5px] text-sm rounded-md font-sans w-[100px]"
                whileHover={{
                    scale: 1.03
                }}
                whileTap={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => handleFollowUnfollow()}
                disabled={followLoader}
            >
                {followLoader ?
                    <Loader size={18} strokeWidth={1.75} className='animate-spin m-auto' />
                    :
                    <span>{isFollow ? "Unfollow" : "Follow"}</span>
                }
            </motion.button>}
        </div>
    )
}

export default UserComponent
