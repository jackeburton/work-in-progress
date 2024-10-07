import { useEffect, useRef, useState } from 'react'
import { ReviewCard, ReviewSection, SubmittingReview } from '../types/UserInfo'
import DraggableCard from './DraggableCard'
import ReviewCards from './ReviewCards'
import ReviewInput from './ReviewInput'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { randomColour } from '../utils'

const submitReview = async (review: SubmittingReview) => {
    console.log(review)
    const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/review',
        data: {
            userId: review.userId,
            submissionId: review.submissionId,
            reviewSections: review.reviewSections,
        },
    })
    return response.data
}

type SubmissionReviewNewProps = {
    userId: number
    reviewCard: ReviewCard
    coords: { x: number; y: number }
    anySelected: boolean
    handleSelected: () => void
    handleDeselectAll: () => void
    handleReviewSentUpdate: () => void
}
function SubmissionReview({
    userId,
    reviewCard,
    coords,
    anySelected,
    handleSelected,
    handleDeselectAll,
    handleReviewSentUpdate,
}: SubmissionReviewNewProps) {
    const divRef = useRef<HTMLDivElement | null>(null)
    const { data, refetch } = useQuery({
        queryKey: ['submitReview', reviewCard.id],
        queryFn: () =>
            submitReview({
                userId: userId,
                submissionId: reviewCard.id,
                reviewSections: reviewSections,
            } as SubmittingReview),
        enabled: false,
    })
    const backgroundColour = randomColour(reviewCard.id)
    const [highlighted, setHighlighted] = useState<null | string>(null)
    const [currentReview, setCurrentReview] = useState<string>('')
    const [reviewSections, setReviewSections] = useState<ReviewSection[]>([])
    useEffect(() => {
        if (data) {
            console.log('sent')
            handleReviewSentUpdate()
            handleDeselectAll()
        }
    }, [data])
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (event: globalThis.MouseEvent) => {
        const target = event.target as HTMLElement
        const clickedOnIgnoredElement = target.closest('.ignore-click')
        if (divRef.current && !divRef.current.contains(target) && !clickedOnIgnoredElement) {
            handleDeselectAll()
        }
    }

    const handleHighlight = () => {
        const selection = window.getSelection()
        if (selection !== null) {
            const selectionString = selection.toString()
            if (selectionString.length != 0) {
                setHighlighted(selectionString)
            } else {
                setHighlighted(null)
            }
        }
    }

    const handleReviewSectionUpdate = (content: string) => {
        setCurrentReview(content)
    }

    const handleSubmitReview = () => {
        if (highlighted !== null) {
            if (reviewSections !== undefined) {
                setReviewSections([...reviewSections, { quote: highlighted, content: currentReview }])
                setHighlighted(null)
                setCurrentReview('')
            } else {
                setReviewSections([{ quote: highlighted, content: currentReview }])
                setHighlighted(null)
                setCurrentReview('')
            }
        }
    }

    const deleteReviewSection = (index: number) => {
        if (reviewSections) {
            setReviewSections(reviewSections.filter((_, innerIndex) => index !== innerIndex))
        }
    }

    const handleSubmit = () => {
        refetch()
    }

    if (anySelected) {
        if (reviewCard.selected) {
            const style = {
                width: '1200px',
                fontFamily: 'Courier prime',
                fontWeight: '400',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridGap: '20px',
            }
            return (
                <div style={style} ref={divRef}>
                    <div style={{ boxShadow: '10px 10px 5px' }}>
                        <div style={{ height: '40px', backgroundColor: backgroundColour }}></div>
                        <div
                            onMouseUp={() => handleHighlight()}
                            onDoubleClick={() => handleHighlight()}
                            style={{
                                padding: '0px 30px 0px',
                                textIndent: '30px',
                                backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {reviewCard.content}
                        </div>
                    </div>
                    <div>
                        {reviewSections.length !== 0 ? (
                            <ReviewCards
                                reviewSections={reviewSections}
                                deleteReviewSection={deleteReviewSection}
                                backgroundColour={backgroundColour}
                            ></ReviewCards>
                        ) : (
                            <div></div>
                        )}
                        {highlighted ? (
                            <ReviewInput
                                highlight={highlighted}
                                reviewContent={currentReview}
                                handleReviewUpdate={handleReviewSectionUpdate}
                                submitReview={handleSubmitReview}
                                backgroundColour={backgroundColour}
                            ></ReviewInput>
                        ) : (
                            <div></div>
                        )}
                        {reviewSections.length !== 0 ? (
                            <button onClick={handleSubmit}>Submit review</button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )
        }
    } else {
        return (
            <DraggableCard
                backgroundColour={backgroundColour}
                defaultPosision={coords}
                content={reviewCard.content}
                handleSelected={handleSelected}
            />
        )
    }
}

export default SubmissionReview
