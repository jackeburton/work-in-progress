import { useEffect, useRef, useState } from 'react'
import { Submission, SubmittingReview } from './types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Draggable from 'react-draggable' // The default

const submitReview = async (review: SubmittingReview) => {
    const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/review',
        data: {
            userId: review.userId,
            submissionId: review.submissionId,
            content: review.content,
        },
    })
    console.log(response)
    return response.data
}

type ReviewViewProps = { submissionsToReview: Submission[] | null; userId: number }
function ReviewView({ submissionsToReview, userId }: ReviewViewProps) {
    if (submissionsToReview === null) {
        return <div>you have no new submissions to review</div>
    } else {
        return (
            <div>
                {submissionsToReview.map((submission) => (
                    <SubmissionReview
                        key={submission.id}
                        submissionToReview={submission}
                        userId={userId}
                    ></SubmissionReview>
                ))}
            </div>
        )
    }
}

export default ReviewView

type SubmissionReviewProps = { submissionToReview: Submission; userId: number }
function SubmissionReview({ submissionToReview, userId }: SubmissionReviewProps) {
    const nodeRef = useRef(null)
    const [reviewSent, setReviewSent] = useState(false)
    const [review, setReview] = useState<SubmittingReview>({ userId, content: '', submissionId: submissionToReview.id })
    const { error, data, refetch } = useQuery({
        queryKey: ['submitReview', review.submissionId],
        queryFn: () => submitReview(review),
        enabled: false,
    })

    useEffect(() => {
        if (data) {
            setReviewSent(true)
        }
    }, [data])

    if (error) {
        return <div>error submitting review</div>
    }

    return (
        <Draggable nodeRef={nodeRef}>
            <div className="border-4 w-96" ref={nodeRef}>
                <h1>{submissionToReview.content}</h1>
                <textarea
                    disabled={reviewSent}
                    value={review.content}
                    onChange={(e) => setReview({ ...review, content: e.target.value })}
                />
                <button disabled={reviewSent} onClick={() => refetch()}>
                    Submit review
                </button>
            </div>
        </Draggable>
    )
}
