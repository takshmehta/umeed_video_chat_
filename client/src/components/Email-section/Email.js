import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { isAuthenticated } from "../authorization-authenticate-section";
import { saveEmails } from "../authorization-authenticate-section/emailHelper";
import { Redirect } from "react-router-dom";
import "./Email.css";

const Email = () => {
  const [values, setValues] = useState({
    doctorMail: "",
    relativeOne: "",
    relativeTwo: "",
    relativeThree: "",
    user: "",
    success: "",
  });

  const { user: user1, token } = isAuthenticated();
  const {
    doctorMail,
    relativeOne,
    relativeTwo,
    relativeThree,
    user,
    success,
  } = values;

  useEffect(() => {
    setValues({ ...values, user: user1._id });
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const savemail = (event) => {
    event.preventDefault();
    saveEmails(user1._id, token, { ...values })
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return setValues({ ...values });
        } else {
          return setValues({
            doctorMail: "",
            relativeOne: "",
            relativeTwo: "",
            relativeThree: "",
            user: "",
            success: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const performRedirect = () => {
    if (success) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={6}>
          <Card className="email-left-card">
            <h1 className="brand-logo-email-page">UMEED</h1>
            <h5 className="text-center mb-4 email-header">
              Add Emails for quick calls
            </h5>
            <Form onSubmit={savemail}>
              <Form.Group id="email">
                <Form.Label>Doctor Email</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={doctorMail}
                  onChange={handleChange("doctorMail")}
                  required
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeOne Email</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeOne}
                  onChange={handleChange("relativeOne")}
                  required
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeTwo Email</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeTwo}
                  onChange={handleChange("relativeTwo")}
                  required
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeThree Email</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeThree}
                  onChange={handleChange("relativeThree")}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                className="add-email-submit-btn"
                style={{ marginLeft: "4.5rem" }}
              >
                Save all
              </Button>
            </Form>
          </Card>
        </Col>
        <Col xs={6} className="email-right-col"></Col>
      </Row>
      {performRedirect()}
    </Container>
  );
};

export default Email;
