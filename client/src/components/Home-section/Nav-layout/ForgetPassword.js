import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { forgetpswd } from "../../authorization-authenticate-section/index";
import { Container, Row, Col } from "react-bootstrap";
import "./Nav.css";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ForgetPassword = () => {
  const [email, setemail] = useState("");
  const [error, setError] = useState("");
  const frgtPswd = (event) => {
    event.preventDefault();
    forgetpswd({ email })
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          setError(data.error);
        } else {
          setemail("");
          setError("");
          toast("Email sent for resetting password!!", {
            type: "success",
            autoClose: 2000,
            pauseOnHover: false,
            transition: Zoom,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Container fluid>
        <ToastContainer position="top-left" />
        <Row>
          <Col xs={6}>
            <Card className="register-left-card">
              <h1 className="brand-logo-register-page heading1">
                Enter your registered email to reset your password
              </h1>
              <Form onSubmit={frgtPswd}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </Form.Group>
                <p style={{ color: "red" }}>{error}</p>
                <Button
                  type="submit"
                  className="register-btn"
                  style={{ marginLeft: "4.5rem" }}
                >
                  Reset Password
                </Button>
              </Form>
            </Card>
          </Col>
          <Col xs={6} className="register-right-col frgtimg"></Col>
        </Row>
      </Container>
    </>
  );
};
export default ForgetPassword;
