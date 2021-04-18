import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Form, Button, Card } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { authenticate, signin } from "../../authorization-authenticate-section";
import "./Nav.css";

const LoginPage = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    didRedirect: false,
  });

  const { email, password, error, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const signIn = (event) => {
    event.preventDefault();
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const performRedirect = () => {
    if (didRedirect) {
      return <Redirect to="/" />;
    }
  };
  return (
    <Container fluid>
      <Row>
        <Col lg={6} md={6} sm={6} className="register-left-col">
          <Card className="register-left-card">
            <h1 className="brand-logo-register-page animate__animated  animate__flipInX">
              UMEED
            </h1>
            <Form onSubmit={signIn}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange("email")}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange("password")}
                  required
                />
              </Form.Group>
              <p style={{ color: "red" }}>{error}</p>

              <div className="w-100 text-right mt-1">
                <Link to="/forgot-password" className="login-link">
                  <p>Forgot password</p>
                </Link>
              </div>
              <Button type="submit" className="register-btn">
                Login
              </Button>
            </Form>
            <div className="w-100 text-center mt-2 register-card-bottom-text">
              Don't have an account?{" "}
              <Link to="/register" className="login-link">
                Register
              </Link>
            </div>
          </Card>
        </Col>
        <Col
          lg={6}
          md={6}
          sm={6}
          className="register-right-col"
          style={{ filter: "brightness(97%)" }}
        ></Col>
      </Row>
      {performRedirect()}
    </Container>
  );
};

export default LoginPage;
