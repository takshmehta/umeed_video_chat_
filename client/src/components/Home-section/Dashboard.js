import React  from "react";
import {  Container,Row,Col } from "react-bootstrap";
import {Button,Navbar,Nav } from 'react-bootstrap'
import './Dashoard.css'



const Dashboard = () => {
 
    return(
       <Container fluid>
         <Navbar style={{marginTop:".8rem"}} >
             <Navbar.Brand href="/" className="brand-logo-dashboard">UMMED</Navbar.Brand>
             <Navbar.Collapse className="justify-content-end ">
                 <Nav.Link href="#/show-email" className="show-email">Show emails</Nav.Link>
                 <Button  type="submit" className="logout-btn">
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
                           <Button  type="submit" className="create-room-btn">
                             CreateRoom
                           </Button>
                           <Button  type="submit" className="update-btn">
                             UpdateEmail
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

export default Dashboard;
