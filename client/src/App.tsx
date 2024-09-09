import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Submission, SubmissionWithReviews, User } from './types/UserInfo'
import SubmissionView from './SubmissionView'
import ReviewView from './ReviewView'

const fetchUserByEmail = async (userEmail: string | null) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/users',
        params: {
            email: userEmail,
        },
    })
    console.log(response)
    return response.data
}
const getUserInfoByData = async (user: User | null) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/user/' + user?.id,
    })
    console.log('getting user data')
    console.log(response)
    return response.data
}
const getSubmissionsToReview = async (user: User | null) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/submissionsToReview/' + user?.id,
    })
    console.log('getting submission data')
    console.log(response)
    return response.data
}

export default function App() {
    const [userEmail, setUserEmail] = useState<null | string>(null)
    const [loginError, setLoginError] = useState<null | string>(null)
    const [loggedInUser, setLoggedInUser] = useState<null | User>(null)
    const [submissionsWithReviews, setSubmissionsWithReviews] = useState<SubmissionWithReviews[] | null>(null)
    const [submissionsToReview, setSubmissionsToReview] = useState<Submission[] | null>(null)
    const { error, data, refetch } = useQuery({
        queryKey: ['fetchUserByEmail'],
        queryFn: () => fetchUserByEmail(userEmail),
        enabled: false,
    })
    const {
        error: loginDataError,
        data: loginData,
        refetch: refetchLogin,
    } = useQuery({
        queryKey: ['getUserInfoByData'],
        queryFn: () => getUserInfoByData(data),
        enabled: false,
    })
    const {
        error: submissionsDataError,
        data: submissionsData,
        refetch: refetchSubmissions,
    } = useQuery({
        queryKey: ['getSubmissionsToReview'],
        queryFn: () => getSubmissionsToReview(data),
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
        refetchLogin()
        refetchSubmissions()
    }, [data])
    useEffect(() => {
        if (loginData) {
            console.log('login data present')
            console.log(loggedInUser)
            console.log(loginData)
            setSubmissionsWithReviews(loginData.SubmissionsWithReviews)
        }
    }, [loginData])
    useEffect(() => {
        if (submissionsData) {
            console.log('submissions to reivew')
            console.log(submissionsData)
            setSubmissionsToReview(submissionsData)
        }
    }, [submissionsData])
    useEffect(() => {
        if (error) {
            console.log(error)
            const errorMessage =
                axios.isAxiosError(error) && error.response ? error.response.data.message : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
        if (loginDataError) {
            console.log(loginDataError)
            const errorMessage =
                axios.isAxiosError(loginDataError) && loginDataError.response
                    ? loginDataError.response.data.message
                    : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
        if (submissionsDataError) {
            console.log(submissionsDataError)
            const errorMessage =
                axios.isAxiosError(submissionsDataError) && submissionsDataError.response
                    ? submissionsDataError.response.data.message
                    : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
    }, [error, loginDataError, submissionsDataError])

    if (loggedInUser && submissionsWithReviews && submissionsToReview) {
        return (
            <Routes>
                <Route path="/" element={<LoggedIn />} />
                <Route path="/submit" element={<div>todo</div>} />
                <Route
                    path="/submissions"
                    element={<SubmissionView submissionsWithReviews={submissionsWithReviews}></SubmissionView>}
                />
                <Route path="/review" element={<ReviewView submissionsToReview={submissionsToReview}></ReviewView>} />
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

function LoggedIn() {
    return (
        <div>
            <Link to="/submit">Submit content</Link>
            <Link to="/submissions">View submissions</Link>
            <Link to="/review">Review submissions</Link>
        </div>
    )
}
