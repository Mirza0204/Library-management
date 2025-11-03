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
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import "../tables/tables.css"


const employees = [
  {
    img: "https://i.pravatar.cc/40?img=1",
    name: "John Michael",
    email: "john@creative-tim.com",
    role: "Manager",
    dept: "Organization",
    status: "ONLINE",
    employed: "23/04/18",
  },
  {
    img: "https://i.pravatar.cc/40?img=2",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    role: "Programator",
    dept: "Developer",
    status: "OFFLINE",
    employed: "11/01/19",
  },
  {
    img: "https://i.pravatar.cc/40?img=3",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    role: "Executive",
    dept: "Projects",
    status: "ONLINE",
    employed: "19/09/17",
  },
  {
    img: "https://i.pravatar.cc/40?img=4",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    role: "Programator",
    dept: "Developer",
    status: "ONLINE",
    employed: "24/12/08",
  },
  {
    img: "https://i.pravatar.cc/40?img=5",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    role: "Manager",
    dept: "Executive",
    status: "OFFLINE",
    employed: "04/10/21",
  },
  {
    img: "https://i.pravatar.cc/40?img=6",
    name: "Miriam Eric",
    email: "miriam@creative-tim.com",
    role: "Programator",
    dept: "Developer",
    status: "OFFLINE",
    employed: "14/09/20",
  },
];
function Tables() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: ""
  });


  const navigate = useNavigate()

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  console.log(book, "checkingvalue is coming");

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {/* <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Authors Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card> */}
            <div className='form tables-form'>
              <h3>Add New-Book</h3>
              <div className="tables-form-input">
                <input className="tables-input-child" type="text" placeholder='title' onChange={handleChange} name='title' />
                <input className="tables-input-child" type="text" placeholder='desc' onChange={handleChange} name='desc' />
                <input className="tables-input-child" type="number" placeholder='price' onChange={handleChange} name='price' />
                <input className="tables-input-child" type="text" placeholder='cover' onChange={handleChange} name='cover' />
              </div>
              <div className="tables-form-btn">
                <button className='formbutton' onClick={handleClick}>Added</button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            {/* <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card> */}
            <div className="container mt-4 employee-table">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>AUTHOR</th>
                    <th>FUNCTION</th>
                    <th>STATUS</th>
                    <th>EMPLOYED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center prof-img-name">
                          <img src={emp.img} alt={emp.name} className="avatar me-3" />
                          <div>
                            <div className="fw-bold">{emp.name}</div>
                            <div className="text-muted small">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{emp.role}</div>
                        <div className="text-muted small func-small">{emp.dept}</div>
                      </td>
                      <td>
                        <span>{emp.status}</span>
                      </td>
                      <td className="text-muted">{emp.employed}</td>
                      <td>
                        <button className="btn btn-link text-decoration-none">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
