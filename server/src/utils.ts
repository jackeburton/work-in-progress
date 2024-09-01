import client from './db'

async function getMultiplyById<Type extends { fromData(data: any): Type }>(
    id: number,
    table: string,
    queryField: string,
    modelClass: Type
): Promise<Type[] | null> {
    const queryString = 'SELECT * FROM ' + table + ' WHERE ' + queryField + ' = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const items = result.rows
            return items.map((item) => modelClass.fromData(item))
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
