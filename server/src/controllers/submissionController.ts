import { Request, Response } from 'express'
import {
    createSubmission,
    getNewSubmissions,
    getSubmissionById,
    getSubmissionsByUserId,
    getSubmissionsNotByUserId,
} from '../services/submissionService'
export async function createSubmissionController(req: Request, res: Response) {
    const content = req.body.content
    const userIdStr = req.body.userId

    if (content == undefined || userIdStr == undefined) {
        res.status(400).json({
            message: 'Request must contain "content" and "userId" in body',
        })
    } else {
        const userId = parseInt(userIdStr)
        if (isNaN(userId)) {
            res.status(400).json({
                message: 'userId must be an integer',
            })
        } else {
            try {
                const newSubmission = await createSubmission({ userId, content })
                res.status(200).json(newSubmission)
            } catch (error) {
                console.error('Error creating submission', error)
                res.status(500).json({ message: 'internal server error' })
            }
        }
    }
}
export async function getSubmissionByIdController(req: Request, res: Response) {
    const submissionId = parseInt(req.params.id)

    if (isNaN(submissionId)) {
        res.status(400).json({
            message: 'submissionId must be an integer',
        })
    } else {
        try {
            const submission = await getSubmissionById(submissionId)
            if (submission) {
                res.status(200).json(submission)
            } else {
                res.status(404).json({ message: 'submission not found' })
            }
        } catch (error) {
            console.error('Error searching for submission', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}

export async function getSubmissionsByUserIdController(req: Request, res: Response) {
    const userId = parseInt(req.params.id)
    if (isNaN(userId)) {
        res.status(400).json({
            message: 'userId must be an integer',
        })
    } else {
        try {
            const submissions = await getSubmissionsByUserId(userId)
            if (submissions) {
                res.status(200).json(submissions)
            } else {
                res.status(404).json({ message: 'User has no submissions' })
            }
        } catch (error) {
            console.error('Error searching for users submission', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}

export async function getNewSubmissionsController(req: Request, res: Response) {
    try {
        const dateTime = new Date(req.body.dateTime)
        const submissions = await getNewSubmissions(dateTime)
        if (submissions) {
            res.status(200).json(submissions)
        } else {
            res.status(404).json({ message: 'No new submissions' })
        }
    } catch (error) {
        console.error('Error searching for users submissions', error)
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function getSubmissionsNotByUserIdController(req: Request, res: Response) {
    const userId = parseInt(req.params.id)
    if (isNaN(userId)) {
        res.status(400).json({
            message: 'userId must be an integer',
        })
    } else {
        try {
            const submissions = await getSubmissionsNotByUserId(userId)
            if (submissions) {
                res.status(200).json(submissions)
            } else {
                res.status(404).json({ message: 'No submissions found' })
            }
        } catch (error) {
            console.error('Error searching for submissions', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}
