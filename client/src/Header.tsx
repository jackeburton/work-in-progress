import { Outlet, useLocation } from 'react-router-dom'
import HeaderItem from './HeaderItem'

type PathInfo = {
    path: string
    label: string
    colour: string
}

type HeaderProps = { pathInfos: PathInfo[] }

function Header({ pathInfos }: HeaderProps) {
    const { pathname } = useLocation()
    console.log(pathname)
    return (
        <div>
            <div className="ignore-click" style={{ position: 'relative', width: '100%' }}>
                {pathInfos.map((pathInfo, index) =>
                    pathInfo.path === pathname ? (
                        <HeaderItem
                            key={index}
                            selected={true}
                            label={pathInfo.label}
                            path={pathInfo.path}
                            colour={pathInfo.colour}
                        />
                    ) : (
                        <HeaderItem
                            key={index}
                            selected={false}
                            label={pathInfo.label}
                            path={pathInfo.path}
                            colour={pathInfo.colour}
                        />
                    )
                )}
            </div>

            <Outlet />
        </div>
    )
}

export default Header
