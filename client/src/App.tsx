import { Routes, Route } from 'react-router-dom'
import SubmissionView from './SubmissionView'
import ReviewView from './ReviewView'
import SubmitView from './SubmitView'
import LoginGoogle from './LoginGoogle'
import LoggedIn from './LoggedIn'
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
    if (isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<LoggedIn />}>
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
