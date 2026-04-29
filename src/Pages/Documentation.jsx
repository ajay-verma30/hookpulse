import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Badge, Button } from 'react-bootstrap';
import { Copy, CheckCircle2, Info } from 'lucide-react';
import Topbar from '../Components/Topbar';
import Footer from '../Components/Footer';

const Documentation = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("URL Copied!");
  };

  const webhookURL = "https://api.hookrescue.io/v1/webhook/your-unique-id";

  return (
    <>
    <Topbar/>
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh",paddingTop:"20px", paddingBottom: "100px", fontFamily: "'Inter', sans-serif", marginTop:"75px"}}>
      
      {/* Custom Styles for Nav */}
      <style>{`
        .custom-nav-link {
          color: #64748b !important;
          border-left: 3px solid transparent;
          border-radius: 0 !important;
          transition: all 0.2s ease;
          background: transparent !important;
          padding: 12px 20px !important;
        }
        .custom-nav-link.active {
          color: #2563eb !important;
          border-left: 3px solid #2563eb;
          background: #f1f5f9 !important; /* Very subtle grey instead of blue */
          font-weight: 600;
        }
        .custom-nav-link:hover:not(.active) {
          background: #f8fafc !important;
          color: #334155 !important;
        }
      `}</style>


      <Container>
        <Tab.Container defaultActiveKey="stripe">
          <Row>
            
            {/* Sidebar */}
            <Col lg={3} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden pt-2 pb-2">
                <Nav className="flex-column" style={{paddingTop:"10px", paddingBottom:"10px"}}>
                  
                  <Nav.Item>
                    <Nav.Link eventKey="stripe" className="custom-nav-link d-flex align-items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                        width="50"
                        className="me-2 filter-grayscale"
                        alt="Stripe"
                        style={{ filter: 'grayscale(100%)', opacity: 0.7 }}
                      />
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link eventKey="razorpay" className="custom-nav-link fw-bold">
                      Razorpay
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link eventKey="shopify" className="custom-nav-link fw-bold">
                      Shopify
                    </Nav.Link>
                  </Nav.Item>

                </Nav>
              </Card>

              {/* Tip */}
              <Card className="mt-4 border-0 shadow-sm p-3 rounded-4 bg-primary bg-opacity-10">
                <div className="d-flex align-items-center mb-2">
                  <Info size={18} className="text-primary me-2" />
                  <span className="fw-bold text-primary small">Pro Tip</span>
                </div>
                <p className="small text-dark mb-0 opacity-75">
                  Always send a "Test Webhook" after setup to ensure everything is connected.
                </p>
              </Card>
            </Col>

            {/* Content */}
            <Col lg={9}>
              <Card className="border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                
                <Tab.Content>

                  {/* STRIPE */}
                  <Tab.Pane eventKey="stripe">
                    <h2 className="fw-bold mb-4">Connecting Stripe</h2>
                    <p className="text-muted mb-4 fs-5">
                      Follow these steps to protect your Stripe payments from server timeouts.
                    </p>

                    <section className="mb-5 mt-4">
                      <h5 className="fw-bold mb-3">
                        <Badge bg="primary" className="bg-opacity-10 text-primary me-2 px-3 py-2 rounded-pill">Step 1</Badge>
                        Copy your HookRescue URL
                      </h5>

                      <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center border mt-3">
                        <code className="text-primary fw-bold" style={{ fontSize: '1rem' }}>{webhookURL}</code>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => copyToClipboard(webhookURL)}
                        >
                          <Copy size={14} className="me-1" /> Copy
                        </Button>
                      </div>
                    </section>

                    <section className="mb-5">
                      <h5 className="fw-bold mb-3">
                        <Badge bg="primary" className="bg-opacity-10 text-primary me-2 px-3 py-2 rounded-pill">Step 2</Badge>
                        Add Webhook in Stripe
                      </h5>

                      <p className="text-muted mt-3">
                        Go to your <b>Stripe Dashboard → Developers → Webhooks</b>
                      </p>

                      <div className="ps-3 border-start border-2 ms-2 mt-3">
                        <ul className="text-muted d-flex flex-column gap-2">
                          <li>Click <b>+ Add Endpoint</b></li>
                          <li>Paste your unique HookRescue URL</li>
                          <li>Select events:
                            <code className="mx-1">charge.succeeded</code>,
                            <code className="mx-1">charge.failed</code>,
                            <code className="mx-1">invoice.payment_failed</code>
                          </li>
                          <li>Click <b>Add endpoint</b> to save.</li>
                        </ul>
                      </div>
                    </section>

                    <section className="p-4 rounded-4 border bg-success bg-opacity-10 border-success border-opacity-25">
                      <h5 className="fw-bold text-success d-flex align-items-center">
                        <CheckCircle2 size={22} className="me-2" />
                        Verification
                      </h5>
                      <p className="text-success mb-0 small opacity-75 mt-2">
                        HookRescue will now intercept all Stripe events. If your server is down, we will automatically queue them for retry.
                      </p>
                    </section>
                  </Tab.Pane>

                  {/* RAZORPAY */}
                  <Tab.Pane eventKey="razorpay">
                    <h2 className="fw-bold mb-4">Connecting Razorpay</h2>
                    <p className="text-muted">
                      Log in to your Razorpay Dashboard, navigate to <b>Settings → Webhooks</b>, and enter your HookRescue endpoint.
                    </p>
                  </Tab.Pane>

                  {/* SHOPIFY */}
                  <Tab.Pane eventKey="shopify">
                    <h2 className="fw-bold mb-4">Connecting Shopify</h2>
                    <p className="text-muted">
                      In Shopify Admin, go to <b>Settings → Notifications</b>, scroll to the bottom, and click <b>Create Webhook</b>.
                    </p>
                  </Tab.Pane>

                </Tab.Content>

              </Card>

              <div className="mt-5 text-center">
                <p className="text-muted">
                  Still stuck?{" "}
                  <a href="mailto:support@hookrescue.io" className="text-primary fw-bold text-decoration-none">
                    Contact Support
                  </a>
                </p>
              </div>
            </Col>

          </Row>
        </Tab.Container>
      </Container>
    </div>
    <Footer/>
    </>
  );
};

export default Documentation;