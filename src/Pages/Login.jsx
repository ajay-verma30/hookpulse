import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../Middleware/AuthContext'; // 🔥 use context
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth(); // 🔥 use login from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [validated, setValidated] = useState(false);

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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setStatus({ type: 'success', msg: 'Login successful! Redirecting...' });

      setTimeout(() => {
        navigate('/dashboard'); // 🔥 clean redirect
      }, 1000);
    } else {
      setStatus({
        type: 'danger',
        msg: result.message
      });
    }

    setLoading(false);
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 vh-100">
        
        {/* Left Side */}
        <Col lg={6} className="d-none d-lg-flex bg-dark text-white align-items-center justify-content-center p-5">
          <div style={{ maxWidth: '450px' }}>
            <h1 className="display-4 fw-bold mb-4 text-primary">Welcome Back.</h1>
            <p className="lead opacity-75 mb-0">
              Log in to access your dashboard, manage your webhooks, and check your integration health.
            </p>
          </div>
        </Col>

        {/* Right Side */}
        <Col lg={6} className="d-flex align-items-center justify-content-center bg-light">
          <Card className="border-0 bg-transparent w-100" style={{ maxWidth: '400px' }}>
            <Card.Body>

              <div className="mb-4 text-center text-lg-start">
                <h3 className="fw-bold">Sign In</h3>
                <p className="text-muted">Enter your details to continue.</p>
              </div>

              {status.msg && (
                <Alert variant={status.type} className="small py-2">
                  {status.msg}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-uppercase">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    required
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="py-2 border-2"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <div className="d-flex justify-content-between">
                    <Form.Label className="small fw-semibold text-uppercase">
                      Password
                    </Form.Label>
                    <a href="/forgot-password" className="small text-decoration-none fw-bold">
                      Forgot?
                    </a>
                  </div>
                  <Form.Control
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="py-2 border-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check type="checkbox" label="Remember me" className="small text-muted" />
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
                      Signing in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>

              </Form>

              <p className="text-center mt-4 small text-muted">
                Don't have an account? 
                <a href="/register" className="fw-bold text-decoration-none ms-1">
                  Create one
                </a>
              </p>

            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}

export default Login;