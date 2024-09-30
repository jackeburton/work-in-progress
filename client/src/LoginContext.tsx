import axios from 'axios'
import { createContext, useContext } from 'react'
import { LoginPayload } from './types/UserInfo'
import { useQuery } from '@tanstack/react-query'

axios.defaults.withCredentials = true

const fetchLoginPayload = async () => {
    const response = await axios.get('http://localhost:3000/api/newme')
    return response.data
}
const LoginContext = createContext<null | LoginPayload>(null)

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const { error, data } = useQuery({
        queryKey: ['getLoginPayload'],
        queryFn: fetchLoginPayload,
    })
    return <LoginContext.Provider value={data}>{error ? <div>error logging in</div> : children}</LoginContext.Provider>
}

export const checkLogin = () => {
    const context = useContext(LoginContext)
    return context !== undefined
}

export const useLogin = () => {
    const context = useContext(LoginContext)
    if (!context) {
        throw new Error('only to be used when user is guaranteed to be logged in')
    }
    return context
}
