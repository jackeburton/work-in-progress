import { useCallback, useState } from 'react'
import { ReviewCard, Submission } from './types/UserInfo'

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

    const updateIndex = useCallback((index: number, updates: Partial<ReviewCard>) => {
        setReviewCards((prevCards) =>
            prevCards.map((reviewCard, innerIndex) =>
                innerIndex === index ? { ...reviewCard, ...updates } : reviewCard
            )
        )
    }, [])

    const setIndexSelected = useCallback((index: number) => {
        setReviewCards((prevCards) =>
            prevCards.map((reviewCard, innerIndex) =>
                innerIndex === index ? { ...reviewCard, selected: true } : { ...reviewCard, selected: false }
            )
        )
    }, [])

    const setNoneSelected = useCallback(() => {
        setReviewCards(reviewCards.map((reviewCard) => ({ ...reviewCard, selected: false })))
    }, [])

    return {
        reviewCards,
        updateIndex,
        setIndexSelected,
        setNoneSelected,
    }
}
