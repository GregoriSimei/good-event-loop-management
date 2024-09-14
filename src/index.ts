import express, { json } from 'express'
import cors from 'cors'
import { WrongCode } from './resolutions/wrongCode'
import { FasterCode } from './resolutions/fasterCode'

const app = express()

app.use(json())
app.use(cors())

app.get('/faster', FasterCode.handle)
app.get('/wrong', WrongCode.handle)

app.listen(3000, () => {
    console.log('App initialized')
})