import { Request, Response } from 'express'
import client from '../../db'

export default async function insertSubmission(req: Request, res: Response) {
    console.log(req.params)
    const { userId } = req.params
    const { content } = req.body

    if (userId === undefined) {
        res.status(400).json({
            message: 'Request must contain "userId" in body',
        })
    }

    if (content === undefined) {
        res.status(400).json({
            message: 'Request must contain "content" in body',
        })
    }

    const queryString =
        'INSERT INTO submissions (user_id, content) VALUES (' + userId + ", '" + content + "') RETURNING *"

    try {
        const result = await client.query(queryString)
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0])
        } else {
            res.status(500).json({ message: 'Internal server error' })
        }
    } catch (error) {
        console.error('Error inserting into DB', error, 'query: ' + queryString)
        res.status(500).json({ message: 'Internal server error' })
    }
}
