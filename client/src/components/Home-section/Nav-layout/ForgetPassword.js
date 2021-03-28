import React,{useState} from 'react';
import { Form, Button, Card } from "react-bootstrap";
import {forgetpswd} from "../../authorization-authenticate-section/index";
import {  Container,Row,Col } from "react-bootstrap";
import './Nav.css'

const ForgetPassword = () => {
    const [email,setemail]=useState("");
    const frgtPswd = (event) => {
      event.preventDefault();
      forgetpswd({ email})
      .then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setemail("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    };
    return (
      <>
      <Container fluid>
           <Row>
             <Col xs={6}>
                 <Card className="register-left-card">
                       <h1 className='brand-logo-register-page heading1'>Enter your registered email to reset password</h1>
                       <Form onSubmit={frgtPswd}>                         
                           <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                       type="email"
                                       name="email"
                                       value={email}
                                       onChange={(e) => setemail(e.target.value)}
                                       required
                                     />
                           </Form.Group>
                           
                         
                           
                           
                           <Button  type="submit" className="register-btn">
                           Reset Password
                           </Button>
                       </Form>
                       
                 </Card>
             </Col>
             <Col xs={6} className='register-right-col frgtimg'></Col>
           </Row>
          
       </Container>

      
    </>

    )
    }
export default ForgetPassword


