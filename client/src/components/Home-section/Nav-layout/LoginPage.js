import React,{useState}  from "react";
import {  Container,Row,Col } from "react-bootstrap";
import {  Form,Button,Card } from "react-bootstrap";
import { Link ,Redirect } from "react-router-dom";
import { authenticate, signin } from "../../authorization-authenticate-section";
import './Nav.css'

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
    return(
       <Container fluid>
           <Row>
             <Col xs={6}>
                 <Card className="register-left-card">
                       <h1 className='brand-logo-register-page'>UMEED</h1>
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
                           <div className="w-100 text-right mt-1">
                            <Link to="/forgot-password" className="login-link">ForgotPassword</Link>
                       </div>
                           <Button  type="submit" className="register-btn">
                             Login
                           </Button>
                       </Form>
                       <div className="w-100 text-center mt-2">
                            Don't have an account? <Link to="/register" className="login-link">Register</Link>
                       </div>
                 </Card>
             </Col>
             <Col xs={6} className='register-right-col'></Col>
           </Row>
           {performRedirect()}
       </Container>
      
    )

};

export default LoginPage;
