import { useEffect, useRef, useState } from 'react'
import { ReviewCard, SubmittingReview } from './types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Draggable from 'react-draggable'
import { colours } from './types/Colours'
import { useLogin } from './LoginContext'

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
    return response.data
}

function randomColour(seed: number): string {
    var x = Math.sin(seed) * 10000
    var random = x - Math.floor(x)
    return colours[Math.floor(random * colours.length)]
}

const getOffset = (): number => {
    return Math.floor(Math.random() * 10)
}

const reviewCoords = [
    { x: 150 + getOffset(), y: 100 + getOffset() },
    { x: 600 + getOffset(), y: 100 + getOffset() },
    { x: 250 + getOffset(), y: 300 + getOffset() },
]

function ReviewView() {
    const { submissionsToReview, user } = useLogin()
    if (submissionsToReview === null) {
        return <div>you have no new submissions to review</div>
    }
    const [reviewCards, setReviewCards] = useState<ReviewCard[]>(
        submissionsToReview.map((submission) => ({
            ...submission,
            reviewContent: '',
            reviewSent: false,
            selected: false,
        }))
    )

    const updateReviewCards = (index: number, updates: Partial<ReviewCard>) => {
        setReviewCards((prevCards) =>
            prevCards.map((reviewCard, innerIndex) =>
                innerIndex === index ? { ...reviewCard, ...updates } : reviewCard
            )
        )
    }

    const handleSelected = (index: number) => {
        setReviewCards((prevCards) =>
            prevCards.map((reviewCard, innerIndex) =>
                innerIndex === index ? { ...reviewCard, selected: true } : { ...reviewCard, selected: false }
            )
        )
    }

    return (
        <div>
            {reviewCards.map((submission, index) => (
                <SubmissionReviewNew
                    key={index}
                    reviewCard={submission}
                    coords={reviewCoords[index]}
                    anySelected={reviewCards.some((reviewCard) => reviewCard.selected)}
                    userId={user.id}
                    clickOutsideCallback={() => {
                        setReviewCards(reviewCards.map((reviewCard) => ({ ...reviewCard, selected: false })))
                    }}
                    handleSelected={() => handleSelected(index)}
                    handleReviewUpdate={(reviewContent: string) => {
                        updateReviewCards(index, { reviewContent })
                    }}
                    handleReviewSentUpdate={() => {
                        updateReviewCards(index, { reviewSent: true })
                    }}
                />
            ))}
        </div>
    )
}

export default ReviewView
type SubmissionReviewNewProps = {
    userId: number
    reviewCard: ReviewCard
    coords: { x: number; y: number }
    anySelected: boolean
    handleSelected: () => void
    clickOutsideCallback: () => void
    handleReviewUpdate: (reviewContent: string) => void
    handleReviewSentUpdate: () => void
}
function SubmissionReviewNew({
    userId,
    reviewCard,
    coords,
    anySelected,
    handleSelected,
    clickOutsideCallback,
    handleReviewUpdate,
    handleReviewSentUpdate,
}: SubmissionReviewNewProps) {
    const divRef = useRef<HTMLDivElement | null>(null)
    const { data, refetch } = useQuery({
        queryKey: ['submitReview', reviewCard.id],
        queryFn: () => submitReview({ userId, submissionId: reviewCard.id, content: reviewCard.content }),
        enabled: false,
    })
    const nodeRef = useRef(null)
    const backgroundColour = randomColour(reviewCard.id)
    useEffect(() => {
        if (data) {
            handleReviewSentUpdate()
        }
    }, [data])
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const clickedOnIgnoredElement = target.closest('.ignore-click')
        if (divRef.current && !divRef.current.contains(target) && !clickedOnIgnoredElement) {
            clickOutsideCallback()
        }
    }
    if (anySelected) {
        if (reviewCard.selected) {
            const style = { width: '90%', backgroundColor: backgroundColour }
            return (
                <div style={style} ref={divRef}>
                    <div>{reviewCard.content}</div>
                    <textarea
                        disabled={reviewCard.reviewSent}
                        value={reviewCard.reviewContent}
                        onChange={(e) => handleReviewUpdate(e.target.value)}
                    />
                    <button disabled={reviewCard.reviewSent} onClick={() => refetch()}>
                        Submit review
                    </button>
                </div>
            )
        } else {
            const style = { width: '350px', backgroundColor: backgroundColour }
            return (
                <div className="ignore-click" style={style}>
                    <div>{reviewCard.content}</div>
                    <div onClick={() => handleSelected()}>EXPAND</div>
                </div>
            )
        }
    } else {
        const style = { width: '350px', backgroundColor: backgroundColour }
        return (
            <Draggable nodeRef={nodeRef} defaultPosition={coords}>
                <div ref={nodeRef} style={style}>
                    <div>{reviewCard.content}</div>
                    <div onClick={() => handleSelected()}>EXPAND</div>
                </div>
            </Draggable>
        )
    }
}
