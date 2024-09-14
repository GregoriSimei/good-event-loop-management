import fs from 'fs'
import path from 'path'

export class RequestFaker {
    async getPdfFromAPI(): Promise<Buffer> {
        const randomTimeSimulation = this.getRandomTime()
        return new Promise((resolve, _) => {
            setTimeout(() => {
                const pdfBuffer = fs.readFileSync(path.join(__dirname, './pdf-de-exemplo.pdf'))
                resolve(pdfBuffer)
            }, randomTimeSimulation)
        })
    }

    async getExamsData() {
        const randomTimeSimulation = this.getRandomTime()
        return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve('only a exemple')
            }, randomTimeSimulation)
        })
    }

    // create a random time between 300 and 600 ms
    getRandomTime(): number {
        return Math.floor(Math.random() * (300 - 150 + 1) + 150)
    }
}