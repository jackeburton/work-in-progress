import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Submission, SubmissionWithReviews, User } from './types/UserInfo'
import SubmissionView from './SubmissionView'
import ReviewView from './ReviewView'
import SubmitView from './SubmitView'

axios.defaults.withCredentials = true

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
const fetchUserDetails = async () => {
    const response = await axios.get('http://localhost:3000/api/me')
    return { id: response.data.userId, username: response.data.name, email: response.data.email } as User
}
const getUserInfoByData = async (user: User | undefined) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/user/' + user?.id,
    })
    return response.data
}
const getSubmissionsToReview = async (user: User | undefined) => {
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/submissionsToReview/' + user?.id,
    })
    return response.data
}

export default function App() {
    const [userEmail, setUserEmail] = useState<null | string>(null)
    const [loginError, setLoginError] = useState<null | string>(null)
    const [loggedInUser, setLoggedInUser] = useState<null | User>(null)
    const [submissionsWithReviews, setSubmissionsWithReviews] = useState<SubmissionWithReviews[] | null>(null)
    const [submissionsToReview, setSubmissionsToReview] = useState<Submission[] | null>(null)
    const { error, data, refetch } = useQuery({
        queryKey: ['fetchUserDetails'],
        queryFn: fetchUserDetails,
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
        if (data) {
            console.log(data)
            setLoggedInUser(data)
        }
        refetchLogin()
        refetchSubmissions()
    }, [data])
    useEffect(() => {
        if (loginData) {
            setSubmissionsWithReviews(loginData.SubmissionsWithReviews)
        }
    }, [loginData])
    useEffect(() => {
        if (submissionsData) {
            setSubmissionsToReview(submissionsData)
        }
    }, [submissionsData])
    useEffect(() => {
        if (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response ? error.response.data.message : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
        if (loginDataError) {
            const errorMessage =
                axios.isAxiosError(loginDataError) && loginDataError.response
                    ? loginDataError.response.data.message
                    : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
        if (submissionsDataError) {
            const errorMessage =
                axios.isAxiosError(submissionsDataError) && submissionsDataError.response
                    ? submissionsDataError.response.data.message
                    : 'An unknown error occurred'
            setLoginError(errorMessage)
        }
    }, [error, loginDataError, submissionsDataError])
    useEffect(() => {
        refetch()
    }, [])

    if (loggedInUser && submissionsWithReviews && submissionsToReview) {
        return (
            <Routes>
                <Route path="/" element={<LoggedIn />} />
                <Route path="/submit" element={<SubmitView userId={loggedInUser.id}></SubmitView>} />
                <Route
                    path="/submissions"
                    element={<SubmissionView submissionsWithReviews={submissionsWithReviews}></SubmissionView>}
                />
                <Route
                    path="/review"
                    element={
                        <ReviewView userId={loggedInUser.id} submissionsToReview={submissionsToReview}></ReviewView>
                    }
                />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route
                path="/*"
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
            <LoginGoogle></LoginGoogle>
        </div>
    )
}

const LoginGoogle = () => {
    const googleLogin = () => {
        window.open('http://localhost:3000/api/google', '_self')
    }

    return (
        <div>
            <h2>Login with Google</h2>
            <button onClick={googleLogin}>Login with Google</button>
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
