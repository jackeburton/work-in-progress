import { useLogin } from '../LoginContext'
import { useReviewCards } from './useReviewCards'
import './reviewViewStyle.css'
import { useEffect } from 'react'
import SubmissionReview from './SubmissionReview'

const getOffset = (): number => {
    return Math.floor(Math.random() * 10)
}

const reviewCoords = [
    { x: 150 + getOffset(), y: 100 + getOffset() },
    { x: 600 + getOffset(), y: 100 + getOffset() },
    { x: 250 + getOffset(), y: 300 + getOffset() },
]

type Props = {
    colour: string
}
function ReviewView({ colour }: Props) {
    const { submissionsToReview, user } = useLogin()
    if (submissionsToReview === null) {
        return <div>you have no new submissions to review</div>
    }
    const { reviewCards, removeId, setIdSelected, setNoneSelected } = useReviewCards(submissionsToReview)

    useEffect(() => {
        console.log(reviewCards)
    }, [reviewCards])

    return (
        <div style={{ backgroundColor: colour, height: '1000px' }}>
            {reviewCards
                .filter((submission) => submission.reviewSent === false)
                .map((submission, index) => (
                    <SubmissionReview
                        key={submission.id}
                        reviewCard={submission}
                        coords={reviewCoords[index]}
                        anySelected={reviewCards.some((reviewCard) => reviewCard.selected)}
                        userId={user.id}
                        handleDeselectAll={setNoneSelected}
                        handleSelected={() => setIdSelected(submission.id)}
                        handleReviewSentUpdate={() => {
                            removeId(submission.id)
                        }}
                    />
                ))}
        </div>
    )
}

export default ReviewView
