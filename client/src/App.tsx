import { Routes, Route } from 'react-router-dom'
import SubmissionView from './SubmissionView'
import ReviewView from './reviewView/ReviewView'
import SubmitView from './SubmitView'
import LoginGoogle from './LoginGoogle'
import Header from './Header'
import { checkLogin, LoginProvider } from './LoginContext'

export default function App() {
    return (
        <LoginProvider>
            <AppRoutes />
        </LoginProvider>
    )
}

export function AppRoutes() {
    const isLoggedIn = checkLogin()
    const pathInfos = [
        { path: '/submit', label: 'Submit content' },
        { path: '/submissions', label: 'View submissions' },
        { path: '/review', label: 'Review submissions' },
    ]
    if (isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<Header pathInfos={pathInfos} />}>
                    <Route path="/submit" element={<SubmitView />} />
                    <Route path="/submissions" element={<SubmissionView />} />
                    <Route path="/review" element={<ReviewView />} />
                </Route>
            </Routes>
        )
    } else
        return (
            <Routes>
                <Route path="/*" element={<LoginGoogle></LoginGoogle>} />
            </Routes>
        )
}
