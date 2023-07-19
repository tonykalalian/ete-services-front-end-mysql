import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import "./App.css";

const countries = [
  "Select Country",
  "Lebanon",
  "Dubai",
  "UK",
  "Canada",
  "India",
  "Other",
];

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    country: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionConfirmationModal, setActionConfirmationModal] = useState({
    show: false,
    action: "",
    employeeId: null,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/employee/list");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    try {
      if (isUpdating) {
        await axios.put(
          `http://localhost:3000/employee/update/${formData.id}`,
          formData
        );
        setIsUpdating(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/employee/create",
          formData
        );
        setEmployees([...employees, response.data]);
      }
      setFormData({ fullName: "", email: "", age: "", country: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating or updating employee:", error);
    }
  };

  const handleUpdateEmployee = async (employee) => {
    try {
      await axios.put(
        `http://localhost:3000/employee/update/${employee.id}`,
        formData
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => (emp.id === employee.id ? formData : emp))
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/employee/delete/${id}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== id)
      );
      setActionConfirmationModal({ show: false, action: "", employeeId: null });
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleOpenModal = (employee) => {
    if (employee) {
      setIsUpdating(true);
      setFormData({ ...employee });
    } else {
      setIsUpdating(false);
      setFormData({ fullName: "", email: "", age: "", country: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowConfirmationModal = (action, employeeId) => {
    setActionConfirmationModal({ show: true, action, employeeId });
  };

  const handleCloseConfirmationModal = () => {
    setActionConfirmationModal({ show: false, action: "", employeeId: null });
  };

  return (
    <div className="py-5">
      <Container>
        <Row>
          <Col>
            <h1 className="text-center mb-5">Employee Management System</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-end">
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Add Employee
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.fullName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.age}</td>
                    <td>{employee.country}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenModal(employee)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleShowConfirmationModal("delete", employee.id)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdating ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateEmployee}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary" className="me-2">
              {isUpdating ? "Update" : "Add Employee"}
            </Button>{" "}
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        show={actionConfirmationModal.show}
        onHide={handleCloseConfirmationModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionConfirmationModal.action === "delete" ? (
            <p>Are you sure you want to delete this employee?</p>
          ) : (
            <p>Are you sure you want to update this employee?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button
            variant={
              actionConfirmationModal.action === "delete" ? "danger" : "primary"
            }
            onClick={() => {
              if (actionConfirmationModal.action === "delete") {
                handleDeleteEmployee(actionConfirmationModal.employeeId);
              } else {
                handleUpdateEmployee(
                  employees.find(
                    (employee) =>
                      employee.id === actionConfirmationModal.employeeId
                  )
                );
              }
              handleCloseConfirmationModal();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
