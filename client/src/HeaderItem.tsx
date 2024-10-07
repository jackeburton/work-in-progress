import { Link } from 'react-router-dom'

type Props = {
    selected: boolean
    label: string
    path: string
    colour: string
}
function HeaderItem({ selected, label, path, colour }: Props) {
    let style = {}
    if (selected) {
        style = {
            display: 'inline-block',
            borderTop: `2px solid ${colour}`,
            borderLeft: `2px solid ${colour}`,
            borderRight: `2px solid ${colour}`,
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            marginRight: '7px',
            background: `${colour}`,
            fontFamily: 'Courier prime',
            fontWeight: '400',
            padding: '5px',
            paddingTop: '10px',
        }
    } else {
        style = {
            display: 'inline-block',
            borderTop: `2px solid ${colour}`,
            borderLeft: `2px solid ${colour}`,
            borderRight: `2px solid ${colour}`,
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            marginRight: '7px',
            background: `${colour}`,
            fontFamily: 'Courier prime',
            fontWeight: '400',

            padding: '5px',

            paddingTop: '5px',
        }
    }
    return (
        <Link to={path}>
            <div style={style}>{label}</div>
        </Link>
    )
}

export default HeaderItem
