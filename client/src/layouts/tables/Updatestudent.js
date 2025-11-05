/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import "./data/EmployeeTable.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import "../tables/tables.css"

function Updatestudent() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: ""
    });

    const location = useLocation()
    console.log(location.pathname.split("/")[2], "want update id");


    const StudentId = location.pathname.split("/")[2]
    // ------------------------------------------------------------------
    const [tableBooks, setTableBooks] = useState([]);
    // all books from your API and store them in a local state.
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get("https://library-management-s4mr.onrender.com/librarybooks");
                setTableBooks(res.data); // Assuming your API returns an array of books
            } catch (err) {
                console.log("Error fetching books:", err);
            }
        };

        fetchBooks();
    }, []);
    // ----------------------- your API and store books ---------------------


    const navigate = useNavigate()

    const handleChange = (e) => {
        setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
    };

    // console.log(book, "checkingvalue is coming");

    const handleClick = async e => {
        e.preventDefault()
        try {
            // await axios.post("http://localhost:8800/books", book)
            await axios.post("https://library-management-s4mr.onrender.com/librarybooks", book)
            navigate("/dashboard")
        } catch (err) {
            console.log(err);
        }
    }

    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // Add Student useState Condition 
    const [student, setStudent] = useState({
        studentName: "",
        rollNo: "",
        std: "",
        divi: "",
        bookName: "",
        currentDate: "",
        lastDate: "",
        status: "", // Default status
    });
    console.log(student, "checkingvalue is coming");

    // ---------------------------- Add Funcation
    const [studentdata, setStudentdata] = useState([])
    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://library-management-s4mr.onrender.com/studentdata/${StudentId}`, student);
            alert("✅ Student added successfully!");
            // ✅ Update UI state instantly without reload
            setStudentdata((prev) =>
                prev.map((item) =>
                    item.id === StudentId ? { ...item, status: student.status } : item
                )
            );
            // navigate("/tables")
            // ✅ force reload after navigate
            navigate("/tables", { state: { updated: true } });
            window.location.reload();
        } catch (err) {
            console.error("Error adding student:", err);
            alert("❌ Failed to add student");
        }
    };
    // ---------------------------- Add Funcation

    const handlestudentdata = (e) => {
        setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    // ---------------------------------------

    //  Fetch book details when component loads
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get("https://library-management-s4mr.onrender.com/studentdata")
                // find the specific book by ID
                const selectedBook = res.data.find((b) => b.id === parseInt(StudentId));
                if (selectedBook) {
                    setStudent({
                        studentName: selectedBook.studentName,
                        bookName: selectedBook.bookName,
                        rollNo: selectedBook.rollNo,
                        std: selectedBook.std,
                        divi: selectedBook.divi,
                        status: selectedBook.status,
                        // currentDate: selectedBook.currentDate,
                        // lastDate: selectedBook.lastDate,
                        currentDate: selectedBook.currentDate
                            ? selectedBook.currentDate.split("T")[0]
                            : "",
                        lastDate: selectedBook.lastDate
                            ? selectedBook.lastDate.split("T")[0]
                            : "",
                    });
                }
            } catch (err) {
                console.error("Error fetching book details:", err);
            }
        };
        fetchBook();
    }, [StudentId]);
    //  Fetch book details when component loads
    // ---------------------------------------


    // ---------------------------- Get Data Funcation
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                // const res = await axios.get("http://localhost:8800/books")
                const res = await axios.get("https://library-management-s4mr.onrender.com/studentdata")
                console.log(res.data, "studentdata");
                setStudentdata(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchAllBooks()
    }, [location]) // runs again when route changes
    // ---------------------------- Get Data Funcation

    // ---------------------------- Delete Funcation
    const handleDeletestudent = async (id) => {
        console.log("deleteid", id);

        try {
            // await axios.delete("http://localhost:8800/books/" + id)
            await axios.delete("https://library-management-s4mr.onrender.com/studentdata/" + id)
            // window.location.reload()
            setStudentdata((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.log(err, "delete error");
        }
    }
    // ---------------------------- Delete Funcation
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>

                        <div className='form Student-tables-form '>
                            <h3>Update Student Data</h3>
                            <div>
                                <div className="Student-form-input">
                                    <input
                                        className="tables-input-child"
                                        type="text"
                                        placeholder="Student Name"
                                        onChange={handlestudentdata}
                                        name="studentName"
                                        value={student.studentName}
                                    />
                                    <input
                                        className="tables-input-child"
                                        type="number"
                                        placeholder="Student RollNo"
                                        onChange={handlestudentdata}
                                        name="rollNo"
                                        value={student.rollNo}
                                    />
                                    <input
                                        className="tables-input-child"
                                        type="text"
                                        placeholder="STD (class)"
                                        onChange={handlestudentdata}
                                        name="std"
                                        value={student.std}
                                    />
                                    <input
                                        className="tables-input-child"
                                        type="text"
                                        placeholder="Div (A, B, C...)"
                                        onChange={handlestudentdata}
                                        name="divi"
                                        value={student.divi}
                                    />
                                </div>

                                <div className="Student-form-input">
                                    {/* Dropdown for Book Name */}
                                    <select
                                        className="tables-input-child"
                                        name="bookName"
                                        onChange={handlestudentdata}
                                        value={student.bookName}
                                    >
                                        <option value="">Select Book</option>
                                        {tableBooks.map((book) => (
                                            <option key={book.id} value={book.title}>
                                                {book.title}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        className="tables-input-child"
                                        type="date"
                                        placeholder="Current Date"
                                        onChange={handlestudentdata}
                                        name="currentDate"
                                        value={student.currentDate}
                                    />

                                    <select
                                        className="tables-input-child"
                                        name="status"
                                        value={student.status}
                                        onChange={handlestudentdata}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Received">Received</option>
                                    </select>


                                    <input
                                        className="tables-input-child"
                                        type="date"
                                        placeholder="Last Date"
                                        onChange={handlestudentdata}
                                        name="lastDate"
                                        value={student.lastDate}
                                    />
                                </div>
                            </div>

                            <div className="tables-form-btn">
                                <button className="formbutton" onClick={handleUpdateStudent}>
                                    Updated
                                </button>
                            </div>
                        </div>

                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Updatestudent;



