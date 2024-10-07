import { Routes, Route } from 'react-router-dom'
import ReviewView from './reviewView/ReviewView'
import SubmitView from './submitView/SubmitView'
import LoginGoogle from './LoginGoogle'
import Header from './Header'
import { checkLogin, LoginProvider } from './LoginContext'
import { colours } from './types/Colours'
import SubmissionView from './SubmissionView'

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
        { path: '/submit', label: 'Submit content', colour: colours[0] },
        { path: '/submissions', label: 'View submissions', colour: colours[1] },
        { path: '/review', label: 'Review submissions', colour: colours[2] },
    ]
    if (isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<Header pathInfos={pathInfos} />}>
                    <Route path="/submit" element={<SubmitView colour={colours[0]} />} />
                    <Route path="/submissions" element={<SubmissionView colour={colours[1]} />} />
                    <Route path="/review" element={<ReviewView colour={colours[2]} />} />
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
