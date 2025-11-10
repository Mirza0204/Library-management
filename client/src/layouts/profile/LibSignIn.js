

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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import "../tables/tables.css"
import "../profile/LibSignIn.css"


function LibSignIn() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();


    // const form = document.getElementById("loginForm");
    // form.addEventListener("submit", async (e) => {
    //     e.preventDefault();

    //     const username = document.getElementById("username").value.trim();
    //     const password = document.getElementById("password").value.trim();

    //     try {
    //         const response = await fetch("http://localhost:8800/signinlibrary", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ username, password }),
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             alert("Login successful!");
    //             window.location.href = data.redirectUrl; // Go to dashboard
    //         } else {
    //             alert(data.message || "Invalid credentials");
    //         }
    //     } catch (error) {
    //         console.error("Login error:", error);
    //         alert("Something went wrong!");
    //     }
    // });
    return (
        <DashboardLayout>
            {/* <DashboardNavbar /> */}
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid className="login-Section" item xs={12}>
                        <div class="login-container">
                            <h2>Library Login</h2>
                            <form id="loginForm">
                                <input type="text" id="username" placeholder="Enter Username" required /><br />
                                <input type="password" id="password" placeholder="Enter Password" required /><br />
                                <button type="submit">Sign In</button>
                            </form>
                            <div class="links">
                                <a href="forget.html">Forgot Password?</a>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default LibSignIn;
