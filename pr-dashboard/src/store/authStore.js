import { create } from 'zustand'

const useAuthStore = create((set) => ({
    token: localStorage.getItem('github_token') || null,

    setToken: (token) => {
        localStorage.setItem('github_token', token)
        set({ token })
    },

    logout: () => {
        localStorage.removeItem('github_token')
        set({ token: null })
    }
}))

export default useAuthStore