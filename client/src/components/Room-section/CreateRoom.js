import React, { useState, useEffect } from "react";
import { v1 as uuid } from "uuid";
import { sendEmailLink, viewEmails } from "../authorization-authenticate-section/emailHelper";
import { isAuthenticated } from "../authorization-authenticate-section";
import {  Container,Row,Col } from "react-bootstrap";
import {Button,Navbar,Nav } from 'react-bootstrap'

import './Dashboard.css'

const CreateRoom = (props) => {
  const [values, setValues] = useState({
    doctorMail: "",
    relativeOne: "",
    relativeTwo: "",
    relativeThree: "",
    link: "",
  });
  const { user } = isAuthenticated();
  const { doctorMail, relativeOne, relativeTwo, relativeThree, link } = values;

  useEffect(() => {
    if(user!==undefined){
    viewEmails(user._id)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            doctorMail: data.doctorMail,
            relativeOne: data.relativeOne,
            relativeTwo: data.relativeTwo,
            relativeThree: data.relativeThree,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });}
  }, [values]);

  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
    setValues((values.link = `${window.location.href}`));
    console.log(values.link);
    sendEmailLink({ ...values })
      .then((data) => {
        if (data.status == "fail") {
          console.log("Email for joining not sent!");
        }
        if (data.status == "success") {
          console.log("Email with joining link sent !");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
   const handleLogout=()=>{
     localStorage.removeItem("jwt");
     props.history.push('/login')
   }
  return (
    <Container fluid>
         <Navbar style={{marginTop:".8rem"}} >
             <Navbar.Brand href="/" className="brand-logo-dashboard">UMMED</Navbar.Brand>
             <Navbar.Collapse className="justify-content-end ">
                 <div className="dropdown">
                      <button className="dropbtn show-email">Show emails</button>
                      <div className="dropdown-content">
                      <span>{doctorMail}</span>
                      <span>{relativeOne}</span>
                      <span>{relativeTwo}</span>
                      <span>{relativeThree}</span>
                      </div>
                  </div>
                 <Button  type="submit" className="logout-btn" onClick={handleLogout}>
                             Logout
                  </Button>
              </Navbar.Collapse>
          </Navbar>   
          <Row>
             <Col xs={5} style={{backgroundCmbolor:"red"}}>
                           <div className="create-update-div">
                           <h2>High quality,</h2>
                           <h2>Secure video Meetings</h2>
                           <h5>Made in india,free and Unlimited</h5>
                           <Button  type="submit" className="create-room-btn" onClick={create}>
                             CreateRoom
                           </Button>
                           <Button  type="submit" className="update-btn">
                             <a href="/update-email">UpdateEmail</a>
                           </Button>
                           </div>
             </Col>
             <Col xs={7} >          
                <div className='dashboard-right-col'>     
                </div>   
             </Col>
           </Row> 
       </Container>
  )
  
};

export default CreateRoom;

