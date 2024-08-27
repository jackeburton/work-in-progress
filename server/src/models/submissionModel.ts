import { Model } from './Model'

export class Submission extends Model {
    id?: number
    userId: number
    content: string

    constructor(userId: number, content: string, id?: number) {
        super()
        this.userId = userId
        this.content = content
        if (id) {
            this.id = id
        }
    }
}
