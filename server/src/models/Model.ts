export abstract class Model {
    static tableName: string
    static fromData(data: any): any {
        throw new Error("Method 'fromData' must be implemented.")
    }
}
