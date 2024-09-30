import { Link, Outlet, useLocation } from 'react-router-dom'

type PathInfo = {
    path: string
    label: string
}

type HeaderProps = { pathInfos: PathInfo[] }

function Header({ pathInfos }: HeaderProps) {
    const { pathname } = useLocation()
    console.log(pathname)
    return (
        <div>
            <div className="ignore-click">
                {pathInfos.map((pathInfo, index) => {
                    if (pathname === pathInfo.path) {
                        return (
                            <Link key={index} to={pathInfo.path}>
                                <div style={{ display: 'inline-block', overflow: 'hidden' }}>
                                    {pathInfo.label}{' '}
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '100%',
                                            transform: 'rotate(50deg)',
                                            display: 'inline-block',
                                            backgroundColor: 'green',
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                </div>
                            </Link>
                        )
                    } else {
                        return (
                            <Link key={index} to={pathInfo.path}>
                                <div style={{ display: 'inline-block', overflow: 'hidden' }}>
                                    {pathInfo.label}{' '}
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '100%',
                                            transform: 'rotate(50deg)',
                                            display: 'inline-block',
                                            backgroundColor: 'green',
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                })}
            </div>

            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header
