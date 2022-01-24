import conn from '../db/connection.js';

export default class TodoController {

    static async getTodo(req, res) {
        conn.query('SELECT * FROM todo', (err, results, fields) => {
            if (err) throw err;

            res.json(results)
        });
    }

    static async createTodo(req, res) {
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