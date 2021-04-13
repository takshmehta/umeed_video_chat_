import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Form, Button, Card } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { authenticate, signup } from "../../authorization-authenticate-section";
import "./Nav.css";

const RegisterPage = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
  });
  const { name, email, password, error, success } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const signUp = (event) => {
    event.preventDefault();
    signup({ name, email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          authenticate(data, () => {
            setValues({
              name: "",
              email: "",
              password: "",
              error: false,
              success: true,
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const performRedirect = () => {
    if (success) {
      return <Redirect to="/email" />;
    }
  };
  return (
    <Container fluid>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <Card className="register-left-card">
            <h1 className="brand-logo-register-page">UMEED</h1>
            <Form onSubmit={signUp}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={handleChange("name")}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange("email")}
                  required
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange("password")}
                  required
                />
              </Form.Group>

              <p style={{ color: "red" }}>{error}</p>
              <Button type="submit" className="register-btn mt-2">
                Register
              </Button>
            </Form>
            <div className="w-100 text-center mt-3 login-card-bottom-text">
              Already have an account?
              <Link to="/login" className="login-link">
                <span> Login</span>
              </Link>
            </div>
          </Card>
        </Col>
        <Col
          lg={6} md={6} sm={6}
          className="register-right-col"
          style={{ filter: "brightness(97%)" }}
        ></Col>
      </Row>
      {performRedirect()}
    </Container>
  );
};

export default RegisterPage;
