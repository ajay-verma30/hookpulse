import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// Footer.jsx mein import line aise change karo
import { Zap,Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-top pt-5 pb-4">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={12}>
            <div className="d-flex align-items-center fw-bold fs-4 text-primary mb-3">
              <Zap size={22} fill="#2563eb" className="me-2" />
              HookRescue
            </div>
            <p className="text-muted pe-lg-5">
              The ultimate safety net for your webhooks. We capture, retry, and recover your missed payment events so you never lose revenue again.
            </p>
            <div className="d-flex gap-3 mt-4 text-secondary">
            </div>
          </Col>

          <Col lg={2} md={4} className="col-6">
            <h6 className="fw-bold mb-3">Product</h6>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li>Features</li>
              <li>Pricing</li>
              <li>Testimonials</li>
              <li>Changelog</li>
            </ul>
          </Col>

          <Col lg={2} md={4} className="col-6">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Community</li>
              <li>Support</li>
            </ul>
          </Col>

          <Col lg={4} md={4}>
            <h6 className="fw-bold mb-3">Stay Protected</h6>
            <p className="small text-muted">Join 500+ founders who trust HookRescue with their payment data.</p>
            <div className="d-flex align-items-center text-primary fw-bold mt-2">
              <Mail size={16} className="me-2" /> 
              support@hookrescue.io
            </div>
          </Col>
        </Row>

        <hr className="my-5 opacity-50" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small gap-3">
          <div>© 2024 HookRescue. Built with ❤️ for Founders.</div>
          <div className="d-flex gap-4">
            <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none">Terms of Service</a>
            <a href="#" className="text-muted text-decoration-none">GDPR</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;