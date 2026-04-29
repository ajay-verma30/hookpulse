import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Stack,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    business_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      await axios.post("http://localhost:3000/api/v1/users/new", formData);

      setStatus({ type: "success", msg: "Account created! Redirecting..." });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setStatus({
        type: "danger",
        msg: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 vh-100">
        {/* LEFT SIDE */}
        <Col
          lg={6}
          className="d-none d-lg-flex bg-dark text-white align-items-center justify-content-center p-5"
        >
          <div style={{ maxWidth: 460 }}>
            <h1 className="display-4 fw-bold mb-4">
              Recover lost revenue{" "}
              <span className="text-primary">automatically.</span>
            </h1>

            <p className="lead opacity-75 mb-5">
              HookRescue catches failed payments and retries them so you never
              lose money again.
            </p>

            <Stack gap={3}>
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 32, height: 32 }}
                >
                  ✓
                </div>
                <span>No coding required</span>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 32, height: 32 }}
                >
                  ✓
                </div>
                <span>Setup in under 2 minutes</span>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 32, height: 32 }}
                >
                  ✓
                </div>
                <span>Track recovered revenue live</span>
              </div>
            </Stack>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col
          lg={6}
          className="d-flex align-items-center justify-content-center bg-light"
        >
          <Card
            className="border-0 bg-transparent w-100"
            style={{ maxWidth: 420 }}
          >
            <Card.Body>
              {/* Header */}
              <div className="mb-4">
                <h3 className="fw-bold">Create your account</h3>
                <p className="text-muted small">
                  Start your 14-day free trial. No credit card required.
                </p>
                <p className="text-muted large">
                  <strong>
                    {" "}
                    We’re currently in beta. Your account is free during early
                    access.
                  </strong>
                </p>
              </div>

              {/* Alert */}
              {status.msg && (
                <Alert variant={status.type} className="py-2 small">
                  {status.msg}
                </Alert>
              )}

              {/* FORM */}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Name */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    Full Name
                  </Form.Label>
                  <Form.Control
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                  />
                </Form.Group>

                {/* Workspace */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    Workspace Name{" "}
                    <span className="text-muted">(optional)</span>
                  </Form.Label>
                  <Form.Control
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Acme Inc."
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Email</Form.Label>
                  <Form.Control
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@example.com"
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">
                    Password
                  </Form.Label>
                  <Form.Control
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    minLength={8}
                    placeholder="Minimum 8 characters"
                  />
                </Form.Group>

                {/* CTA */}
                <Button
                  type="submit"
                  className="w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Creating account...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </Button>
              </Form>

              {/* Footer */}
              <p className="text-center mt-4 small text-muted">
                Already have an account?{" "}
                <a href="/login" className="fw-bold text-decoration-none">
                  Log in
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;
