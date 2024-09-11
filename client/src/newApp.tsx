import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useReducer, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Submission, SubmissionWithReviews, User } from './types/UserInfo'
import SubmissionView from './SubmissionView'
import ReviewView from './ReviewView'
import SubmitView from './SubmitView'
import LoginGoogle from './LoginGoogle'
import LoggedIn from './LoggedIn'

axios.defaults.withCredentials = true

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
    const [loginError, setLoginError] = useState<boolean>(false)
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
        if (error || loginDataError || submissionsDataError) {
            setLoginError(true)
        }
    }, [error, loginDataError, submissionsDataError])
    useEffect(() => {
        refetch()
    }, [])

    if (loginError) {
        return <div>there was an error logging in</div>
    }

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

    if (loggedInUser) {
        return <div>loading...</div>
    }

    return (
        <Routes>
            <Route path="/*" element={<LoginGoogle></LoginGoogle>} />
        </Routes>
    )
}
