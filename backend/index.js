import express from "express"
// import mysql from "mysql"
import cors from "cors"
import mysql from "mysql2";

import dotenv from "dotenv";
import XLSX from "xlsx";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Add Cloudinary config here 👇
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
// Library Login
// ----------------------------------------------------------

// -----------------------------------------------------------
// SIGNIN / SIGNOUT / FORGOT / CHANGE PASSWORD
// -----------------------------------------------------------

// ✅ LOGIN (Sign In)
app.post("/signinlibrary", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required!" });
    }

    // ✅ Use your actual table name 'signinlibrary'
    const q = "SELECT * FROM signinlibrary WHERE username = ? AND password = ?";

    db.query(q, [username, password], (err, results) => {
        if (err) {
            console.error("❌ Login Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length > 0) {
            console.log("✅ User logged in:", username);
            return res.json({
                success: true,
                message: "Login successful!",
                redirectUrl: "http://localhost:3000/dashboard",
            });
        } else {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials!" });
        }
    });
});

// ✅ Optional: Get all users (for testing)
app.get("/signinlibrary", (req, res) => {
    const q = "SELECT * FROM signinlibrary";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});


// ----------------------------------------------------------
// Library Login
// ----------------------------------------------------------

// ----------------------------------------------------------
// LOGOUT Login
// ----------------------------------------------------------
// ✅ LOGOUT (Sign Out)
// Logout koi database entry nahi karta.
// Woh sirf ek signal hota hai “User ne session end kar diya”.
app.post("/signoutlibrary", (req, res) => {
    // In a real system, you'd clear session or token here
    console.log("✅ User logged out.");
    return res.json({
        success: true,
        message: "Logout successful!",
        redirectUrl: "http://localhost:3000/LibSignIn",
    });
});
// ----------------------------------------------------------
// LOGOUT Login
// ----------------------------------------------------------


// ✅ CHANGE PASSWORD
app.put("/changepasswordlibrary", (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if old password is correct , backend ke app.post("/signinlibrary") me ye line likhi hai 👇
    const checkQuery = "SELECT * FROM signinlibrary WHERE username = ? AND password = ?";
    db.query(checkQuery, [username, oldPassword], (err, results) => {
        if (err) {
            console.error("❌ DB Error:", err);
            return res.status(500).json({ message: "Database error!" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Old password is incorrect!" });
        }

        // Update password
        const updateQuery = "UPDATE signinlibrary SET password = ? WHERE username = ?";
        db.query(updateQuery, [newPassword, username], (err2) => {
            if (err2) {
                console.error("❌ Update Error:", err2);
                return res.status(500).json({ message: "Could not update password!" });
            }

            return res.json({
                success: true,
                message: "Password updated successfully!",
            });
        });
    });
});



// ----------------------------------------------------------
// librarybooks
// ----------------------------------------------------------

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "library", // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });



// app.post("/librarybooks", upload.single("cover"), (req, res) => {
//     try {
//         const coverUrl = req.file ? req.file.path : null;  // Cloudinary URL

//         const q = `
//             INSERT INTO librarybooks 
//             (title, standard, description, price, cover, quantity)
//             VALUES (?)
//         `;

//         const values = [
//             req.body.title || null,
//             req.body.standard || null,
//             req.body.description || null,
//             req.body.price || null,
//             coverUrl,
//             req.body.quantity || 0
//         ];

//         db.query(q, [values], (err, data) => {
//             if (err) {
//                 console.error("SQL ERROR:", err);
//                 return res.status(500).json({ message: "DB insert failed", error: err });
//             }
//             return res.json({ success: true, data });
//         });

//     } catch (error) {
//         console.error("SERVER ERROR:", error);
//         return res.status(500).json({ message: "Server error", error });
//     }
// });


// --------------------------------------------

// app.get("/librarybooks", (req, res) => {
//     const q = "SELECT * FROM librarybooks"
//     db.query(q, (err, data) => {
//         if (err) return res.json(err)
//         return res.json(data)
//     })
// })


app.post("/librarybooks", upload.single("cover"), (req, res) => {
    try {
        // --- 1️⃣ Validation ----
        if (!req.body.title || !req.body.standard || !req.body.price) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing (title, standard, price)"
            });
        }

        // --- 2️⃣ Cover Image Validation ----
        const coverUrl = req.file ? req.file.path : null;

        // --- 3️⃣ SQL Query ----
        const q = `
            INSERT INTO librarybooks 
            (title, standard, description, price, cover, quantity)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.title,
            req.body.standard,
            req.body.description || "",
            req.body.price,
            coverUrl,
            req.body.quantity || 0
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                console.error("SQL ERROR:", err);

                // Incorrect format, wrong column etc ➡️ 400
                return res.status(400).json({
                    success: false,
                    message: "Invalid data or SQL error",
                    error: err
                });
            }

            // --- 4️⃣ If insert fails for unknown reasons ----
            if (!data.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Book not added, try again"
                });
            }

            // --- 5️⃣ SUCCESS ----
            return res.status(201).json({
                success: true,
                message: "Book added successfully",
                data: data
            });
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
});


// app.get("/librarybooks", (req, res) => {
//     const q = "SELECT * FROM librarybooks";
//     db.query(q, (err, data) => {
//         if (err) return res.json(err);
//         res.json(data);
//     });
// });

app.get("/librarybooks", (req, res) => {
    const q = "SELECT * FROM librarybooks";

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch books",
                error: err
            });
        }
        res.status(200).json(data);
    });
});


//--------------- Update condition ---------------
// app.put("/librarybooks/:id", (req, res) => {
//     // this params represent /books
//     const bookId = req.params.id;
//     // const q = "UPDATE books SET `title` = ? ,`desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
//     // const q = "UPDATE librarybooks SET `title` =?, `standard` =? , `description`=?, `price`=?, `cover`=?, `quantity`=? WHERE id=?"
//     const q = "UPDATE librarybooks SET `title`=?, `standard`=?, `description`=?, `price`=?, `cover`=?, `quantity`=? WHERE id=?";


//     const values = [
//         req.body.title,
//         req.body.standard,
//         req.body.description,
//         req.body.price,
//         req.body.cover,
//         req.body.quantity || 0
//     ]

//     db.query(q, [...values, bookId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("librarybooks has been Updated Succesfully")
//     })
// })

// ✅ PUT with image
// app.put("/librarybooks/:id", upload.single("cover"), (req, res) => {
//     const bookId = req.params.id;

//     // If new image uploaded → use Cloudinary URL
//     // else → keep old image
//     const coverPath = req.file ? req.file.path : req.body.cover;

//     const q = `
//     UPDATE librarybooks 
//     SET title=?, standard=?, description=?, price=?, cover=?, quantity=? 
//     WHERE id=?
//   `;

//     const values = [
//         req.body.title,
//         req.body.standard,
//         req.body.description,
//         req.body.price,
//         coverPath,
//         req.body.quantity || 0,
//         bookId,
//     ];

//     db.query(q, values, (err, data) => {
//         if (err) {
//             console.log("SQL Update Error:", err);
//             return res.status(500).json({ error: "Update failed", details: err });
//         }
//         res.json({ message: "Book updated successfully" });
//     });
// });

app.put("/librarybooks/:id", upload.single("cover"), (req, res) => {
    try {
        const bookId = req.params.id;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

        if (!req.body.title || !req.body.standard || !req.body.price) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing (title, standard, price)"
            });
        }

        // 1️⃣ First fetch old cover
        db.query("SELECT cover FROM librarybooks WHERE id=?", [bookId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "DB error", error: err });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "Book not found" });
            }

            const oldCover = result[0].cover;

            // 2️⃣ If new image uploaded → use new
            //     if not uploaded → use old cover
            const coverPath = req.file ? req.file.path : (req.body.cover || oldCover);

            const q = `
                UPDATE librarybooks 
                SET title=?, standard=?, description=?, price=?, cover=?, quantity=? 
                WHERE id=?
            `;

            const values = [
                req.body.title,
                req.body.standard,
                req.body.description || "",
                req.body.price,
                coverPath,
                req.body.quantity || 0,
                bookId
            ];

            db.query(q, values, (err, data) => {
                if (err) {
                    console.log("SQL Update Error:", err);
                    return res.status(400).json({
                        success: false,
                        message: "Invalid update request or SQL error",
                        error: err
                    });
                }

                if (data.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Book not found"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Book updated successfully"
                });
            });
        });

    } catch (error) {
        console.log("SERVER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
});



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

// ✅ Increment quantity by any given number
app.post("/librarybooks/:id/increment", (req, res) => {
    const bookId = req.params.id;
    const { quantity } = req.body; // frontend sends how many to add

    // Basic validation
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const q = "UPDATE librarybooks SET quantity = quantity + ? WHERE id = ?";
    db.query(q, [quantity, bookId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ success: true, message: `Quantity incremented by ${quantity}` });
    });
});


// Decrement quantity by 1 (not below 0)
// ✅ New version - decrement by requested quantity
app.post("/librarybooks/:id/decrement", (req, res) => {
    const bookId = req.params.id;
    const { quantity } = req.body; // frontend sends the quantity (e.g., 3, 4, 6)

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const q = "UPDATE librarybooks SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?";
    db.query(q, [quantity, bookId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ success: true, message: `Quantity decremented by ${quantity}` });
    });
});



// Decrement quantity by 1 (not below 0)
app.get("/librarybooks/:id/decrement", (req, res) => {
    console.log("find data", res);
    const bookId = req.params.id;
    const q = "UPDATE librarybooks SET quantity = GREATEST(quantity - 1, 0) WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) {
            console.error("Error while decrementing:", err);
            return res.status(500).json({ success: false, error: err });
        }

        console.log("✅ Decrement successful for book ID:", bookId);
        console.log("MySQL response:", data);

        return res.json({ success: true, message: "Quantity decremented" });
    });
});

// ------------------------------------------------------------------
// librarybooks
// ------------------------------------------------------------------



// ----------------------------------------------------------
// Bulkupload
// ----------------------------------------------------------
app.post("/bulkupload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No Excel file uploaded" });
        }

        // Step 1: Read Excel File
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const values = [];

        // Step 2: Loop through rows
        for (const row of sheetData) {

            // ---------------------------
            // 1️⃣ Google Drive URL → File ID
            // ---------------------------
            const driveUrl = row.cover;

            // Safety check
            let fileId = null;

            if (driveUrl.includes("/d/")) {
                fileId = driveUrl.split("/d/")[1]?.split("/")[0];
            }

            // Agar link galat hai → error
            if (!fileId) {
                return res.status(400).json({
                    message: `Invalid Google Drive URL for title: ${row.title}`
                });
            }

            // ---------------------------
            // 2️⃣ Convert to Direct Link
            // ---------------------------
            const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

            // ---------------------------
            // 3️⃣ Upload to Cloudinary
            // ---------------------------
            const uploaded = await cloudinary.uploader.upload(directUrl, {
                folder: "library"
            });

            // ---------------------------
            // 4️⃣ Prepare Data for MySQL
            // ---------------------------
            values.push([
                row.title || null,
                row.standard || null,
                row.description || null,
                row.price || null,
                uploaded.secure_url,  // Final Cloudinary URL
                row.quantity || 0
            ]);
        }

        // ---------------------------
        // 5️⃣ Insert All Rows in Database
        // ---------------------------
        const insertQuery = `
            INSERT INTO librarybooks 
            (title, standard, description, price, cover, quantity)
            VALUES ?
        `;

        db.query(insertQuery, [values], (err, data) => {
            if (err) {
                console.log("SQL ERROR:", err.sqlMessage);
                return res.status(500).json({ message: "Insert failed", error: err });
            }

            return res.json({
                success: true,
                message: `${values.length} books uploaded successfully`
            });
        });

    } catch (error) {
        console.error("Bulk Upload Error:", error);
        return res.status(500).json({ message: "Error processing file", error });
    }
});



app.get("/bulkupload", (req, res) => {
    res.send("Bulkupload GET is working. Use POST to upload Excel.");
});


// ----------------------------------------------------------
// Bulkupload
// ----------------------------------------------------------


// ------------------------------------------------------------------
// studentdata
// ------------------------------------------------------------------
// app.post("/studentdata", (req, res) => {
//     // const q = "INSERT INTO studentdata (`studentName`, `rollNo`, `divi`, `standard`, `quantity` , `bookName`, `currentDate`, `lastDate` , `status`) VALUES (?)";

//     const q = `
//     INSERT INTO studentdata 
//     (\`studentName\`, \`rollNo\`, \`divi\`, \`standard\`, \`bookName\`, \`quantity\`, \`currentDate\`, \`lastDate\`, \`status\`) 
//     VALUES (?)
//   `;

//     // Convert ISO date strings (from frontend) to YYYY-MM-DD
//     const formatDate = (dateStr) => {
//         if (!dateStr) return null;
//         return dateStr.split("T")[0]; // "2025-11-04T00:00:00.000Z" → "2025-11-04"
//     };

//     const values = [
//         req.body.studentName,
//         req.body.rollNo,
//         req.body.divi, // we are reading "div" from frontend
//         req.body.standard,
//         req.body.bookName,
//         //  req.body.quantity || 1,
//         Number(req.body.quantity),
//         // req.body.currentDate,
//         // req.body.lastDate,
//         formatDate(req.body.currentDate),
//         formatDate(req.body.lastDate),
//         req.body.status || "Pending", // <-- Default to 'Pending'
//     ];

//     db.query(q, [values], (err, data) => {
//         if (err) {
//             console.error("Error inserting student:", err);
//             return res.status(500).json({ message: "Database insert failed" });
//         }
//         // return res.json({ message: "Student added successfully!" });
//         return res.json({ success: true, data });
//     });
// });


// POST: create student with 3 books
app.post("/studentdata", (req, res) => {
    const q = `
    INSERT INTO studentdata
    (studentName, rollNo, divi, standard,
     bookName, quantity,
     bookName2, quantity2,
     bookName3, quantity3,
     currentDate, lastDate, status)
    VALUES (?)
  `;

    const formatDate = (d) => (d ? d.split("T")[0] : null);

    const values = [
        req.body.studentName || null,
        req.body.rollNo || null,
        req.body.divi || null,
        req.body.standard || null,

        // book 1
        req.body.bookName || null,
        Number(req.body.quantity) || 0,

        // book 2
        req.body.bookName2 || null,
        Number(req.body.quantity2) || 0,

        // book 3
        req.body.bookName3 || null,
        Number(req.body.quantity3) || 0,

        formatDate(req.body.currentDate),
        formatDate(req.body.lastDate),
        req.body.status || "Pending",
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: err });
        }

        return res.json({ success: true, insertedId: data.insertId });
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
// app.put("/studentdata/:id", (req, res) => {
//     // this params represent /books
//     const bookId = req.params.id;
//     // const q = "UPDATE books SET `title` = ? ,`desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
//     const q = "UPDATE studentdata SET `studentName`=?, `rollNo`=?, `divi`=?, `standard`=?, `bookName`=?, quantity=?, `status`=? , `currentDate`=?, `lastDate`=?   WHERE id=?"


//     const values = [
//         req.body.studentName,
//         req.body.rollNo,
//         req.body.divi, // we are reading "div" from frontend
//         req.body.standard,
//         req.body.bookName,
//         req.body.quantity,
//         req.body.status, // Added
//         req.body.currentDate,
//         req.body.lastDate,
//     ]

//     db.query(q, [...values, bookId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("librarybooks has been Updated Succesfully")
//     })
// })

app.put("/studentdata/:id", (req, res) => {
    const id = req.params.id;

    const q = `
    UPDATE studentdata SET
      studentName=?, rollNo=?, divi=?, standard=?,
      bookName=?, quantity=?,
      bookName2=?, quantity2=?,
      bookName3=?, quantity3=?,
      status=?, currentDate=?, lastDate=?
    WHERE id=?
  `;

    const formatDate = (d) => (d ? d.split("T")[0] : null);

    const values = [
        req.body.studentName || null,
        req.body.rollNo || null,
        req.body.divi || null,
        req.body.standard || null,

        req.body.bookName || null,
        Number(req.body.quantity) || 0,

        req.body.bookName2 || null,
        Number(req.body.quantity2) || 0,

        req.body.bookName3 || null,
        Number(req.body.quantity3) || 0,

        req.body.status || "Pending",
        formatDate(req.body.currentDate),
        formatDate(req.body.lastDate),

        id,
    ];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).json(err);
        }

        return res.json({ success: true, message: "studentdata updated" });
    });
});

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