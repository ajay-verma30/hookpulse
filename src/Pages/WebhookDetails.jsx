import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCcw,
  Info,
  AlertTriangle,
  Code,
} from "lucide-react";
import { useAuth } from "../Middleware/AuthContext";
import TopNavbar from "../Components/TopNavbar";
import Sidebar from "../Components/Sidebar";

function WebhookDetails() {
  const { webhook_id } = useParams();
  const { API } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gatewayIdFromUrl = queryParams.get("gateway");

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replaying, setReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Gateway name is provided directly from the log response (gateway_name).
  // No need for a separate /gateways fetch just for a display label.
  const gatewayDisplayName = log?.gateway_name || gatewayIdFromUrl || "N/A";

  const getFailureType = useCallback((log) => {
    const payload = log?.payload?.data?.object;
    if (payload?.last_payment_error) return "USER_FAILURE";
    if (
      log.status === "FAILED" &&
      (log.http_status_code >= 500 ||
        log.error_stack ||
        log.last_error_message === "timeout")
    ) {
      return "SYSTEM_FAILURE";
    }
    return "UNKNOWN";
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/analytics/logs/${webhook_id}`);
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

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-medium">Loading event data...</p>
      </div>
    );
  }

  if (!log) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger" className="border-0 shadow-sm">
          Webhook log not found.
        </Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const failureType = getFailureType(log);
  const canReplay = failureType === "SYSTEM_FAILURE";

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      <TopNavbar />

      <Row>
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col md={10}>
          <Container className="py-5">
            {/* 🔙 Navigation */}
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="mb-4 text-decoration-none text-muted p-0 d-flex align-items-center"
            >
              <ArrowLeft size={16} className="me-2" />
              Back to logs
            </Button>

            {/* 🧾 Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3
                    className="fw-bold m-0 text-dark"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    {log.event_type}
                  </h3>
                  <Badge
                    pill
                    bg={log.status === "SUCCESS" ? "success" : "danger"}
                    className="px-3"
                  >
                    {log.status}
                  </Badge>
                </div>
                <p className="text-muted font-monospace small mb-0">
                  ID: {log.provider_event_id}
                </p>
              </div>

              <Stack direction="horizontal" gap={3}>
                <Badge
                  bg="white"
                  className={`border ${failureType === "SYSTEM_FAILURE" ? "text-warning border-warning" : "text-primary border-primary"} px-3 py-2`}
                >
                  {failureType.replace("_", " ")}
                </Badge>
                <Button
                  variant={canReplay ? "primary" : "light"}
                  className="shadow-sm px-4 fw-semibold"
                  onClick={handleReplay}
                  disabled={replaying || !canReplay}
                >
                  {replaying ? (
                    <>
                      <Spinner size="sm" className="me-2" /> Replaying...
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={16} className="me-2" /> Replay Event
                    </>
                  )}
                </Button>
              </Stack>
            </div>

            {/* 💬 Smart Guidance Cards */}
            {failureType === "USER_FAILURE" && (
              <Alert
                variant="info"
                className="border-0 shadow-sm d-flex align-items-center"
              >
                <Info size={20} className="me-3" />
                <div>
                  <strong>Payment Decline:</strong> This was triggered by the
                  customer's bank. Manual replay will likely yield the same
                  result.
                </div>
              </Alert>
            )}

            {failureType === "SYSTEM_FAILURE" && (
              <Alert
                variant="warning"
                className="border-0 shadow-sm d-flex align-items-center"
              >
                <AlertTriangle size={20} className="me-3" />
                <div>
                  <strong>System Error:</strong> Connection timeout or internal
                  error detected. Replay is recommended.
                </div>
              </Alert>
            )}

            {/* 🔁 Replay Toast-style Alert */}
            {replayResult && (
              <Alert
                variant={
                  replayResult.status === "SUCCESS" ? "success" : "danger"
                }
                className="border-0 shadow-sm animate__animated animate__fadeIn"
              >
                {replayResult.status === "SUCCESS"
                  ? `✅ Success: Event replayed in ${replayResult.latency}ms`
                  : "❌ Error: Replay attempt failed."}
              </Alert>
            )}

            <Row className="mt-4">
              {/* 📊 Metadata Sidebar */}
              <Col lg={4}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0 pt-4 pb-0">
                    <h6 className="text-uppercase text-muted fw-bold small mb-0">
                      Event Details
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <label className="text-muted small d-block">
                        Gateway
                      </label>
                      <span className="fw-medium text-dark">
                        {gatewayDisplayName}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small d-block">
                        Received At
                      </label>
                      <span className="fw-medium text-dark">
                        {new Date(log.received_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small d-block">
                        HTTP Status
                      </label>
                      <span
                        className={`fw-bold ${log.http_status_code >= 400 ? "text-danger" : "text-success"}`}
                      >
                        {log.http_status_code || 200}
                      </span>
                    </div>
                    <div>
                      <label className="text-muted small d-block">
                        Latency
                      </label>
                      <span className="fw-medium text-dark">
                        {log.latency_ms || 0} ms
                      </span>
                    </div>
                  </Card.Body>
                </Card>

                {log.last_error_message && (
                  <Card className="border-0 shadow-sm bg-danger text-white">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <AlertTriangle size={18} className="me-2" />
                        <span className="fw-bold">Error Log</span>
                      </div>
                      <p className="small mb-0 opacity-90">
                        {log.last_error_message}
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* 📦 Payload Viewer */}
              <Col lg={8}>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center text-muted">
                      <Code size={18} className="me-2" />
                      <span className="fw-bold small text-uppercase">
                        Payload Body
                      </span>
                    </div>
                    <Button
                      variant={copied ? "success" : "outline-secondary"}
                      size="sm"
                      onClick={copyToClipboard}
                      className="d-flex align-items-center transition-all"
                    >
                      {copied ? (
                        <Check size={14} className="me-1" />
                      ) : (
                        <Copy size={14} className="me-1" />
                      )}
                      {copied ? "Copied" : "Copy JSON"}
                    </Button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div
                      className="bg-dark p-4"
                      style={{
                        maxHeight: "600px",
                        overflowY: "auto",
                        backgroundColor: "#1e1e26 !important",
                      }}
                    >
                      <pre
                        className="m-0"
                        style={{ fontSize: "0.875rem", lineHeight: "1.6" }}
                      >
                        <code className="text-info">
                          {JSON.stringify(log.payload, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default WebhookDetails;
