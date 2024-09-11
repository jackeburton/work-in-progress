import { Link, Outlet } from 'react-router-dom'

function LoggedIn() {
    return (
        <div>
            <Link to="/submit">Submit content</Link>
            <Link to="/submissions">View submissions</Link>
            <Link to="/review">Review submissions</Link>
            <Outlet />
        </div>
    )
}

export default LoggedIn
