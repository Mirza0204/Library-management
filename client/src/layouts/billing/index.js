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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../billing/billing.css"


const BASE_URL = "https://library-management-s4mr.onrender.com";

function Billing() {
  const [bookLibrary, setBookLibrary] = useState({
    title: "",
    standard: "",
    quantity: 0,
    description: "",
    price: "",
    cover: ""
  });

  const [newCoverFile, setNewCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate()
  const location = useLocation()

  const bookId = location.pathname.split("/")[2]

  console.log(location.pathname.split("/")[2], "location logid");

  const handleChange = (e) => {
    setBookLibrary(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  console.log("checking Previous value", bookLibrary);


  // ---------------------------------------
  //  Fetch book details when component loads
  // useEffect(() => {
  //   const fetchBook = async () => {
  //     try {
  //       const res = await axios.get(`https://library-management-s4mr.onrender.com/librarybooks`);
  //       // find the specific book by ID
  //       const selectedBook = res.data.find((b) => b.id === parseInt(bookId));
  //       if (selectedBook) {
  //         setBookLibrary({
  //           title: selectedBook.title,
  //           standard: selectedBook.standard,
  //           quantity: selectedBook.quantity,
  //           description: selectedBook.description,
  //           price: selectedBook.price,
  //           cover: selectedBook.cover,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching book details:", err);
  //     }
  //   };
  //   fetchBook();
  // }, [bookId]);

  // Fetch book details

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/librarybooks`);
        const selectedBook = res.data.find(
          (b) => b.id === parseInt(bookId)
        );
        if (selectedBook) {
          setBookLibrary({
            title: selectedBook.title,
            standard: selectedBook.standard,
            quantity: selectedBook.quantity,
            description: selectedBook.description,
            price: selectedBook.price,
            cover: selectedBook.cover,
          });
          setPreviewUrl(`${BASE_URL}${selectedBook.cover}`);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };
    fetchBook();
  }, [bookId]);


  //  Fetch book details when component loads
  // ---------------------------------------


  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setNewCoverFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };



  // ------------Update API Condition
  // const handleClick = async e => {
  //   e.preventDefault()
  //   try {
  //     await axios.put(`https://library-management-s4mr.onrender.com/librarybooks/${bookId}`, bookLibrary)
  //     navigate("/dashboard")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", bookLibrary.title);
    formData.append("standard", bookLibrary.standard);
    formData.append("description", bookLibrary.description);
    formData.append("price", bookLibrary.price);
    formData.append("quantity", bookLibrary.quantity);

    if (newCoverFile) {
      formData.append("cover", newCoverFile);
    } else {
      formData.append("cover", bookLibrary.cover); // keep old image
    }

    try {
      await axios.put(`${BASE_URL}/librarybooks/${bookId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
    }
  };
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
                <input className="billing-input-child" type="text" placeholder='title'
                  value={bookLibrary.title} onChange={handleChange} name='title' />

                <select className="tables-input-child" value={bookLibrary.standard} onChange={handleChange} name='standard'>
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
                  value={bookLibrary.quantity}
                  onChange={handleChange}
                  name="quantity"
                  min="0"
                />
                <input className="billing-input-child" type="text" placeholder='description'
                  value={bookLibrary.description} onChange={handleChange} name='description' />
              </div>

              <div className="table-form-inputto">
                <input className="billing-input-child" type="number" placeholder='price'
                  value={bookLibrary.price} onChange={handleChange} name='price' />


                {/* <input className="billing-input-child" type="text" placeholder='cover'
                  value={bookLibrary.cover} onChange={handleChange} name='cover' /> */}

                {/* File Input + Preview */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={{
                      marginTop: 10,
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                )}
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
    </DashboardLayout >
  );
}

export default Billing;
