import { Navbar,Nav } from 'react-bootstrap'
const NavbarSection=()=>{
    return(     
        <Navbar   className='justify-content-between' style={{padding:".5rem 10rem",backgroundColor:"#bbeffd"}}>
            <Navbar.Brand href="/">UMEED</Navbar.Brand>                 
                <Nav>
                  <Nav.Link href="/Register">Register</Nav.Link>
                  <Nav.Link href="/">UserName</Nav.Link>
                  <Nav.Link href="/Login">Login</Nav.Link>
                  <Nav.Link href="#Logout">Logout</Nav.Link>
                </Nav>                   
        </Navbar>
    )
}

export default NavbarSection;