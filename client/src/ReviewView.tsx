import { useEffect, useRef, useState } from 'react'
import { ReviewCard, SubmittingReview } from './types/UserInfo'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Draggable from 'react-draggable'
import { colours } from './types/Colours'
import { useLogin } from './LoginContext'
import { useReviewCards } from './useReviewCards'
import './reviewViewStyle.css'

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
    const { reviewCards, updateIndex, setIndexSelected, setNoneSelected } = useReviewCards(submissionsToReview)

    return (
        <div>
            {reviewCards.map((submission, index) => (
                <SubmissionReview
                    key={index}
                    reviewCard={submission}
                    coords={reviewCoords[index]}
                    anySelected={reviewCards.some((reviewCard) => reviewCard.selected)}
                    userId={user.id}
                    clickOutsideCallback={setNoneSelected}
                    handleSelected={() => setIndexSelected(index)}
                    handleReviewUpdate={(reviewContent: string) => {
                        updateIndex(index, { reviewContent })
                    }}
                    handleReviewSentUpdate={() => {
                        updateIndex(index, { reviewSent: true })
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
function SubmissionReview({
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
    const backgroundColour = randomColour(reviewCard.id)
    const [highlighted, setHighlighted] = useState<null | string>(null)
    const [currentReview, setCurrentReview] = useState<string>('')
    const [reviewSections, setReviewSections] = useState<{ quote: string; reviewContent: string }[]>()
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

    const handleClickOutside = (event: globalThis.MouseEvent) => {
        const target = event.target as HTMLElement
        const clickedOnIgnoredElement = target.closest('.ignore-click')
        if (divRef.current && !divRef.current.contains(target) && !clickedOnIgnoredElement) {
            clickOutsideCallback()
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
                setReviewSections([...reviewSections, { quote: highlighted, reviewContent: currentReview }])
                setHighlighted(null)
                setCurrentReview('')
            } else {
                setReviewSections([{ quote: highlighted, reviewContent: currentReview }])
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
                            }}
                        >
                            {reviewCard.content}
                        </div>
                    </div>
                    <div>
                        {reviewSections ? (
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
                    </div>
                </div>
            )
            /*} else {
            const style = { width: '350px', backgroundColor: backgroundColour }
            return (
                <div className="ignore-click" style={style}>
                    <div>{reviewCard.content}</div>
                    <div onClick={() => handleSelected()}>EXPAND</div>
                </div>
            )*/
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

type DraggableCardProps = {
    backgroundColour: string
    defaultPosision: { x: number; y: number }
    content: string
    handleSelected: () => void
}

function DraggableCard({ backgroundColour, defaultPosision, content, handleSelected }: DraggableCardProps) {
    const nodeRef = useRef(null)
    const style = {
        width: '350px',
        fontFamily: 'Courier prime',
        fontWeight: '400',
    }
    return (
        <Draggable nodeRef={nodeRef} defaultPosition={defaultPosision}>
            <div ref={nodeRef} style={style}>
                <div style={{ height: '40px', backgroundColor: backgroundColour }}></div>
                <div
                    style={{
                        padding: '0px 20px 0px',
                        textIndent: '30px',
                        backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16px, #9198e5 17px, #9198e5 18px)`,
                    }}
                >
                    {content.slice(0, 300)}...
                </div>
                <div style={{ height: '40px', backgroundColor: backgroundColour }} onClick={() => handleSelected()}>
                    EXPAND
                </div>
            </div>
        </Draggable>
    )
}

type ReviewInputProps = {
    highlight: string
    reviewContent: string
    handleReviewUpdate: (content: string) => void
    submitReview: () => void
    backgroundColour: string
}

function ReviewInput({
    highlight,
    reviewContent,
    handleReviewUpdate,
    submitReview,
    backgroundColour,
}: ReviewInputProps) {
    return (
        <div style={{ backgroundColor: backgroundColour, boxShadow: '10px 10px 5px' }}>
            <div style={{ height: '40px' }}></div>
            <div
                style={{
                    padding: '0px 30px 0px',
                    textIndent: '30px',
                    backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                }}
            >
                <div style={{ fontStyle: 'italic' }}>"{highlight}"</div>
                <textarea value={reviewContent} onChange={(e) => handleReviewUpdate(e.target.value)} />
                <button onClick={() => submitReview()}>Submit review</button>
            </div>
        </div>
    )
}

type ReviewCardsProps = {
    reviewSections: { quote: string; reviewContent: string }[]
    deleteReviewSection: (index: number) => void
    backgroundColour: string
}

function ReviewCards({ reviewSections, deleteReviewSection, backgroundColour }: ReviewCardsProps) {
    return (
        <div>
            {reviewSections.map((content, index) => (
                <div
                    style={{ backgroundColor: backgroundColour, boxShadow: '10px 10px 5px', marginBottom: '20px' }}
                    key={index}
                >
                    <div style={{ height: '40px' }}></div>
                    <div
                        style={{
                            padding: '0px 30px 0px',
                            textIndent: '30px',
                            backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                        }}
                    >
                        <div style={{ fontStyle: 'italic' }}>"{content.quote}"</div>
                        <div style={{ height: '20px' }}></div>
                        <div>{content.reviewContent}</div>
                    </div>
                    <button onClick={() => deleteReviewSection(index)}>Remove</button>
                </div>
            ))}
        </div>
    )
}
