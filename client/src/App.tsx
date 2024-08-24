import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Example />
        </QueryClientProvider>
    )
}

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

function Example() {
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
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
                    </span>
                </div>
            ))}
        </div>
    )
}
