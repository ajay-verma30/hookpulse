import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Form, Row, Col, Spinner, 
    ListGroup, Badge, ButtonGroup, Button, Card, Alert
} from 'react-bootstrap';
import { useAuth } from '../Middleware/AuthContext';
import TopNavbar from '../Components/TopNavbar';
import StatsCard from '../Components/StatsCard';
import AnalyticsChart from '../Components/AnalyticsChart';

const THEME = {
    background: "#F8F9FB",
    cardBg: "#FFFFFF",
    accent: "#0066FF",
    border: "#E9EDF5",
    textMain: "#1A1D23",
    textSecondary: "#64748B"
};

const socket = io('http://localhost:3000', { transports: ['websocket'] });

function Dashboard() {
    const { accessToken, API, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(() => localStorage.getItem("selectedGateway") || "");
    const [analytics, setAnalytics] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isLivePulse, setIsLivePulse] = useState(false); 
    const [filter, setFilter] = useState("24h");

    const fetchAnalytics = useCallback(async (gatewayId, timeFilter, silent = false) => {
        if (!gatewayId) return;
        if (!silent) setIsFetching(true);
        try {
            const res = await API.get(`/analytics/${gatewayId}?filter=${timeFilter}`);
            setAnalytics(res.data);
            setIsLivePulse(true);
            setTimeout(() => setIsLivePulse(false), 800);
        } catch (err) { console.error(err); } finally { setIsFetching(false); }
    }, [API]);

    useEffect(() => {
        if (authLoading || !accessToken) return;
        API.get('/gateways').then(res => setGateways(res.data.gateways || res.data));
    }, [accessToken, authLoading, API]);

    useEffect(() => {
        if (selectedGateway) fetchAnalytics(selectedGateway, filter);
    }, [selectedGateway, filter, fetchAnalytics]);

    if (authLoading) return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center" style={{background: '#fff'}}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div style={{ background: THEME.background, minHeight: '100vh', color: THEME.textMain, fontFamily: "'Inter', sans-serif" }}>
            <TopNavbar />
            
            <Container className="py-5">
                {/* --- HEADER --- */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="h2 fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Analytics</h1>
                        <div className="d-flex align-items-center gap-2">
                            <div className={`status-indicator ${isLivePulse ? 'active' : ''}`} />
                            <span className="small fw-semibold text-secondary">
                                {isLivePulse ? "Syncing live..." : "Pulse Active"}
                            </span>
                        </div>
                    </div>

                    <ButtonGroup className="bg-white p-1 rounded-3 shadow-sm border">
                        {['1h', '24h', '7d', '30d'].map(t => (
                            <Button 
                                key={t}
                                variant={filter === t ? "primary" : "link"}
                                size="sm"
                                className={`px-3 border-0 rounded-2 text-decoration-none ${filter === t ? 'fw-bold' : 'text-secondary'}`}
                                onClick={() => setFilter(t)}
                            >
                                {t.toUpperCase()}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {/* --- SELECTOR --- */}
                <Card className="border-0 shadow-sm mb-4 p-2 rounded-4">
                    <Card.Body className="d-flex align-items-center">
                        <Form.Select 
                            value={selectedGateway}
                            onChange={(e) => setSelectedGateway(e.target.value)}
                            className="bg-transparent border-0 fw-bold fs-5 shadow-none"
                            style={{ cursor: 'pointer', maxWidth: '300px' }}
                        >
                            <option value="" disabled>Select Provider</option>
                            {gateways.map(gw => <option key={gw.id} value={gw.id}>{gw.name}</option>)}
                        </Form.Select>
                        <div className="vr mx-4 opacity-10"></div>
                        <span className="text-muted small fw-medium">Real-time gateway monitoring.</span>
                    </Card.Body>
                </Card>

                {analytics ? (
                    <div className="fade-in">
                        {/* --- TOP STATS --- */}
                        <Row className="g-4 mb-4">
                            {[
                                { title: 'Inbound Events', val: analytics.summary.total_events, color: THEME.accent },
                                { title: 'Success Rate', val: `${analytics.summary.success_rate}%`, color: '#10B981' },
                                { title: 'Failed Hits', val: analytics.summary.failed_events, color: '#EF4444' }
                            ].map((stat, i) => (
                                <Col key={i} md={4}>
                                    <Card className="border-0 shadow-sm p-3 rounded-4">
                                        <div className="small fw-bold text-uppercase text-secondary mb-2">{stat.title}</div>
                                        <div className="h1 fw-bold mb-0" style={{color: stat.color}}>{stat.val}</div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* --- CHART & LOGS --- */}
                        <Row className="g-4 mb-4">
                            <Col lg={8}>
                                <Row>
                                    <Col lg={12}>
                                        <Card className="border-0 shadow-sm p-4 rounded-4 h-100">
                                    <h6 className="fw-bold text-secondary small mb-4 text-uppercase">Traffic Flow</h6>
                                    <AnalyticsChart data={analytics.chart_data} darkMode={false} />
                                </Card>
                                    </Col>
                                    <Col lg={12}>
                                                                {/* --- RCA INTELLIGENCE TABLE --- */}
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5 mt-4">
                            <Card.Body className="p-0">
                                <div className="p-4">
                                    <h6 className="fw-bold text-secondary small text-uppercase mb-0">Failure Intelligence (RCA)</h6>
                                </div>
                                {analytics.top_errors.length > 0 ? (
                                    <div className="table-responsive px-4 pb-4">
                                        <table className="table align-middle mb-0">
                                            <thead>
                                                <tr className="small text-muted text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                                    <th className="border-0 ps-0">Root Cause Message</th>
                                                    <th className="border-0 text-end pe-0">Frequency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.top_errors.map((error, idx) => (
                                                    <tr key={idx}>
                                                        <td className="ps-0 py-3 fw-medium text-dark" style={{ fontSize: '14px' }}>
                                                            {error.last_error_message}
                                                        </td>
                                                        <td className="text-end pe-0">
                                                            <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2">
                                                                {error.occurrence} hits
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="px-4 pb-4">
                                        <Alert variant="success" className="d-flex align-items-center border-0 rounded-3 m-0 bg-success bg-opacity-10 text-success">
                                            <span className="me-2">🚀</span> 
                                            <span className="small fw-bold">System Healthy: No recurring failure patterns detected in this window.</span>
                                        </Alert>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                    <div className="p-4 border-bottom border-light">
                                        <h6 className="m-0 fw-bold text-secondary small text-uppercase">Recent Activity</h6>
                                    </div>
                                    <ListGroup variant="flush">
                                        {analytics.recent_hits.map((hit, i) => (
                                            <ListGroup.Item 
                                                key={i} 
                                                action 
                                                onClick={() => navigate(`/log_details/${hit.id}`)}
                                                className="border-0 px-4 py-3 d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <div className="fw-bold text-dark small">{hit.event_type.split('.').pop()}</div>
                                                    <div className="text-muted" style={{fontSize: '11px'}}>{hit.time}</div>
                                                </div>
                                                <Badge pill bg={hit.status === 'SUCCESS' ? 'success' : 'danger'} className="bg-opacity-10 text-uppercase" style={{ color: hit.status === 'SUCCESS' ? '#059669' : '#DC2626', fontSize: '10px' }}>
                                                    {hit.status}
                                                </Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className="text-center py-5 opacity-50">
                        <h5 className="fw-medium">Select a gateway to load data</h5>
                    </div>
                )}
            </Container>

            <style>{`
                .status-indicator { width: 8px; height: 8px; background: #CBD5E1; border-radius: 50%; }
                .status-indicator.active { background: #10B981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
                .fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .table thead th { background: transparent; }
                .table tbody tr:last-child td { border-bottom: 0; }
            `}</style>
        </div>
    );
}

export default Dashboard;