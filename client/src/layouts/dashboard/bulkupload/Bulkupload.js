import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Bulkupload() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const uploadExcel = async () => {
        if (!file) {
            alert("Please upload an Excel file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(
                "https://library-management-s4mr.onrender.com/bulkupload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(res.data.message);
        } catch (err) {
            console.log(err);
            alert("Bulk upload failed");
        }
    };

    const downloadDummyExcel = () => {
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <MDBox mt={6} mb={3}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <Card>
                            <MDBox p={2}>
                                <MDTypography variant="h5">Bulkupload</MDTypography>
                            </MDBox>

                            <MDBox pt={2} px={2}>
                                <h6>Upload Your Excel-sheet Below File Option</h6>

                                <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

                                <MDButton variant="contained" color="success" onClick={uploadExcel} style={{ marginTop: "20px" }}>
                                    Upload Excel
                                </MDButton>

                                {message && <p style={{ color: "green" }}>{message}</p>}

                                <h6 style={{ marginTop: "30px" }}>Download this Excel-sheet to Understand the logic</h6>

                                <div style={{padding:"10px"}}>
                                    <MDButton variant="contained" color="info" onClick={downloadDummyExcel}>

                                        Download Dummy Excel

                                    </MDButton>
                                </div>
                            </MDBox>

                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            <Footer />
        </DashboardLayout>
    );
}

export default Bulkupload;
