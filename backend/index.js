import express from "express"
import mysql from "mysql"
import cors from "cors"

import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express()

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "admin123",
//     database: "librarymanagement"
// })

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json())
app.use(cors())

// if there is auth problem
// AFTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin123'
app.get("/", (req, res) => {
    res.json("hello this the backend!")
})


app.get("/books", (req, res) => {
    const q = "SELECT * FROM books"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})


app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})

//--------------- Delete condition ---------------
app.delete("/books/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "DELETE FROM books WHERE id = ?"
    const q = "DELETE FROM books WHERE id = ?"

    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Books has been DELETED Succesfully")
    })
})
//--------------- Delete condition ---------------

//--------------- Update condition ---------------
app.put("/books/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "UPDATE books SET `title` = ? ,`desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
    const q = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id=?"


    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ]

    db.query(q, [...values,bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Books has been Updated Succesfully")
    })
})
//--------------- Update condition ---------------

// to run on this port method 
// app.listen(8800, () => {
//     console.log("Connect with Backend!");

// })

// rest of your routes...
app.listen(process.env.PORT || 8800, () => {
  console.log(`Backend running on port ${process.env.PORT || 8800}`);
});