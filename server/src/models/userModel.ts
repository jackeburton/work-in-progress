import { Model } from './Model'

export class User extends Model {
    id?: number
    email: string
    username: string

    constructor(email: string, username: string, id?: number) {
        super()
        this.email = email
        this.username = username
        if (id) {
            this.id = id
        }
    }
}
