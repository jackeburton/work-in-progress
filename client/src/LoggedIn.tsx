import { Link, Outlet } from 'react-router-dom'

function LoggedIn() {
    return (
        <div>
            <div className="ignore-click">
                <Link to="/submit">Submit content</Link>
                <Link to="/submissions">View submissions</Link>
                <Link to="/review">Review submissions</Link>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default LoggedIn
