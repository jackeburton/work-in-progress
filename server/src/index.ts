import express, { Request, Response } from 'express'
import cors from 'cors'
import client from './db'
import deleteUser from './api/users/deleteUser'
import insertSubmission from './api/submissions/insertSubmission'
import { getSubmissions } from './api/submissions/getSubmissions'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.SERVER_PORT || '3000'

app.get('/users', async (req: Request, res: Response) => {
    console.log('getting users')
    const queryString = 'SELECT * FROM users'

    try {
        const result = await client.query(queryString)
        if (result.rows.length > 0) {
            console.log(result.rows)
            res.status(200).json(result.rows)
        } else {
            res.status(404).json({ message: 'Database table is empty' })
        }
    } catch (error) {
        console.error('Error querying the DB', error, 'query: ' + queryString)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.get('/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    if (Number.isNaN(userId)) {
        res.status(400).json({ message: 'User id must be an integer' })
    }

    const queryString = 'SELECT * FROM users WHERE id = ' + userId

    try {
        const result = await client.query(queryString)
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0])
        } else {
            res.status(404).json({
                message: 'User with id : ' + userId + ' not found',
            })
        }
    } catch (error) {
        console.error('Error querying the DB', error, 'query: ' + queryString)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/users', async (req: Request, res: Response) => {
    const { email, username } = req.body

    if (email === undefined) {
        res.status(400).json({
            message: 'Request must contain "email" in body',
        })
    }

    if (username === undefined) {
        res.status(400).json({
            message: 'Request must contain "username" in body',
        })
    }

    const queryString = "INSERT INTO users (email, username) VALUES ('" + email + "', '" + username + "') RETURNING *"

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
})

app.put('/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    if (Number.isNaN(userId)) {
        res.status(400).json({ message: 'User id must be an integer' })
    }
    const { email, username } = req.body

    if (email === undefined) {
        res.status(400).json({
            message: 'Request must contain "email" in body',
        })
    }

    if (username === undefined) {
        res.status(400).json({
            message: 'Request must contain "username" in body',
        })
    }

    const queryString =
        "UPDATE users SET username = '" +
        username +
        "', email = '" +
        email +
        "' WHERE id = '" +
        userId +
        "' RETURNING *"

    try {
        const result = await client.query(queryString)
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0])
        } else {
            res.status(404).json({
                message: 'User with id : ' + userId + ' not found',
            })
        }
    } catch (error) {
        console.error('Error updating the DB', error, 'query: ' + queryString)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.delete('/users/:id', deleteUser)
app.post('/users/:userId/submissions/', insertSubmission)
app.get('/users/:userId/submissions/', getSubmissions)

app.listen(PORT, () => {
    console.log('Server Listening on PORT:', PORT)
})
