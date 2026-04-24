import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Stack, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/new', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.status === 200) {
        setStatus({ type: 'success', msg: 'Registration successful! Redirecting...' });
        navigate("/login");
      }
    } catch (error) {
      setStatus({
        type: 'danger',
        msg: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 vh-100">
        {/* Left Side: Branding */}
        <Col lg={6} className="d-none d-lg-flex bg-dark text-white align-items-center justify-content-center p-5">
          <div style={{ maxWidth: '450px' }}>
            <h1 className="display-4 fw-bold mb-4">Scale your SaaS <span className="text-primary">faster.</span></h1>
            <p className="lead opacity-75 mb-5">
              Manage your API integrations, monitor webhooks in real-time, and automate your workflow.
            </p>
            <Stack gap={3}>
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>✓</div>
                <span>Real-time Webhook Monitoring</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>✓</div>
                <span>Advanced Security & RBAC</span>
              </div>
            </Stack>
          </div>
        </Col>

        {/* Right Side: Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center bg-light">
          <Card className="border-0 bg-transparent w-100" style={{ maxWidth: '400px' }}>
            <Card.Body>
              <div className="mb-4">
                <h3 className="fw-bold">Get Started</h3>
                <p className="text-muted">Create your free account today.</p>
              </div>

              {/* Status Alert */}
              {status.msg && (
                <Alert variant={status.type} className="small py-2">
                  {status.msg}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-uppercase">Full Name</Form.Label>
                  <Form.Control
                    required
                    name="full_name" // Match state key
                    value={formData.full_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Leads"
                    className="py-2 border-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-uppercase">Email Address</Form.Label>
                  <Form.Control
                    required
                    name="email" // Match state key
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="name@example.com"
                    className="py-2 border-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-uppercase">Password</Form.Label>
                  <Form.Control
                    required
                    name="password" // Match state key
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="••••••••"
                    className="py-2 border-2"
                    minLength={8}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>

              <p className="text-center mt-4 small text-muted">
                Already have an account? <a href="/login" className="fw-bold text-decoration-none">Log In</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;