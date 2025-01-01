import { useEffect, useState, useCallback } from 'react'
import OuterModal from './OuterModal'
import { X } from 'lucide-react'
import UserComponent from '../components/UserComponent'
import { useAuthStore } from '../store/useAuthStore'
import axios from 'axios'

const FollowUnFollowModal = ({ type, closeModal }) => {
    const { selectedUser } = useAuthStore()

    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])

    useEffect(() => {
        (async () => {
            try {
                if (type == "Followers") {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/${selectedUser._id}/followers`);
                    setFollowers(response.data)
                }
                else {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/${selectedUser._id}/followings`);
                    setFollowings(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        })()
    }, [])


    const ShowSelectedUsers = useCallback(() => {
        if (type == "Followers" && followers) {
            return followers.map(userId => <UserComponent key={userId} userId={userId} closeModal={closeModal} />)
        }
        else if(followings) {
            return followings.map(userId => <UserComponent key={userId} userId={userId} closeModal={closeModal} />)
        }
    }, [followers, followings])

    return (
        <OuterModal closeModal={closeModal}>
            <div className='ModalHeader py-2 px-3 relative w-full flex'>
                <h4 className="modal-title m-auto">{type}</h4>
                <button type="button" className="close" onClick={closeModal}>
                    <X />
                </button>
            </div>

            <div className='h-[1px] w-full bg-gray-300'></div>

            <div className='w-full h-full'>
                {/* <UserComponent closeModal={closeModal}/> */}
                {selectedUser && <ShowSelectedUsers />}
            </div>
        </OuterModal>
    )
}

export default FollowUnFollowModal
