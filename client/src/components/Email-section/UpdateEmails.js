import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { isAuthenticated } from "../../components/authorization-authenticate-section";
import {
  updateEmails,
  viewEmails,
} from "../../components/authorization-authenticate-section/emailHelper";
import { Redirect } from "react-router-dom";
import "./Email.css";
const UpdateEmails = () => {
  const [values, setValues] = useState({
    doctorMail: "",
    relativeOne: "",
    relativeTwo: "",
    relativeThree: "",
    success: false,
  });

  const {
    doctorMail,
    relativeOne,
    relativeTwo,
    relativeThree,
    success,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    viewEmails(user._id)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({
            ...values,
            doctorMail: data.doctorMail,
            relativeOne: data.relativeOne,
            relativeTwo: data.relativeTwo,
            relativeThree: data.relativeThree,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const Update = (event) => {
    event.preventDefault();
    viewEmails(user._id)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          updateEmails(user._id, token, data._id, { ...values }).then((res) => {
            setValues({ ...values, success: true });
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

  const { user, token } = isAuthenticated();

  return (
    <Container fluid>
      <Row>
        <Col xs={6} style={{ marginTop: "1.5rem" }}>
          <Card className="email-left-card">
            <h1 className="brand-logo-email-page animate__animated animate__flipInX">
              UMEED
            </h1>
            <h5 className="text-center mb-4 email-header">Update emails</h5>
            <Form onSubmit={Update}>
              <Form.Group id="email">
                <Form.Label>DoctorEmail</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={doctorMail}
                  onChange={handleChange("doctorMail")}
                  required
                  className="emailForm"
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeOneEmail</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeOne}
                  onChange={handleChange("relativeOne")}
                  required
                  className="emailForm"
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeTwoEmail</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeTwo}
                  onChange={handleChange("relativeTwo")}
                  required
                  className="emailForm"
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>RelativeThreeEmail</Form.Label>
                <Form.Control
                  type="email"
                  name=""
                  value={relativeThree}
                  onChange={handleChange("relativeThree")}
                  required
                  className="emailForm"
                />
              </Form.Group>
              <Button className="add-email-submit-btn" type="submit">
                Update
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

export default UpdateEmails;
