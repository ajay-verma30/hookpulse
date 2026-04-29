import React from 'react';
import { Button, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { CheckCircle, AlertTriangle, Shield, BarChart3, Zap, MousePointer2, ArrowRight, PlayCircle, Globe } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Topbar from '../Components/Topbar';
import Footer from '../Components/Footer';

export default function HookRescueLanding() {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register')
    }

    return (
        <div style={{ 
            background: "#ffffff", 
            color: "#0f172a", 
            fontFamily: "'Inter', system-ui, sans-serif",
            overflowX: 'hidden'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&display=swap');
                
                .hero-title { 
                    font-family: 'Bricolage Grotesque', sans-serif; 
                    letter-spacing: -0.04em; 
                    line-height: 1.1;
                }

                /* Animated Gradient Background */
                .mesh-bg {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 800px;
                    background: radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
                                radial-gradient(at 100% 0%, rgba(37, 99, 235, 0.08) 0px, transparent 50%);
                    z-index: -1;
                }

                .hover-card { 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
                    border: 1px solid #f1f5f9;
                }
                
                .hover-card:hover { 
                    transform: translateY(-10px); 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                    border-color: #2563eb33;
                }

                .btn-primary-custom { 
                    background: #2563eb; 
                    border: none; 
                    padding: 16px 36px; 
                    font-weight: 700; 
                    border-radius: 16px; 
                    transition: all 0.3s;
                    box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
                }

                .btn-primary-custom:hover { 
                    background: #1d4ed8; 
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.5);
                }

                .floating {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
            `}</style>

            <Topbar />
            
            <div className="mesh-bg"></div>

            {/* Hero Section */}
            <section className="pt-5 pb-5" style={{ marginTop: "6rem" }}>
                <Container className="text-center">
                    <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-4 fw-bold">
                        🚀 Secure your revenue in 2 minutes
                    </Badge>
                    
                    <h1 className="hero-title display-2 fw-bold mb-4 mx-auto" style={{ maxWidth: 950 }}>
                        Stop Losing Money to <br />
                        <span style={{ 
                            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Failed Payment Updates</span>
                    </h1>

                    <p className="lead text-secondary mb-5 mx-auto px-3" style={{ maxWidth: 700, fontSize: '1.25rem' }}>
                        HookRescue catches every failed webhook from Stripe, Razorpay & Shopify. 
                        <strong> We retry until your store is synced.</strong> No code required.
                    </p>

                    <div className="d-flex flex-column align-items-center">
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <Button size="lg" className="btn-primary-custom" onClick={handleRegister}>
                                Start Saving Revenue <ArrowRight size={20} className="ms-2" />
                            </Button>
                        </div>
                        <div className="mt-4 d-flex align-items-center gap-4 text-muted small fw-medium">
                            <span className="d-flex align-items-center"><CheckCircle size={16} className="text-success me-1" /> No Credit Card</span>
                            <span className="d-flex align-items-center"><CheckCircle size={16} className="text-success me-1" /> 14-Day Free Trial</span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Problem/Solution with Glassmorphism */}
            <Container className="py-5">
                <Row className="g-4">
                    <Col md={6}>
                        <Card className="h-100 border-0 p-4 rounded-5 glass-card" style={{ background: "rgba(239, 68, 68, 0.03)" }}>
                            <Card.Body>
                                <div className="text-danger mb-4 p-3 bg-white rounded-4 d-inline-block shadow-sm">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="fw-bold text-dark mb-3">The Invisible Leak</h3>
                                <p className="text-muted fs-5 leading-relaxed">
                                    When your server hiccups, your payment gateway stops sending updates. 
                                    <b> Customers pay, but orders don't ship.</b> You lose money and reputation.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="h-100 border-0 p-4 rounded-5 shadow-sm bg-primary text-white overflow-hidden position-relative">
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
                                <Shield size={200} />
                            </div>
                            <Card.Body className="position-relative">
                                <div className="text-primary mb-4 p-3 bg-white rounded-4 d-inline-block shadow-sm">
                                    <Shield size={32} />
                                </div>
                                <h3 className="fw-bold mb-3">The HookRescue Safety Net</h3>
                                <p className="opacity-75 fs-5 leading-relaxed">
                                    We intercept every webhook. If your server is down, we queue it. 
                                    <b> We retry automatically</b> until your database is 100% updated.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Steps with Visual Timeline */}
            <section className="py-5 my-5 position-relative">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h2 className="hero-title display-4 fw-bold mb-3">Set it & Forget it</h2>
                        <p className="text-muted">Integration is faster than making a cup of coffee.</p>
                    </div>
                    <Row className="g-4">
                        {[
                            { t: "Connect Gateway", d: "Select Stripe, Shopify, or Razorpay in our dashboard.", i: <Globe /> },
                            { t: "Swap the URL", d: "Replace your endpoint URL with our secure HookRescue link.", i: <Zap /> },
                            { t: "Relax", d: "We monitor 24/7. Get alerts only when revenue is recovered.", i: <CheckCircle /> }
                        ].map((step, i) => (
                            <Col lg={4} key={i}>
                                <div className="hover-card bg-white p-5 rounded-5 h-100 border">
                                    <div className="mb-4 text-primary bg-primary bg-opacity-10 p-3 rounded-4 d-inline-block">
                                        {React.cloneElement(step.i, { size: 32 })}
                                    </div>
                                    <h4 className="fw-bold mb-3">{i + 1}. {step.t}</h4>
                                    <p className="text-muted mb-0 fs-5">{step.d}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Code Snippet / Visual Section */}
            <Container className="py-5 mb-5">
                <Row className="align-items-center g-5 shadow-sm rounded-5 p-4 p-lg-5 border bg-white">
                    <Col lg={6}>
                        <h2 className="hero-title display-5 fw-bold mb-4">Real-time Recovery <br/>Dashboard</h2>
                        <p className="fs-5 text-muted mb-4">
                            Don't dig through server logs. Our dashboard shows you exactly what failed and why—in plain English.
                        </p>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="d-flex align-items-center fw-bold text-dark">
                                <CheckCircle size={20} className="text-success me-3" /> Automatic Retry Scheduling
                            </li>
                            <li className="d-flex align-items-center fw-bold text-dark">
                                <CheckCircle size={20} className="text-success me-3" /> Revenue Loss Prevention Tracking
                            </li>
                            <li className="d-flex align-items-center fw-bold text-dark">
                                <CheckCircle size={20} className="text-success me-3" /> Slack & Discord Alerts
                            </li>
                        </ul>
                    </Col>
                    <Col lg={6}>
                        <div className="floating p-2" style={{ 
                            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
                            borderRadius: "32px", 
                            boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)"
                        }}>
                            <div className="p-4">
                                <div className="d-flex gap-2 mb-4">
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }}></div>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }}></div>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}></div>
                                </div>
                                <div className="font-monospace" style={{ fontSize: '0.85rem', lineHeight: '2' }}>
                                    <div style={{ color: "#94a3b8" }}>// Processing incoming webhook...</div>
                                    <div style={{ color: "#4ade80" }}>[SUCCESS] Captured event: checkout.session.completed</div>
                                    <div style={{ color: "#f87171" }}>[ERROR] Your server timed out (504 Gateway Timeout)</div>
                                    <div style={{ color: "#fbbf24" }}>[ACTION] HookRescue holding event in secure queue...</div>
                                    <div style={{ color: "#38bdf8" }}>[RETRY] Attempt 1 in 5 minutes...</div>
                                    <div style={{ color: "#4ade80" }}>[FIXED] Event delivered. $249.00 Recovered!</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    );
}