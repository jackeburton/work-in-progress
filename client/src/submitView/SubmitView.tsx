import { useEffect, useRef, useState } from 'react'
import { SubmittingSubmission } from '../types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useLogin } from '../LoginContext'
import { randomColour } from '../utils'

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
    const [submissionColour, _] = useState(randomColour())
    const [submissionSent, setSubmissionSent] = useState(false)
    const [submission, setSubmission] = useState<SubmittingSubmission>({ userId: user.id, content: '' })
    const { error, data, refetch } = useQuery({
        queryKey: ['submit'],
        queryFn: () => submit(submission),
        enabled: false,
    })
    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
        const newContent = e.currentTarget.textContent ? e.currentTarget.textContent : ''
        setSubmission({
            ...submission,
            content: newContent,
        })
    }
    const clearAll = () => {
        setSubmissionSent(false)
        setSubmission({ userId: user.id, content: '' })
    }
    useEffect(() => {
        if (data) {
            setSubmissionSent(true)
        }
    }, [data])

    if (error) {
        return <div>error submitting</div>
    }
    if (submissionSent) {
        return (
            <div>
                <div
                    style={{
                        fontFamily: 'Courier prime',
                        fontWeight: '400',
                        padding: '0px 30px 0px',
                        backgroundImage: `repeating-linear-gradient(${submissionColour}, ${submissionColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                        minHeight: '200px',
                    }}
                >
                    Thanks for submitting, please come back soon to see if you've had any reviews
                </div>
                <button onClick={clearAll}>submit another</button>
            </div>
        )
    }
    return (
        <div style={{ backgroundColor: colour, height: '1000px', fontFamily: 'Courier prime', fontWeight: '400' }}>
            <div style={{ height: '40px' }}></div>
            <div
                style={{
                    backgroundColor: submissionColour,
                    boxShadow: '10px 10px 5px',
                    width: '590px',
                    margin: 'auto',
                }}
            >
                <div style={{ height: '40px' }}></div>
                <div
                    style={{
                        padding: '0px 30px 0px',
                        backgroundImage: `repeating-linear-gradient(${submissionColour}, ${submissionColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                        minHeight: '200px',
                    }}
                >
                    <span
                        role="textbox"
                        contentEditable={true}
                        onInput={handleInput}
                        style={{
                            backgroundColor: 'transparent',
                            border: '0px none',
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            resize: 'none',
                            minHeight: '40px',
                            lineHeight: '20px',
                            outline: 'none',
                        }}
                    ></span>
                </div>
                <button
                    disabled={submissionSent}
                    onClick={() => {
                        refetch()
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default SubmitView
