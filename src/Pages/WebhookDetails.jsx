import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Stack,
} from "react-bootstrap";
import { useAuth } from "../Middleware/AuthContext";
import TopNavbar from "../Components/TopNavbar";

// --- Configuration Constants ---
const REPLAY_POLICIES = {
  SAFE: {
    events: ["payment_intent.payment_failed", "payment_intent.succeeded", "invoice.payment_failed", "invoice.paid"],
    label: "Safe to Replay",
    variant: "success",
    color: "#198754"
  },
  CAUTION: {
    events: ["charge.failed", "payment_intent.created"],
    label: "Use with Caution",
    variant: "warning",
    color: "#ffc107"
  },
  DANGEROUS: {
    events: ["charge.succeeded", "checkout.session.completed"],
    label: "Not Recommended",
    variant: "danger",
    color: "#dc3545"
  }
};

const JSON_THEME = {
  backgroundColor: "#1e1e1e",
  color: "#9cdcfe",
  maxHeight: "500px",
  overflow: "auto",
  fontSize: "0.875rem",
  borderRadius: "0 0 8px 8px"
};

function WebhookDetails() {
  const { webhook_id } = useParams();
  const { API } = useAuth();
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replaying, setReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // --- Logic ---
  const getSafetyConfig = useCallback((eventType) => {
    if (REPLAY_POLICIES.SAFE.events.includes(eventType)) return REPLAY_POLICIES.SAFE;
    if (REPLAY_POLICIES.CAUTION.events.includes(eventType)) return REPLAY_POLICIES.CAUTION;
    if (REPLAY_POLICIES.DANGEROUS.events.includes(eventType)) return REPLAY_POLICIES.DANGEROUS;
    return { label: "Unknown Risk", variant: "secondary", color: "#6c757d" };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/analytics/log/${webhook_id}`);
        setLog(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [webhook_id, API]);

  const handleReplay = async () => {
    setReplaying(true);
    setReplayResult(null);
    try {
      const res = await API.post(`/webhooks/replay/${webhook_id}`);
      setReplayResult({ status: "SUCCESS", latency: res.data.latency });
    } catch (err) {
      setReplayResult({ status: "FAILED" });
    } finally {
      setReplaying(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(log?.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Render Helpers ---
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="grow" variant="primary" />
    </div>
  );

  if (!log) return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">Webhook log not found or access denied.</Alert>
      <Button variant="outline-primary" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
    </Container>
  );

  const safety = getSafetyConfig(log.event_type);

  return (
    <div className="bg-light min-vh-100">
      <TopNavbar />
      <Container className="py-4">
        {/* Navigation */}
        <Button 
          variant="link" 
          onClick={() => navigate(-1)} 
          className="p-0 mb-4 text-decoration-none text-secondary small"
        >
          &larr; Back to Activity Logs
        </Button>

        {/* Header Section */}
        <header className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h3 fw-bold mb-0">{log.event_type}</h2>
              <Badge pill bg={log.status === "SUCCESS" ? "success" : "danger"} className="px-3">
                {log.status}
              </Badge>
            </div>
            <p className="text-muted font-monospace small mb-2">Event ID: {log.provider_event_id}</p>
            <div className="d-flex align-items-center gap-2">
               <span style={{ color: safety.color }}>●</span>
               <span className="text-uppercase fw-bold small text-muted" style={{ letterSpacing: '0.5px' }}>
                {safety.label}
               </span>
            </div>
          </div>

          <Stack direction="horizontal" gap={3}>
            <Button
              variant="primary"
              className="px-4 shadow-sm"
              onClick={handleReplay}
              disabled={replaying || safety.variant === "danger"}
            >
              {replaying ? <><Spinner size="sm" className="me-2" />Replaying...</> : "Replay Webhook"}
            </Button>
          </Stack>
        </header>

        {replayResult && (
          <Alert variant={replayResult.status === "SUCCESS" ? "success" : "danger"} className="border-0 shadow-sm mb-4">
            {replayResult.status === "SUCCESS" ? "Successfully re-dispatched webhook." : "Failed to replay webhook. Check server logs."}
            {replayResult.latency && <span className="ms-2 opacity-75">({replayResult.latency}ms)</span>}
          </Alert>
        )}

        <Row>
          {/* Metadata Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="text-muted fw-bold mb-4 small text-uppercase">Technical Metadata</h6>
                <div className="mb-3">
                  <label className="text-muted d-block small mb-1">Gateway</label>
                  <span className="fw-semibold">{log.gateway_name || "System Default"}</span>
                </div>
                <div className="mb-3">
                  <label className="text-muted d-block small mb-1">Received Time</label>
                  <span className="fw-semibold">{new Date(log.received_at).toLocaleString()}</span>
                </div>
                <div className="mb-3">
                  <label className="text-muted d-block small mb-1">HTTP Status</label>
                  <Badge bg="light" text="dark" className="border">{log.http_status_code || 200} OK</Badge>
                </div>
                <div>
                  <label className="text-muted d-block small mb-1">Processing Latency</label>
                  <span className="fw-semibold">{log.latency_ms || 0} ms</span>
                </div>
              </Card.Body>
            </Card>

            {log.last_error_message && (
              <Card className="border-0 shadow-sm border-start border-danger border-4">
                <Card.Body>
                  <h6 className="text-danger fw-bold small text-uppercase mb-2">Error Stack</h6>
                  <code className="text-dark small d-block" style={{ wordBreak: 'break-all' }}>
                    {log.last_error_message}
                  </code>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Main Content Area */}
          <Col lg={8}>
            {/* RCA Section */}
            {log.status !== "SUCCESS" && (
              <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <Card.Header className="bg-danger text-white border-0 py-3">
                   <h6 className="mb-0 fw-bold">Root Cause Analysis</h6>
                </Card.Header>
                <Card.Body className="bg-white">
                  <Row className="mb-4">
                    <Col sm={6}>
                      <p className="text-muted small fw-bold text-uppercase mb-1">Issue Category</p>
                      <Badge bg="secondary" className="text-uppercase">{log.issue_category || "Uncategorized"}</Badge>
                    </Col>
                    <Col sm={6}>
                      <p className="text-muted small fw-bold text-uppercase mb-1">Severity Score</p>
                      <span className={`fw-bold ${log.rca_severity === 'CRITICAL' ? 'text-danger' : 'text-warning'}`}>
                        {log.rca_severity || "NORMAL"}
                      </span>
                    </Col>
                  </Row>
                  <div className="p-3 rounded bg-light border">
                    <p className="text-muted small fw-bold text-uppercase mb-2">Recommended Action</p>
                    <p className="mb-0 text-dark">{log.suggested_fix || "No specific fix identified. Manual inspection required."}</p>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Payload Section */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold text-muted small text-uppercase">Payload Data</h6>
                <Button size="sm" variant="outline-secondary" onClick={copyToClipboard} style={{ fontSize: '12px' }}>
                  {copied ? "Copied!" : "Copy JSON"}
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <pre className="p-4 m-0" style={JSON_THEME}>
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default WebhookDetails;