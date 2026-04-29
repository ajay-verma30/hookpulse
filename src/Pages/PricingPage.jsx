import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { Check, Zap, Shield, Crown, HelpCircle, Lock } from 'lucide-react';
import Topbar from '../Components/Topbar';
import Footer from '../Components/Footer';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: <Zap size={24} className="text-primary" />,
      price: isYearly ? "19" : "24",
      description: "Ideal for growing D2C brands and niche SaaS.",
      features: [
        "Up to 1,000 events/mo",
        "Instant Webhook Retries",
        "Slack & Email Alerts",
        "GDPR Compliant Data Handling",
        "14-day logs retention"
      ],
      buttonText: "Start 14-Day Free Trial",
      recommended: false
    },
    {
      name: "Revenue Share",
      icon: <Crown size={24} className="text-warning" />,
      price: "5%",
      subtext: "of recovered revenue",
      description: "Perfect ROI. You only pay when we save your money.",
      features: [
        "Unlimited Events Recovery",
        "Priority Queue Processing",
        "Advanced Root Cause Analysis",
        "Custom Webhook Timeouts",
        "Dedicated Integration Support",
        "99.9% Delivery Guarantee"
      ],
      buttonText: "Save My Revenue Now",
      recommended: true
    },
    {
      name: "Enterprise",
      icon: <Shield size={24} className="text-dark" />,
      price: "Custom",
      description: "For high-volume marketplaces and fintech apps.",
      features: [
        "Everything in Revenue Share",
        "SLA & Up-time Guarantee",
        "Custom Security Encryption",
        "Dedicated Account Manager",
        "White-label Reporting PDF",
        "On-premise deployment option"
      ],
      buttonText: "Book a Demo",
      recommended: false
    }
  ];

  return (
    <>
      <Topbar />
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingTop: "80px" }}>
        <style>{`
          .pricing-card { 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            border: 1px solid #f1f5f9; 
            border-radius: 24px; 
          }
          .pricing-card:hover { 
            transform: translateY(-12px); 
            box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1); 
            border-color: #2563eb33;
          }
          .recommended-border { 
            border: 2px solid #2563eb !important; 
            background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
          }
          .toggle-switch .form-check-input:checked { background-color: #2563eb; border-color: #2563eb; }
          .feature-item { font-size: 0.95rem; line-height: 1.6; color: #475569; }
        `}</style>

        {/* Header Section */}
        <section className="py-5 text-center">
          <Container>
            <div className="mb-4">
                <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold">
                    Trusted by 500+ Global Founders
                </Badge>
            </div>
            <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: "-0.04em" }}>
              Simple, <span style={{color: '#2563eb'}}>Transparent</span> Pricing
            </h1>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "600px" }}>
                Stop losing $100s every time your server hiccups. Choose the plan that scales with your growth.
            </p>

          </Container>
        </section>

        {/* Cards Section */}
        <Container className="pb-5">
          <Row className="g-4 justify-content-center">
            <p className="text-muted text-center">
  We’re currently in beta. All features are free for early users.
</p>
            {plans.map((plan, idx) => (
              <Col lg={4} md={6} key={idx}>
                <Card className={`h-100 p-4 p-xl-5 pricing-card bg-white ${plan.recommended ? 'recommended-border shadow-lg' : 'shadow-sm'}`}>
                  <Card.Body className="d-flex flex-column p-0">
                    <div className="mb-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {plan.icon}
                        <h5 className="fw-bold mb-0">{plan.name}</h5>
                      </div>
                      <div className="d-flex align-items-baseline gap-1 mt-3">
                        <span className="display-4 fw-bold">
                          {plan.price !== "Custom" && plan.price !== "5%" ? `$${plan.price}` : plan.price}
                        </span>
                        {plan.price !== "Custom" && (
                          <span className="text-muted fw-medium">{plan.subtext || "/month"}</span>
                        )}
                      </div>
                      <p className="text-muted small mt-2 fw-medium">{plan.description}</p>
                    </div>

                    <hr className="my-4 opacity-25" />

                    <ul className="list-unstyled mb-5 flex-grow-1">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="feature-item d-flex align-items-start mb-3">
                          <Check size={18} className="text-success me-3 mt-1 flex-shrink-0" strokeWidth={3} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      variant={plan.recommended ? "primary" : "outline-dark"} 
                      className={`w-100 py-3 fw-bold rounded-4 ${plan.recommended ? 'shadow-blue' : ''}`}
                      style={plan.recommended ? { backgroundColor: "#2563eb", border: "none" } : {borderWidth: '2px'}}
                    >
                      {plan.buttonText}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Trust Elements for US/EU Market */}
          <div className="mt-5 pt-5 border-top">
            <Row className="justify-content-center text-center g-4">
                <Col md={3}>
                    <div className="text-muted small fw-bold text-uppercase mb-2"><Lock size={14} className="me-1" /> Security</div>
                    <p className="small">256-bit AES Encryption</p>
                </Col>
                <Col md={3}>
                    <div className="text-muted small fw-bold text-uppercase mb-2"><Shield size={14} className="me-1" /> Compliance</div>
                    <p className="small">GDPR & SOC2 Ready</p>
                </Col>
                <Col md={3}>
                    <div className="text-muted small fw-bold text-uppercase mb-2"><Zap size={14} className="me-1" /> Uptime</div>
                    <p className="small">99.99% Infrastructure</p>
                </Col>
            </Row>
          </div>

          {/* Global FAQ Section */}
          <Row className="mt-5 pt-5 justify-content-center">
            <Col lg={10}>
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Frequently Asked Questions</h2>
                </div>
                <Row className="g-4">
                    <Col md={6}>
                        <h6 className="fw-bold text-dark">Will this slow down my site?</h6>
                        <p className="text-muted small">Not at all. HookRescue acts as a proxy between your payment provider and your server. It adds zero latency to your checkout flow.</p>
                    </Col>
                    <Col md={6}>
                        <h6 className="fw-bold text-dark">What happens if I exceed my limit?</h6>
                        <p className="text-muted small">We never stop capturing your events. We'll simply notify you to upgrade your plan while keeping your revenue safe.</p>
                    </Col>
                </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;