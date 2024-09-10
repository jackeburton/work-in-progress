import { Request, Response } from 'express'
import { createReview, getReviewById, getReviewsBySubmissionId } from '../services/reviewService'
export async function createReviewController(req: Request, res: Response) {
    const content = req.body.content
    const userIdStr = req.body.userId
    const submissionIdStr = req.body.submissionId

    if (content == undefined || userIdStr == undefined) {
        console.log(req.body)
        res.status(400).json({
            message: 'Request must contain "content" and "userId" in body',
        })
    } else {
        const userId = parseInt(userIdStr)
        const submissionId = parseInt(submissionIdStr)

        if (isNaN(userId) || isNaN(submissionId)) {
            console.log(req.body)
            res.status(400).json({
                message: 'userId, submissionId must be an integer',
            })
        } else {
            try {
                const newReview = await createReview({ userId, submissionId, content })
                res.status(200).json(newReview)
            } catch (error) {
                console.error('Error creating review', error)
                res.status(500).json({ message: 'internal server error' })
            }
        }
    }
}
export async function getReviewByIdController(req: Request, res: Response) {
    const reviewId = parseInt(req.params.id)

    if (isNaN(reviewId)) {
        res.status(400).json({
            message: 'Review id must be an integer',
        })
    } else {
        try {
            const Review = await getReviewById(reviewId)
            if (Review) {
                res.status(200).json(Review)
            } else {
                res.status(404).json({ message: 'review not found' })
            }
        } catch (error) {
            console.error('Error searching for review', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}

export async function getReviewsBySubmissionIdController(req: Request, res: Response) {
    const submissionId = parseInt(req.params.id)

    if (isNaN(submissionId)) {
        res.status(400).json({
            message: 'Submission id must be an integer',
        })
    } else {
        try {
            const Review = await getReviewsBySubmissionId(submissionId)
            if (Review) {
                res.status(200).json(Review)
            } else {
                res.status(404).json({ message: 'review not found' })
            }
        } catch (error) {
            console.error('Error searching for review', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}
