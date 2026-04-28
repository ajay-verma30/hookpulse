import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Spinner,
  ListGroup,
  Badge,
  ButtonGroup,
  Button,
  Card,
  Alert,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../Middleware/AuthContext";
import TopNavbar from "../Components/TopNavbar";
import Sidebar from "../Components/Sidebar";
import AnalyticsChart from "../Components/AnalyticsChart";

const THEME = {
  background: "#F8F9FB",
  cardBg: "#FFFFFF",
  accent: "#0066FF",
  border: "#E9EDF5",
  textMain: "#1A1D23",
  textSecondary: "#64748B",
};

function Dashboard() {
  const { accessToken, API, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(
    () => localStorage.getItem("selectedGateway") || ""
  );
  const [analytics, setAnalytics] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLivePulse, setIsLivePulse] = useState(false);
  const [filter, setFilter] = useState("24h");

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [registeredUrl, setRegisteredUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    provider_type: "stripe",
    webhook_secret: "",
  });

  const fetchAnalytics = useCallback(
    async (gatewayId, timeFilter, silent = false) => {
      if (!gatewayId) return;
      if (!silent) setIsFetching(true);
      try {
        const res = await API.get(`/analytics/${gatewayId}?filter=${timeFilter}`);
        setAnalytics(res.data);
        setIsLivePulse(true);
        setTimeout(() => setIsLivePulse(false), 800);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    },
    [API]
  );

  const fetchGateways = useCallback(async () => {
    try {
      const res = await API.get("/gateways");
      const data = res.data.gateways || res.data;
      setGateways(data);

      const storedId = localStorage.getItem("selectedGateway");
      const isValid = data.some((gw) => gw.id === storedId);

      if (isValid) {
        setSelectedGateway(storedId);
      } else if (data.length > 0) {
        setSelectedGateway(data[0].id);
      }
    } catch (err) {
      console.error("Fetch Gateways Error:", err);
    }
  }, [API]);

  useEffect(() => {
    if (authLoading || !accessToken) return;
    fetchGateways();
  }, [accessToken, authLoading, fetchGateways]);

  useEffect(() => {
    if (selectedGateway) {
      fetchAnalytics(selectedGateway, filter);
      localStorage.setItem("selectedGateway", selectedGateway);
    }
  }, [selectedGateway, filter, fetchAnalytics]);

  useEffect(() => {
    if (!selectedGateway) return;
    const socket = io("http://localhost:3000", { withCredentials: true });
    socket.on(`update_dashboard_${selectedGateway}`, () => {
      fetchAnalytics(selectedGateway, filter, true);
    });
    return () => socket.disconnect();
  }, [selectedGateway, filter, fetchAnalytics]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await API.post("/admin/register-gateway", formData);
      setRegisteredUrl(res.data.url);
      await fetchGateways();
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const showEmptyState = gateways.length === 0;

  return (
    <div style={{ background: THEME.background, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <TopNavbar />
      
      <div className="d-flex">
        {/* Sidebar Fixed Width */}
        <div style={{ width: "240px", minHeight: "calc(100vh - 60px)" }}>
          <Sidebar selectedGateway={selectedGateway}/>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 position-relative pb-4">
          {showEmptyState && (
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" 
                 style={{ zIndex: 10, backdropFilter: "blur(4px)", background: "rgba(248, 249, 251, 0.6)" }}>
              <Card className="text-center p-5 shadow-lg border-0 rounded-4" style={{ maxWidth: "400px" }}>
                <div className="display-4 mb-3">⚡</div>
                <h3 className="fw-bold">No Gateway Active</h3>
                <p className="text-secondary mb-4">Connect a provider to start tracking real-time webhooks.</p>
                <Button variant="primary" className="w-100 fw-bold" onClick={() => setShowModal(true)}>
                  + Register Gateway
                </Button>
              </Card>
            </div>
          )}

          <Container fluid className="p-4" style={{ filter: showEmptyState ? "grayscale(1)" : "none" }}>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h1 className="h3 fw-bold mb-1">Analytics</h1>
                
<div className="d-flex align-items-center gap-2">
      <div className={`status-indicator ${isLivePulse || analytics?.is_active ? "active" : ""}`} />
      
      <span className="small fw-semibold text-secondary">
        {isLivePulse 
          ? "Syncing live..." 
          : (analytics?.is_active ? "System Pulse Active" : "System Offline")}
      </span>
    </div>

              </div>

              <div className="d-flex gap-3">
                <ButtonGroup className="bg-white p-1 rounded-3 shadow-sm border">
                  {["1h", "24h", "7d", "30d"].map((t) => (
                    <Button
                      key={t}
                      variant={filter === t ? "primary" : "link"}
                      size="sm"
                      className={`px-3 border-0 rounded-2 text-decoration-none ${filter === t ? "fw-bold" : "text-secondary"}`}
                      onClick={() => setFilter(t)}
                    >
                      {t.toUpperCase()}
                    </Button>
                  ))}
                </ButtonGroup>
                <Button variant="dark" className="rounded-3 fw-bold px-3" onClick={() => setShowModal(true)}>
                  + Add Gateway
                </Button>
              </div>
            </div>

            {/* Gateway Selector Card */}
            <Card className="border-0 shadow-sm mb-4 rounded-4">
              <Card.Body className="d-flex align-items-center py-2">
                <Form.Select
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className="bg-transparent border-0 fw-bold fs-5 shadow-none"
                  style={{ width: "auto", minWidth: "250px" }}
                >
                  <option value="" disabled>Select Provider</option>
                  {gateways.map((gw) => (
                    <option key={gw.id} value={gw.id}>{gw.name}</option>
                  ))}
                </Form.Select>
                <div className="vr mx-3 opacity-10" />
                <span className="text-muted small">Monitoring live traffic for {gateways.find(g => g.id === selectedGateway)?.name || 'selected gateway'}.</span>
              </Card.Body>
            </Card>

            {analytics ? (
              <div className="fade-in">
                {/* Stats Grid */}
                <Row className="g-3 mb-4">
                  {[
                    { title: "Inbound Events", val: analytics.summary?.total_events, color: THEME.accent },
                    { title: "Success Rate", val: analytics.summary?.success_rate, color: "#10B981" },
                    { title: "Failed Hits", val: analytics.summary?.failed_events, color: "#EF4444" },
                    { title: "At Risk", val: analytics.loss?.total_at_risk?.amount, color: "#6366F1" },
                    { title: "Recovered", val: analytics.loss?.recovered?.amount, color: "#10B981" },
                    { title: "Net Loss", val: analytics.loss?.net_loss?.amount, color: "#EF4444" },
                  ].map((stat, i) => (
                    <Col key={i} md={4} lg={2}>
                      <Card className="border-0 shadow-sm p-3 rounded-4 h-100">
                        <div className="small fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: '10px' }}>{stat.title}</div>
                        <div className="h4 fw-bold mb-0" style={{ color: stat.color }}>{stat.val ?? "--"}</div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Row className="g-4">
                  <Col lg={8}>
                    {/* Chart */}
                    <Card className="border-0 shadow-sm p-4 rounded-4 mb-4">
                      <h6 className="fw-bold text-secondary small mb-4 text-uppercase">Traffic Flow</h6>
                      <div style={{ height: "300px" }}>
                        <AnalyticsChart data={analytics.chart_data} darkMode={false} />
                      </div>
                    </Card>

                    {/* RCA Table */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                      <div className="p-4 border-bottom">
                        <h6 className="fw-bold text-secondary small text-uppercase mb-0">Failure Intelligence (RCA)</h6>
                      </div>
                      <Card.Body className="p-0">
                        {(analytics.top_errors ?? []).length > 0 ? (
                          <div className="table-responsive">
                            <table className="table align-middle mb-0">
                              <thead className="bg-light">
                                <tr className="small text-muted text-uppercase" style={{ fontSize: "10px" }}>
                                  <th className="px-4 py-3 border-0">Root Cause Message</th>
                                  <th className="text-end px-4 py-3 border-0">Frequency</th>
                                </tr>
                              </thead>
                              <tbody>
                                {analytics.top_errors.map((error, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 fw-medium" style={{ fontSize: "13px" }}>{error.last_error_message || "Unknown"}</td>
                                    <td className="text-end px-4">
                                      <Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-2">{error.occurrence} hits</Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-success small fw-bold">🚀 System Healthy: No recurring failures</div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    {/* Recent Activity */}
                    <Card className="border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
                      <div className="p-4 border-bottom">
                        <h6 className="m-0 fw-bold text-secondary small text-uppercase">Recent Activity</h6>
                      </div>
                      <div className="flex-grow-1" style={{ maxHeight: "600px", overflowY: "auto" }}>
                        <ListGroup variant="flush">
                          {(analytics.recent_hits ?? []).map((hit, i) => {
                            const isFailed = hit.status !== "SUCCESS";
                            return (
                              <ListGroup.Item 
                                key={i} 
                                action 
                                onClick={() => navigate(`/log_details/${hit.id}`)}
                                className={`px-4 py-3 border-0 ${isFailed ? "bg-danger bg-opacity-10" : ""}`}
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <div className={`fw-bold small ${isFailed ? "text-danger" : ""}`}>{hit.event_type.split(".").pop()}</div>
                                    <div className="text-muted" style={{ fontSize: "10px" }}>{hit.time}</div>
                                    <div className="fw-bold mt-1">{hit.amount ? `$${parseFloat(hit.amount).toFixed(2)}` : "--"}</div>
                                  </div>
                                  <Badge bg={isFailed ? "danger" : "success"} className="bg-opacity-10 text-uppercase" 
                                         style={{ color: isFailed ? "#DC2626" : "#059669", fontSize: "9px" }}>
                                    {hit.status}
                                  </Badge>
                                </div>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            ) : (
              !showEmptyState && (
                <div className="text-center py-5 mt-5">
                  <Spinner animation="grow" variant="primary" size="sm" className="me-2" />
                  <span className="text-muted fw-medium">Loading gateway insights...</span>
                </div>
              )
            )}
          </Container>
        </div>
      </div>

      {/* Modal & Styles remain the same, ensuring Modal is outside the filter container */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setRegisteredUrl(""); }} centered>
          <Modal.Header closeButton className="border-0 pb-0">
<Modal.Title className="fw-bold">Register Gateway</Modal.Title>
</Modal.Header>
<Modal.Body className="pt-3">
{!registeredUrl ? (
<Form onSubmit={handleRegister}>
<Form.Group className="mb-3">
<Form.Label className="small fw-bold">Gateway Name</Form.Label>
<Form.Control
type="text"
placeholder="e.g. Stripe Main Store"
required
onChange={(e) =>
setFormData({ ...formData, name: e.target.value })
}/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label className="small fw-bold">Provider Type</Form.Label>
<Form.Select
onChange={(e) =>
setFormData({ ...formData, provider_type: e.target.value })
}>
<option value="stripe">Stripe</option>
<option value="adyen">Adyen</option>
<option value="paypal">PayPal</option>
</Form.Select>
</Form.Group>

<Form.Group className="mb-4">
<Form.Label className="small fw-bold">Webhook Secret (Signing Secret)</Form.Label>
<Form.Control
type="password"
placeholder="whsec_..."
required
onChange={(e) =>setFormData({ ...formData, webhook_secret: e.target.value })}/>
</Form.Group>

    <Button
        variant="primary"
        type="submit"
        className="w-100 fw-bold py-2 border-0"
        style={{ background: THEME.accent }}
        disabled={isCreating}
      >
        {isCreating ? <Spinner size="sm" /> : "Generate Webhook URL"}</Button>
      </Form>
      ) : (
      <div className="text-center py-3">
      <div className="mb-3 p-3 bg-success bg-opacity-10 text-success rounded-3 small fw-bold">✅ Gateway Registered!</div>
    <p className="small text-secondary mb-2">
        Paste this URL in your Provider's Webhook settings:
    </p>
      <div className="p-3 bg-light border rounded-3 mb-4">
        <code className="text-break" style={{ fontSize: "12px" }}>
     {registeredUrl}
        </code>
       </div>
       <Button
        variant="dark"
        className="w-100 fw-bold"
        onClick={() => setShowModal(false)}
       >
        Done
       </Button>
      </div>
   )}
    </Modal.Body>
      </Modal>

      <style>{`
        .status-indicator { width: 8px; height: 8px; background: #CBD5E1; border-radius: 50%; }
        .status-indicator.active { background: #10B981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Dashboard;