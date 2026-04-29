import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Zap, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegister = (e)=>{
    e.preventDefault();
    navigate('/register')
  }

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className={`py-3 transition-all ${scrolled ? 'bg-white shadow-sm border-bottom' : 'bg-transparent'}`}
      style={{ backdropFilter: scrolled ? 'blur(10px)' : 'none', transition: 'all 0.3s ease' }}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center fw-bold fs-4 text-primary">
          <div style={{ background: "#2563eb", padding: "6px", borderRadius: "8px", marginRight: "10px", display: "flex" }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          HookRescue
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none">
          <Menu size={24} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-lg-4 mt-3 mt-lg-0">
            {/* <Nav.Link href="#features" className="fw-medium text-dark">Features</Nav.Link> */}
            <Nav.Link href="/pricing" className="fw-medium text-dark">Pricing</Nav.Link>
            <Nav.Link href="/docs" className="fw-medium text-dark">Docs</Nav.Link>
            <Nav.Link href="/login" className="fw-medium text-dark ms-lg-2">Login</Nav.Link>
            <Button 
              variant="primary" 
              className="rounded-pill px-4 fw-bold shadow-sm"
              style={{ backgroundColor: "#2563eb", border: "none" }}
              onClick={handleRegister}
            >
              Get Started Free
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;