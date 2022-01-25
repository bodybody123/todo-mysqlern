import conn from '../db/connection.js';
import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({ storage: storage });

export default class TodoController {

    static async getTodo(req, res) {
        conn.query('SELECT * FROM todo', (err, results, fields) => {
            if (err) throw err;

            res.json(results)
        });
    }

    static async getImage(req, res) {
        conn.query(
            {
                sql: 'SELECT image FROM todo WHERE image = ?',
                values: [req.params.slug]
            },
            (err, results, fields) => {
                if (err) throw err;

                res.sendFile(__dirname + '/public/uploads/' + results[0].image);
            }
        )
    }

    static async createTodo(req, res) {
        console.log(req);
        res.json({ 'text' : req.body.text }) 
        return 

        conn.query(
            {
                sql: 'INSERT INTO todo (`id`, `text`, `created_at`) VALUES (NULL, ?, current_timestamp())', 
                values: [req.body.text]
            },
            (err, results, fields) => {
                if (err) throw err;

                res.json('success')
            }
        );
    }

    static async updateTodo(req, res) {
        conn.query(
            {
                sql: 'UPDATE todo SET `text` = ?, updated_at = current_time() WHERE `id` = ?',
                values: [req.body.text, req.body.id]
            },
            (err, results, fields) => {
                if (err) throw err;

                res.json('success updated')
            }
            )
        }
        
    static async deleteTodo(req, res) {
        conn.query(
            {
                sql: 'DELETE FROM `todo` WHERE `id` = ?',
                values: [req.params.id]
            },
            (err, results, fields) => {
                if (err) throw err;
    
                res.json('success deleted')
            }
        )
    }
}