import { useCallback, useState } from 'react'
import { ReviewCard, Submission } from '../types/UserInfo'

function initReviewCards(submissionsToReview: Submission[]): ReviewCard[] {
    return submissionsToReview.map((submission) => ({
        ...submission,
        reviewContent: '',
        reviewSent: false,
        selected: false,
    }))
}

export function useReviewCards(submissionsToReview: Submission[]) {
    const [reviewCards, setReviewCards] = useState(initReviewCards(submissionsToReview))

    const removeId = useCallback((submissionId: number) => {
        setReviewCards((prevCards) => prevCards.filter((card) => card.id !== submissionId))
    }, [])

    const setIdSelected = useCallback((submissionId: number) => {
        setReviewCards((prevCards) =>
            prevCards.map((reviewCard) =>
                reviewCard.id === submissionId ? { ...reviewCard, selected: true } : { ...reviewCard, selected: false }
            )
        )
    }, [])

    const setNoneSelected = useCallback(() => {
        setReviewCards((prevCards) => prevCards.map((reviewCard) => ({ ...reviewCard, selected: false })))
    }, [])

    return {
        reviewCards,
        removeId,
        setIdSelected,
        setNoneSelected,
    }
}
