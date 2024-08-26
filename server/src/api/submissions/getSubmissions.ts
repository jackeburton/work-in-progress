import { Request, Response } from 'express'
import client from '../../db'

export async function getSubmissions(req: Request, res: Response) {
    const userId = parseInt(req.params.userId)
    if (Number.isNaN(userId)) {
        res.status(400).json({ message: 'User id must be an integer' })
    } else {
        const queryString = 'SELECT * FROM submissions WHERE user_id = ' + userId

        try {
            const result = await client.query(queryString)
            if (result.rows.length > 0) {
                res.status(200).json(result.rows)
            } else {
                res.status(500).json({ message: 'Internal server error' })
            }
        } catch (error) {
            console.error('Error inserting into DB', error, 'query: ' + queryString)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
