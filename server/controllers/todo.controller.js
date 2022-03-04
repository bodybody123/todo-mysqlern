import conn from "../db/connection.js";
import multer from "multer";
import path from "path";
import { unlink } from "fs";
import imagemin from "imagemin";
import imageminmozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";

const __dirname = path.resolve();
function mini() {
  imagemin(["./public/uploads/*.{jpg,png}"], {
    destination: "./public/uploads/min",
    plugins: [
      imageminmozjpeg({
        quality: 70,
      }),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    let ext;
    switch (file.mimetype) {
      case "image/png":
        ext = ".png";
        break;
      case "image/jpeg":
        ext = ".jpg";
        break;
      default:
        break;
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "img" + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage }).single("file");

export default class TodoController {
  static async getTodo(req, res) {
    conn.query("SELECT * FROM todo", (err, results, fields) => {
      if (err) throw err;

      res.json(results);
    });
  }

  static async getImage(req, res) {
    conn.query(
      {
        sql: "SELECT image FROM todo WHERE image = ?",
        values: [req.params.slug],
      },
      (err, results, fields) => {
        if (err) throw err;

        res.sendFile(__dirname + "/public/uploads/" + results[0].image);
      }
    );
  }

  static async createTodo(req, res, next) {
    try {
      upload(req, res, (error) => {
        if (req.file.size <= 2097152) {
          mini();
          const file = req.file ? req.file.filename : "demo.jpg";
          const text = req.body.text;
          conn.query(
            {
              sql: "INSERT INTO todo (`id`, `image`, `text`, `created_at`) VALUES (NULL, ?, ?, current_timestamp())",
              values: [file, text],
            },
            (err, results, fields) => {
              if (err) throw err;
              res.json("success");
            }
          );
        } else {
          unlink(__dirname + "/public/uploads/" + req.file.filename, (err) => {
            if (err) throw err;
          });
          return res.status(415).json({ error: "Ukuran foto melebihi 2 MB" });
        }
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async updateTodo(req, res) {
    try {
      const file = req.file ? req.file.filename : req.body.file;
      const text = req.body.text;
      const id = req.body.id;

      conn.query(
        {
          sql: "UPDATE todo SET `image` = ?, `text` = ?, updated_at = current_time() WHERE `id` = ?",
          values: [file, text, id],
        },
        (err, results, fields) => {
          if (err) throw err;

          res.json("success updated");
        }
      );
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async deleteTodo(req, res) {
    conn.query(
      {
        sql: "SELECT image FROM todo WHERE id = ?",
        values: [req.params.id],
      },
      (err, results, fields) => {
        if (err) throw err;
        unlink(__dirname + "/public/uploads/" + results[0].image, (err) => {
          if (err) throw err;
          console.log("file was deleted");
        });
      }
    );
    conn.query(
      {
        sql: "DELETE FROM `todo` WHERE `id` = ?",
        values: [req.params.id],
      },
      (err, results, fields) => {
        if (err) throw err;

        res.json("success deleted");
      }
    );
  }
}
