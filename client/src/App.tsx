import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

const fetchUserByEmail = async (userEmail: string | null) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/users',
        params: {
            email: userEmail,
        },
    })
    return response.data
}

type User = {
    id: number
    username: string
    email: string
}

export default function App() {
    const [userEmail, setUserEmail] = useState<null | string>(null)
    const [loginError, setLoginError] = useState<null | string>(null)
    const [loggedInUser, setLoggedInUser] = useState<null | User>(null)
    const { error, data, refetch } = useQuery({
        queryKey: ['fetchUserByEmail'],
        queryFn: () => fetchUserByEmail(userEmail),
        enabled: false,
    })

    const handleUserUpdate = (userString: string) => {
        setUserEmail(userString)
    }

    const handleLogin = () => {
        refetch()
    }

    useEffect(() => {
        console.log(data)
        if (data) {
            console.log(data)
            setLoggedInUser(data)
        }
    }, [data])
    useEffect(() => {
        if (error) {
            console.log(error)
            const errorMessage =
                axios.isAxiosError(error) && error.response ? error.response.data.message : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
    }, [error])

    if (loggedInUser) {
        return (
            <Routes>
                <Route path="/" element={<div>logged in as {loggedInUser.email}</div>} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Login
                        handleLogin={handleLogin}
                        handleUserUpdate={handleUserUpdate}
                        user={userEmail}
                        loginError={loginError}
                    />
                }
            />
        </Routes>
    )
}

type LoginProps = {
    handleLogin: () => void
    handleUserUpdate: (userString: string) => void
    user: null | string
    loginError: null | string
}

function Login({ handleLogin, handleUserUpdate, user, loginError }: LoginProps) {
    return (
        <div>
            login
            {loginError ? <div>{loginError}</div> : <div></div>}
            <input onChange={(e) => handleUserUpdate(e.target.value)} value={user ?? ''}></input>
            {user === null ? <div></div> : <button onClick={handleLogin}></button>}
        </div>
    )
}
