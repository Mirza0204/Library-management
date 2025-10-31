// src/components/EmployeeTable.jsx
import React from "react";
import "./EmployeeTable.css";

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

const EmployeeTable = () => {
  return (
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
                <div className="d-flex align-items-center">
                  <img src={emp.img} alt={emp.name} className="avatar me-3" />
                  <div>
                    <div className="fw-bold">{emp.name}</div>
                    <div className="text-muted small">{emp.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="fw-semibold">{emp.role}</div>
                <div className="text-muted small">{emp.dept}</div>
              </td>
              <td>
                <span
                //   className={`badge ${
                //     emp.status === "ONLINE"
                //       ? "bg-success"
                //       : "bg-dark text-light"
                //   }`}
                >
                  {emp.status}
                </span>
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
  );
};

export default EmployeeTable;
