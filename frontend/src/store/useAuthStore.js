import { create } from 'zustand'
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthenticated: false,
    profilePicUrl: null,

    selectedUser: null,
    selectedUserProfilePicUrl: null,

    setSelectedUser: async (user) => {
        const url = await get().getS3ObjectUrl(user?.profilePic)
        set({ selectedUser: user, selectedUserProfilePicUrl: url })
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

            if(user.profilePic !== ''){
                const url = await get().getS3ObjectUrl(user.profilePic)
                set({ profilePicUrl: url })
            }

            navigate(navigateLinkIfAuth)
        } catch (error) {
            //console.log(error);
            navigate(navigateLinkIfNotAuth)
        } finally {
            setIsLoading(false)
            console.log(get().authUser, get().isAuthenticated)
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
}))