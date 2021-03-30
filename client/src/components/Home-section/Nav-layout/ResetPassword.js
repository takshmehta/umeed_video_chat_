import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { resetpswd } from "../../authorization-authenticate-section/index";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import "./Nav.css";

const ResetPassword = () => {
  const { email, resettoken } = useParams();

  const [values, setvalues] = useState({
    newpswd: "",
    cnfrmnewpswd: "",
    error: "",
    didRedirect: false,
  });
  const { newpswd, cnfrmnewpswd, error, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setvalues({ ...values, error: false, [name]: event.target.value });
  };

  const resetPswd = (event) => {
    event.preventDefault();

    resetpswd({ email, resettoken, newpswd, cnfrmnewpswd })
      .then((data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error });
        } else {
          setvalues({ ...values, didRedirect: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const performRedirect = () => {
    if (didRedirect) {
      return <Redirect to="/login" />;
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={6}>
            <Card className="register-left-card">
              <h1 className="brand-logo-register-page">Reset Password</h1>
              <Form onSubmit={resetPswd}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>New password</Form.Label>
                  <Form.Control
                    type="password"
                    name="pswd"
                    value={newpswd}
                    onChange={handleChange("newpswd")}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Re-enter Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="re-enter pswd"
                    value={cnfrmnewpswd}
                    onChange={handleChange("cnfrmnewpswd")}
                    required
                  />
                </Form.Group>
                <p style={{ color: "red" }}>{error}</p>

                <Button type="submit" className="register-btn">
                  Change Password
                </Button>
              </Form>
            </Card>
          </Col>
          <Col xs={6} className="register-right-col frgtimg"></Col>
        </Row>
        {performRedirect()}
      </Container>
    </>
  );
};

export default ResetPassword;
