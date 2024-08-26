import { Request, Response } from 'express'
import client from '../../db'

async function deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id)
    if (Number.isNaN(userId)) {
        res.status(400).json({ message: 'User id must be an integer' })
    }

    const queryString = 'DELETE FROM users WHERE id = ' + userId + '  RETURNING *'
    try {
        const result = await client.query(queryString)
        if (result.rows.length > 0) {
            res.status(204).send()
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        console.error('Error deleting from the DB', error, 'query: ' + queryString)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export default deleteUser
