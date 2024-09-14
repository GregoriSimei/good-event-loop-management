import { Request, Response } from 'express'
import { RequestFaker } from '../../src/faker/request-faker'
import { base64Decode, base64Encode } from 'base64topdf'
import { HashGenerator } from '../../src/utils/HashGenerator'
import path from 'path'
import { FileSystemHandler } from '../../src/utils/FileSystemHandler'


const QTT_EXAMS_EXEMPLE = 50

export class WrongCode {
    static async handle(req: Request, res: Response) {
        const startTime = performance.now()
        const memoryBefore = process.memoryUsage().heapUsed;

        console.log('iniciou wrong')
        const PDFMerger = (await import('pdf-merger-js')).default;
        const requestFaker = new RequestFaker()
        const fsHandler = new FileSystemHandler()

        for (let i = 0; i <= QTT_EXAMS_EXEMPLE; i++) {
            await requestFaker.getExamsData()
        }
        console.log('buscou os dados')

        const pdfsInBase64: string[] = []

        for (let i = 0; i < QTT_EXAMS_EXEMPLE; i++) {
            const pdfBuffer = await requestFaker.getPdfFromAPI()
            const pdfBase64 = pdfBuffer.toString('base64')
            pdfsInBase64.push(pdfBase64)
        }
        console.log('buscou os pdfs e transformou em base64')

        const pdfsFileName: string[] = []
        for (const pdf of pdfsInBase64) {
            const randomHashName = HashGenerator.generate(8)
            const fileName = `${randomHashName}.pdf`
            
            const pathFile = path.resolve('temp', fileName)
            pdfsFileName.push(pathFile)
            base64Decode(pdf, pathFile)
        }
        console.log('criou os arquivos dos pdfs em base64')

        const pdfsMerged = new PDFMerger()
        for (const fileName of pdfsFileName) {
            await pdfsMerged.add(fileName)
        }
        console.log('fez o merge de todos os arquivos pdf')

        const randomHashName = HashGenerator.generate(8)
        const mergedFileName = `${randomHashName}.pdf`
        const pathMergedFileName = path.resolve('temp', mergedFileName)
        pdfsFileName.push(pathMergedFileName)
        await pdfsMerged.save(pathMergedFileName)
        console.log('salvou o arquivo com o merge')

        const base64MergedPdf: any = base64Encode(pathMergedFileName)
        
        for(const fileNameToRemove of pdfsFileName) {
            await fsHandler.deleteFile(fileNameToRemove)
        }
        console.log('excluiu todos os arquivos pdf temporarios')

        const memoryAfter = process.memoryUsage().heapUsed;
        const finalTime = performance.now()
        res.status(200).send(`wrong finish time: ${((finalTime - startTime) / 1000).toFixed(3)} s / memory: ${((memoryAfter - memoryBefore) / (1024 * 1024)).toFixed(2)} MB`)
    }
}