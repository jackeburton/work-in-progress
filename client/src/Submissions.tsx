import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchSubmissions = async (userId: number) => {
    const response = await axios.get(`http://localhost:3000/users/${userId}/submissions`)
    console.log(response)
    return response.data.map((submission: any) => ({
        id: submission.id,
        content: submission.content,
    }))
}

type SubmissionsProps = {
    userId: number
}

type Submission = {
    id: number
    content: string
}

function Submissions({ userId }: SubmissionsProps) {
    const { isPending, error, data } = useQuery({
        queryKey: ['fetchSubmissions'],
        queryFn: () => fetchSubmissions(userId),
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            {data.map((submission: Submission) => (
                <div key={submission.id}>{submission.content}</div>
            ))}
        </>
    )
}

export default Submissions
