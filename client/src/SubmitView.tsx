import { useEffect, useState } from 'react'
import { SubmittingSubmission } from './types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const submit = async (submission: SubmittingSubmission) => {
    const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/submit',
        data: {
            userId: submission.userId,
            content: submission.content,
        },
    })
    console.log(response)
    return response.data
}

type SubmitviewProps = { userId: number }
function SubmitView({ userId }: SubmitviewProps) {
    const [submissionSent, setSubmissionSent] = useState(false)
    const [submission, setSubmission] = useState<SubmittingSubmission>({ userId: userId, content: '' })
    const { error, data, refetch } = useQuery({
        queryKey: ['submit'],
        queryFn: () => submit(submission),
        enabled: false,
    })
    useEffect(() => {
        if (data) {
            setSubmissionSent(true)
        }
    }, [data])
    if (error) {
        return <div>error submitting</div>
    }
    return (
        <div>
            <textarea
                disabled={submissionSent}
                value={submission.content}
                onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
            />
            <button disabled={submissionSent} onClick={() => refetch()}>
                Submit
            </button>
        </div>
    )
}

export default SubmitView
