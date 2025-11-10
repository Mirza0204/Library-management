import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import "../profile/LibSignIn.css";

function LibSignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://library-management-s4mr.onrender.com/signinlibrary", {
                username,
                password,
            });

            if (response.data.success) {
                alert("✅ Login Successful!");
                navigate("/dashboard"); // redirect inside React
            } else {
                alert("❌ Invalid credentials!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("⚠️ Something went wrong!");
        }
    };

    return (
        <DashboardLayout>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid className="login-Section" item xs={12}>
                        <div className="login-container">
                            <h2>Library Login</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <br />
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <br />
                                <button type="submit">Sign In</button>
                            </form>
                            <div className="links">
                                <a href="/forgetpassword">Forgot Password?</a>
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
