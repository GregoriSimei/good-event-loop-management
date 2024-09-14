import { Request, Response } from 'express'

export class FasterCode {
    static async handle(req: Request, res: Response) {
        const startTime = performance.now()
        const memoryBefore = process.memoryUsage().heapUsed;
        const memoryAfter = process.memoryUsage().heapUsed;
        const finalTime = performance.now()
        res.status(200).send(`faster finish time: ${((finalTime - startTime) / 1000).toFixed(3)} s / memory: ${((memoryAfter - memoryBefore) / (1024 * 1024)).toFixed(2)} MB`)
    }
}