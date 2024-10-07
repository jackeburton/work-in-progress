import { colours } from './types/Colours'

export function randomColour(seed?: number): string {
    const x = Math.sin(seed ? seed : Math.random()) * 10000
    const random = x - Math.floor(x)
    return colours[Math.floor(random * colours.length)]
}
