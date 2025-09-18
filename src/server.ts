import app from './app'
import dotenv from 'dotenv'
import pool from './config/db'

dotenv.config()

const startDB = async () => {
    try {
        await pool.connect()
        console.log('DB connected')
    } catch (error:any) {
        console.error("Error connecting to DB:",error.message); 
    }
    
}

app.listen(3000, () => {
    startDB()
    console.log('Listening on port 3000')
})