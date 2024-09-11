import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoginPayload } from './types/UserInfo'
import SubmissionView from './SubmissionView'
import ReviewView from './ReviewView'
import SubmitView from './SubmitView'
import LoginGoogle from './LoginGoogle'
import LoggedIn from './LoggedIn'

axios.defaults.withCredentials = true

const fetchLoginPayload = async () => {
    const response = await axios.get('http://localhost:3000/api/newme')
    return response.data
}

export default function App() {
    const [loginPayload, setLoginPayload] = useState<null | LoginPayload>(null)
    const { error, data, refetch } = useQuery({
        queryKey: ['getLoginPayload'],
        queryFn: fetchLoginPayload,
        enabled: false,
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setLoginPayload(data)
        }
    }, [data])
    useEffect(() => {
        refetch()
    }, [loginPayload])

    if (error) {
        return <div>error logging in</div>
    } else if (loginPayload) {
        return (
            <Routes>
                <Route path="/" element={<LoggedIn />} />
                <Route path="/submit" element={<SubmitView userId={loginPayload.user.id}></SubmitView>} />
                <Route
                    path="/submissions"
                    element={
                        <SubmissionView submissionsWithReviews={loginPayload.submissionsWithReviews}></SubmissionView>
                    }
                />
                <Route
                    path="/review"
                    element={
                        <ReviewView
                            userId={loginPayload.user.id}
                            submissionsToReview={loginPayload.submissionsToReview}
                        ></ReviewView>
                    }
                />
            </Routes>
        )
    } else
        return (
            <Routes>
                <Route path="/*" element={<LoginGoogle></LoginGoogle>} />
            </Routes>
        )
}
