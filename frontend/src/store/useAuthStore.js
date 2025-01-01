import { create } from 'zustand'
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthenticated: false,
    profilePicUrl: null,

    selectedUser: null,
    selectedUserProfilePicUrl: null,
    followings: 0,
    followers: 0,

    setSelectedUser: async (user) => {
        set({ selectedUser: user })
        get().updateSelectedUserProfilePicUrl(user?.profilePic)
    },

    updateSelectedUserProfilePicUrl: async (profilePicKey) =>{
        const url = await get().getS3ObjectUrl(profilePicKey)
        set({ selectedUserProfilePicUrl: url })
    },

    updateAuthUser: async (name, bio, profilePic) => {
        const url = await get().getS3ObjectUrl(profilePic)
        set({ authUser: { ...get().authUser, name, bio }, profilePicUrl: url });
    },

    checkAuth: async (setIsLoading, navigate, navigateLinkIfAuth, navigateLinkIfNotAuth) => {
        try {
            setIsLoading(true)
            if (get().isAuthenticated) return navigate(navigateLinkIfAuth)

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/check-auth`, { withCredentials: true })
            const user = response.data.user

            set({ authUser: user })
            set({ isAuthenticated: true })

            if (user.profilePic !== '') {
                const url = await get().getS3ObjectUrl(user.profilePic)
                set({ profilePicUrl: url })
            }

            navigate(navigateLinkIfAuth)
        } catch (error) {
            //console.log(error);
            navigate(navigateLinkIfNotAuth)
        } finally {
            setIsLoading(false)
        }
    },

    getS3ObjectUrl: async (key) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/getimageurl`, { params: { key: key } })
            return response.data.url;
        } catch (error) {
            console.log(error.message)
        }
    },

    followUnfollow: async (setfollowLoader, setIsFollow, isFollow, userId) => {
        try {
            setfollowLoader(true)
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/follow-unfollow`, { followId: userId }, { withCredentials: true })
            setIsFollow(!isFollow)
            get().setFollowersFollowings()
        } catch (error) {
            console.log(error)
        } finally {
            setfollowLoader(false)
        }
    },

    setFollowersFollowings: async () => {
        try{
            const response2 = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/stat`, { params: { userId: get().selectedUser._id } })
            set({ followers: response2.data.followerCount })
            set({ followings: response2.data.followingCount })
        } catch(error) {
            console.log(error)
        }
    }
}))