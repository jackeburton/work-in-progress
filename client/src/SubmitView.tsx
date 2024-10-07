import { useEffect, useState } from 'react'
import { SubmittingSubmission } from './types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useLogin } from './LoginContext'

const submit = async (submission: SubmittingSubmission) => {
    const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/submit',
        data: {
            userId: submission.userId,
            content: submission.content,
        },
    })
    return response.data
}

type Props = {
    colour: string
}

function SubmitView({ colour }: Props) {
    const { user } = useLogin()
    const [submissionSent, setSubmissionSent] = useState(false)
    const [submission, setSubmission] = useState<SubmittingSubmission>({ userId: user.id, content: '' })
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
        <div style={{ backgroundColor: colour }}>
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
