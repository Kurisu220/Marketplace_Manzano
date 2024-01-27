import React from "react";
import { useAuth } from "../component/AuthContext";
import { useCart } from '../component/CartContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const getCartCount = () => {
    return cartItems.length;
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top my-navbar" bg="dark" data-bs-theme="dark" >
      <Container>
        <Navbar.Brand as={Link} to="/home">MarketPlace</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <div className="d-lg-none">
              <span className="navbar-toggler-icon"></span>
              {getCartCount() > 0 && <Badge bg='danger'>{getCartCount()}</Badge>}
          </div>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            {isAuthenticated && <Nav.Link as={Link} to="/add">Add</Nav.Link>}
            {isAuthenticated && <Nav.Link as={Link} to="/store">Edit</Nav.Link>}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/cart">
                Cart   {getCartCount() > 0 && <Badge bg='danger'>{getCartCount()}</Badge>}
              </Nav.Link>
            )}
            {isAuthenticated && (
              <div className="nav-dropdown">    
                <NavDropdown title="Status" id="basic-nav-dropdown">
                <NavDropdown.Item eventKey="disable" disabled>
                Signed In as: <span className="username-log">{user && <span className="username">{user.username}</span>}</span>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
             </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

