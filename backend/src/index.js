import dotenv from 'dotenv';
import connectDB from './DB/db.js';
import {app} from './app.js';

dotenv.config({
    path: ".env"
})

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello from the backend');
})

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log("fail to connect with MongoDB", err);
})