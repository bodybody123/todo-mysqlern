import express from 'express';
import mysql from 'mysql';
import todo from './routes/todo.route.js';

const app = express();
const port = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', todo);

app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`)
})