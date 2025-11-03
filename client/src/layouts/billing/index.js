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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../billing/billing.css"

function Billing() {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: ""
  });


  const navigate = useNavigate()
  const location = useLocation()

  const bookId = location.pathname.split("/")[2]

  console.log(location.pathname.split("/")[2], "location logid");

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  console.log(book, "checkingvalue is coming");

  const handleClick = async e => {
    e.preventDefault()
    try {
      // await axios.put("http://localhost:8800/books/" + bookId , book)
      // await axios.put(`http://localhost:8800/books/${bookId}`, book)
      await axios.put(`https://library-management-s4mr.onrender.com/librarybooks/${bookId}`, book)
      navigate("/dashboard")
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        {/* <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="salary"
                    description="Belong Interactive"
                    value="+$2000"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="paypal"
                    title="paypal"
                    description="Freelance Payment"
                    value="$455.00"
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid>
          </Grid>
        </MDBox>   */}
        <MDBox mb={3}>
          <Grid xs={12} spacing={3}>
            <div className='form billing-form'>
              <h3>Update The Book</h3>
              <div className="billing-form-input">
                <input className="billing-input-child" type="text" placeholder='title' onChange={handleChange} name='title' />
                <input className="billing-input-child" type="text" placeholder='desc' onChange={handleChange} name='desc' />
                <input className="billing-input-child" type="number" placeholder='price' onChange={handleChange} name='price' />
                <input className="billing-input-child" type="text" placeholder='cover' onChange={handleChange} name='cover' />
              </div>
              <div className="billing-form-btn">
                <button className='formbutton' onClick={handleClick}>Update</button>
              </div>
            </div>
            {/* <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid> */}
            {/* <Grid item xs={12} md={5}>
              <Transactions />
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
