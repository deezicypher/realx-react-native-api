import express, {type Request, type Response, type Application} from 'express'
import cors from 'cors'
import GoogleRoute from './routes/google'

const app:Application = express()

app.use(express.json())
app.use(cors())

app.use('/api/google', GoogleRoute)
app.all(/(.*)/, (req:Request, res:Response) => {
    res.status(404).json({ error: "Route Not Found" });
})

export default app