import express from "express"
// import mysql from "mysql"
import cors from "cors"
import mysql from "mysql2";

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
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database!");
    }
});


app.use(express.json())
app.use(cors())

// if there is auth problem
// AFTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin123'
app.get("/", (req, res) => {
    res.json("hello this the backend Ashnab Here!")
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


app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("❌ SQL Insert Error:", err);
            return res.status(500).json({ message: "Database Insert Failed", error: err });
        }
        console.log("✅ Book Added:", values);
        return res.json({ success: true, data });
    });
});


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

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Books has been Updated Succesfully")
    })
})
//--------------- Update condition ---------------

// ----------------------------------------------------------
// librarybooks
// ----------------------------------------------------------
app.post("/librarybooks", (req, res) => {
    const q = "INSERT INTO librarybooks (`title`, `description`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("❌ SQL Insert Error:", err);
            return res.status(500).json({ message: "Database Insert Failed", error: err });
        }
        console.log("✅ Book Added:", values);
        return res.json({ success: true, data });
    });
});
// --------------------------------------------

app.get("/librarybooks", (req, res) => {
    const q = "SELECT * FROM librarybooks"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//--------------- Update condition ---------------
app.put("/librarybooks/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "UPDATE books SET `title` = ? ,`desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
    const q = "UPDATE librarybooks SET `title`=?, `description`=?, `price`=?, `cover`=? WHERE id=?"


    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ]

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("librarybooks has been Updated Succesfully")
    })
})
//--------------- Update condition ---------------


//--------------- delete condition ---------------
app.delete("/librarybooks/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "DELETE FROM books WHERE id = ?"
    const q = "DELETE FROM librarybooks WHERE id = ?"

    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("librarybooks has been DELETED Succesfully")
    })
})
//--------------- delete condition ---------------

// ------------------------------------------------------------------
// librarybooks
// ------------------------------------------------------------------


// ------------------------------------------------------------------
// studentdata
// ------------------------------------------------------------------
app.post("/studentdata", (req, res) => {
    const q = "INSERT INTO studentdata (`studentName`, `rollNo`, `std`, `divi`, `bookName`, `currentDate`, `lastDate` , `status`) VALUES (?)";

    // Convert ISO date strings (from frontend) to YYYY-MM-DD
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return dateStr.split("T")[0]; // "2025-11-04T00:00:00.000Z" → "2025-11-04"
    };

    const values = [
        req.body.studentName,
        req.body.rollNo,
        req.body.std,
        req.body.divi, // we are reading "div" from frontend
        req.body.bookName,
        // req.body.currentDate,
        // req.body.lastDate,
        formatDate(req.body.currentDate),
        formatDate(req.body.lastDate),
        req.body.status || "Pending", // <-- Default to 'Pending'
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("Error inserting student:", err);
            return res.status(500).json({ message: "Database insert failed" });
        }
        // return res.json({ message: "Student added successfully!" });
        return res.json({ success: true, data });
    });
});


// --------------------get------------------------
app.get("/studentdata", (req, res) => {
    const q = "SELECT * FROM studentdata"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
// --------------------get------------------------


//--------------- Update condition ---------------
app.put("/studentdata/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "UPDATE books SET `title` = ? ,`desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
    const q = "UPDATE studentdata SET `studentName`=?, `rollNo`=?, `std`=?, `divi`=?, `bookName`=?, `currentDate`=?, `lastDate`=? , `status`=?  WHERE id=?"


    const values = [
        req.body.studentName,
        req.body.rollNo,
        req.body.std,
        req.body.divi, // we are reading "div" from frontend
        req.body.bookName,
        req.body.currentDate,
        req.body.lastDate,
        req.body.status, // Added
    ]

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("librarybooks has been Updated Succesfully")
    })
})
//--------------- Update condition ---------------


//--------------- delete condition ---------------
app.delete("/studentdata/:id", (req, res) => {
    // this params represent /books
    const bookId = req.params.id;
    // const q = "DELETE FROM books WHERE id = ?"
    const q = "DELETE FROM studentdata WHERE id = ?"

    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err)
        return res.json("librarybooks has been DELETED Succesfully")
    })
})
//--------------- delete condition ---------------

// ------------------------------------------------------------------
// studentdata
// ------------------------------------------------------------------



// to run on this port method 
// app.listen(8800, () => {
//     console.log("Connect with Backend!");

// })

// rest of your routes...
app.listen(process.env.PORT || 8800, () => {
    console.log(`Backend running on port ${process.env.PORT || 8800}`);
});