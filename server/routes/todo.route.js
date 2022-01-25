import express from 'express';
import TodoCtrl from '../controllers/todo.controller.js';

const app = express();

app.get('/', TodoCtrl.getTodo);
app.get('/static/images/:slug', TodoCtrl.getImage);
app.post('/create', TodoCtrl.createTodo);
app.post('/update', TodoCtrl.updateTodo);
app.delete('/delete/:id', TodoCtrl.deleteTodo);

export default app;