
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import "../tables/tables.css"

const BASE_URL = "https://library-management-s4mr.onrender.com"; // change if needed



function Addnewbook() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    const [book, setBook] = useState({
        title: "",
        standard: "",
        description: "",
        price: null,
        // cover: "",
        quantity: 0
    });

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

    // handleChange unchanged
    const navigate = useNavigate()
    const [coverFile, setCoverFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // const handleChange = (e) => {
    //     setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        // if quantity or price convert to numbers
        if (name === "quantity" || name === "price") {
            setBook(prev => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
        } else {
            setBook(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setCoverFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // for preview
        } else {
            setPreviewUrl(null);
        }
    };





    console.log(book, "checkingvalue is coming");

    // const handleClick = async e => {
    //     e.preventDefault()

    //     // sanitize numeric fields
    //     const payload = {
    //         ...book,
    //         price: book.price === "" ? null : Number(book.price),
    //         quantity: Number(book.quantity) || 0,
    //     };

    //     try {
    //         // await axios.post("http://localhost:8800/books", book)
    //         await axios.post("https://library-management-s4mr.onrender.com/librarybooks", payload)
    //         navigate("/dashboard")
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const handleClick = async (e) => {
        e.preventDefault();

        // Build FormData
        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("standard", book.standard);
        formData.append("description", book.description);
        formData.append("price", book.price === "" ? null : book.price);
        formData.append("quantity", book.quantity || 0);

        if (coverFile) {
            formData.append("cover", coverFile); // key 'cover' matches upload.single("cover")
        }

        try {
            await axios.post(`${BASE_URL}/librarybooks`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/dashboard");
        } catch (err) {
            console.log("Upload error:", err);
        }
    };

    // -------------------------------------------------------------------
    // -------------------------------------------------------------------

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <div className='form tables-form'>
                            <h3>Add New-Book</h3>
                            <div className="tables-form-input">
                                <input className="tables-input-child" type="text" placeholder='title' onChange={handleChange} name='title' />
                                <select className="tables-input-child" onChange={handleChange} name='standard'>
                                    <option value="">Select Standard</option>
                                    <option value="First" id="1">First</option>
                                    <option value="Second" id="2">Second</option>
                                    <option value="Third" id="3">Third</option>
                                    <option value="Fourth" id="4">Fourth</option>
                                </select>

                                {/* Quantity with +/- */}
                                <input
                                    className="tables-input-child"
                                    type="number"
                                    placeholder="quantity"
                                    onChange={handleChange}
                                    name="quantity"
                                    min="0"
                                />

                                <input className="tables-input-child" type="text" placeholder='description' onChange={handleChange} name='description' />

                            </div>

                            <div className="table-form-inputto">
                                <input className="tables-input-child" type="number" placeholder='price' onChange={handleChange} name='price' />


                                {/* <input className="tables-input-child" type="text" placeholder='cover' onChange={handleChange} name='cover' /> */}

                                {/* file input */}
                                <input type="file" accept="image/*" onChange={handleFileChange} />

                                {/* preview (optional) */}
                                {previewUrl && (
                                    <div style={{ marginTop: 10 }}>
                                        <img src={previewUrl} alt="preview" style={{ width: 120, height: 120, objectFit: "cover" }} />
                                    </div>
                                )}

                            </div>
                            <div className="tables-form-btn">
                                <button className='formbutton' onClick={handleClick}>Added</button>
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

export default Addnewbook;
