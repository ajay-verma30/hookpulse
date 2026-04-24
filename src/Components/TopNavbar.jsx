import React from 'react';
import { Navbar, Container, Nav, Dropdown, Badge, Stack } from 'react-bootstrap';
import { useAuth } from '../Middleware/AuthContext';
import { FiBell, FiUser, FiLogOut, FiSettings, FiActivity } from 'react-icons/fi';

function TopNavbar() {
  const { logout, user } = useAuth();

  return (
    <Navbar bg="white" expand="lg" className="border-bottom sticky-top py-2 shadow-sm">
      <Container fluid className="px-4">
        {/* 🔹 Logo / Dashboard Name */}
        <Navbar.Brand href="/dashboard" className="fw-bold d-flex align-items-center">
          <div className="bg-primary rounded-pill p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
            <FiActivity color="white" />
          </div>
          <span className="d-none d-sm-inline">HookPulse <span className="text-primary text-opacity-75">RCA</span></span>
        </Navbar.Brand>

        {/* 🔹 Right Side Items */}
        <Nav className="ms-auto d-flex flex-row align-items-center">
          
          {/* Notifications */}
          <Nav.Link href="#notifications" className="position-relative me-3 text-muted">
            <FiBell size={20} />
            <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle border border-light p-1">
              <span className="visually-hidden">unread notifications</span>
            </Badge>
          </Nav.Link>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle as="div" id="dropdown-user" className="d-flex align-items-center cursor-pointer" style={{ cursor: 'pointer' }}>
              <div className="bg-light rounded-circle p-2 border me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FiUser className="text-primary" />
              </div>
              <div className="d-none d-md-block text-start">
                <p className="mb-0 fw-bold small text-dark leading-tight">Ajay Verma</p>
                <p className="mb-0 text-muted extra-small" style={{ fontSize: '0.75rem' }}>Admin</p>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border-0 mt-2">
              <Dropdown.Header>My Account</Dropdown.Header>
              <Dropdown.Item href="#profile" className="py-2">
                <FiUser className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings" className="py-2">
                <FiSettings className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="text-danger py-2">
                <FiLogOut className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;