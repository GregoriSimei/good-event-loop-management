import { base64Encode } from 'base64topdf';
import { Request, Response } from 'express'
import path from 'path';
import { RequestFaker } from '../../src/faker/request-faker';
import { FileSystemHandler } from '../../src/utils/FileSystemHandler';
import { HashGenerator } from '../../src/utils/HashGenerator';

const QTT_EXAMS_EXEMPLE = 25

export class FasterCode {
    static async handle(req: Request, res: Response) {
        const startTime = performance.now()
        const memoryBefore = process.memoryUsage().heapUsed;
        console.log(memoryBefore)

        const PDFMerger = (await import('pdf-merger-js')).default;
        const requestFaker = new RequestFaker()
        const fsHandler = new FileSystemHandler()

        const fileCreation = []
        const findAndCreateFile = (new Array(QTT_EXAMS_EXEMPLE).fill(0)).map(async (): Promise<string> => {
            await requestFaker.getExamsData()

            const pdfBuffer = await requestFaker.getPdfFromAPI()
            const randomHashName = HashGenerator.generate(12)
            const fileName = `${randomHashName}.pdf`
            const pathFile = path.resolve('temp', fileName)
            await fsHandler.createFile(pdfBuffer, pathFile)

            return pathFile
        })

        const pathFiles = await Promise.all(findAndCreateFile)
        console.log('criou os pdfs')
        
        const pdfMerged = new PDFMerger()
        await Promise.all(pathFiles.map(async (pathRef) => {
            await pdfMerged.add(pathRef)
        }))
        const randomHashName = HashGenerator.generate(12)
        const fileName = `${randomHashName}.pdf`
        const pathFile = path.resolve('temp', fileName)
        await pdfMerged.save(pathFile)
        console.log('fez o merge e salvou o arquivo')
        pathFiles.push(pathFile)

        const base64MergedPdf: any = base64Encode(pathFile)

        pathFiles.forEach(async (fileNameToRemove: string) => {
            fsHandler.deleteFile(fileNameToRemove)
        })

        const memoryAfter = process.memoryUsage().heapUsed;
        const finalTime = performance.now()
        res.status(200).send(`faster finish time: ${((finalTime - startTime) / 1000).toFixed(3)} s / memory: ${((memoryAfter - memoryBefore) / (1024 * 1024)).toFixed(2)} MB`)
    }

    static createFileName(): string {
        const randomHashName = HashGenerator.generate(12)
        const fileName = `${randomHashName}.pdf`
        const pathFile = path.resolve('temp', fileName)
        return pathFile
    }
}