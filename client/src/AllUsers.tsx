import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Submissions from './Submissions'

type User = {
    id: number
    username: string
    email: string
    created_at: string
}

const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/users')
    console.log(response)
    return response.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
    }))
}

function AllUsers() {
    const { isPending, error, data } = useQuery({
        queryKey: ['fetchUsers'],
        queryFn: fetchUsers,
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div>
            {data.map((user: User) => (
                <div key={user.id}>
                    <span>
                        {user.email} : {user.username}
                        <Submissions userId={user.id} />
                    </span>
                </div>
            ))}
        </div>
    )
}

export default AllUsers
