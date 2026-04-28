import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, InputGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { Bell, MessageSquare, Mail, Activity, Save, Shield, Zap, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TopNavbar from '../Components/TopNavbar';
import Sidebar from '../Components/Sidebar';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #f8fafc;
    --surface: #ffffff;
    --surface-2: #f1f5f9;
    --border: #e2e8f0;
    --border-hover: #cbd5e1;
    --text: #0f172a;
    --text-muted: #64748b;
    --accent: #10b981;
    --accent-dim: rgba(16, 185, 129, 0.1);
    --accent-glow: rgba(16, 185, 129, 0.2);
    --danger: #ef4444;
    --warning: #f59e0b;
    --blue: #3b82f6;
    --radius: 12px;
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ns-wrapper {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    padding: 48px 0;
  }

  .ns-header {
    font-family: 'Syne', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .ns-header-icon {
    width: 42px;
    height: 42px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .ns-card {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
    transition: all var(--transition);
    overflow: hidden;
  }

  .ns-card:hover {
    border-color: var(--border-hover) !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.06) !important;
  }

  .ns-card-header {
    background: #fafafa !important;
    border-bottom: 1px solid var(--border) !important;
    padding: 16px 24px !important;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ns-card-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }

  .channel-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 0;
  }

  .channel-row + .channel-row {
    border-top: 1px solid var(--border);
  }

  .channel-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .channel-icon.email { background: #eff6ff; color: var(--blue); }
  .channel-icon.slack { background: #fffbeb; color: var(--warning); }

  .channel-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
  }

  .channel-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  /* Inputs */
  .ns-input, .ns-input-group .form-control, .ns-input-group .input-group-text {
    background: #ffffff !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    font-size: 0.9rem !important;
  }

  .ns-input:focus, .ns-input-group .form-control:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px var(--accent-dim) !important;
  }

  /* Switches */
  .ns-switch .form-check-input {
    background-color: #cbd5e1 !important;
    border-color: #cbd5e1 !important;
  }

  .ns-switch .form-check-input:checked {
    background-color: var(--accent) !important;
    border-color: var(--accent) !important;
  }

  /* Event checkboxes */
  .event-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    margin-bottom: 10px;
    transition: all var(--transition);
    cursor: pointer;
    background: #fff;
  }

  .event-item:hover {
    border-color: var(--accent);
    background: #f8fafc;
  }

  .event-item.active {
    border-color: var(--accent);
    background: #f0fdf4;
  }

  .event-checkbox {
    width: 18px !important;
    height: 18px !important;
    border-radius: 4px !important;
    border: 2px solid var(--border-hover) !important;
  }

  .event-checkbox:checked {
    background-color: var(--accent) !important;
    border-color: var(--accent) !important;
  }

  /* Save button */
  .ns-save-btn {
    background: var(--text) !important;
    border: none !important;
    color: white !important;
    font-weight: 600;
    padding: 12px 32px !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  }

  .ns-save-btn:hover {
    background: #000 !important;
    transform: translateY(-1px);
  }

  .always-on-badge {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #dcfce7;
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
  }
`;

const NotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const location = useLocation();

  const [config, setConfig] = useState({
    slack_webhook_url: '',
    slack_enabled: false,
    email_enabled: true,
    amount_threshold: 500,
    failure_threshold: 10,
    notify_threshold_breach: true,
    notify_retry_exhausted: true,
    notify_loss_recovered: true,
  });

  const gatewayId = location.state?.gatewayId || localStorage.getItem("selectedGateway");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
          if (!gatewayId) {
    return (
      <div className="ns-wrapper d-flex align-items-center justify-content-center">
        <Alert variant="warning">Please select a gateway from the dashboard first.</Alert>
      </div>
    );
  }
        const res = await axios.get(`/api/v1/notifications/config/${gatewayId}`);
        if (res.data) setConfig(res.data);
      } catch (err) {
        console.error('Error fetching config', err);
      }
      setLoading(false);
    };
    fetchConfig();
  }, [gatewayId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`/api/v1/notifications/config/${gatewayId}`, config);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to save settings.' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const eventItems = [
    {
      key: 'notify_threshold_breach',
      label: 'Threshold Breaches',
      sub: 'Alert when a large failure exceeds the amount threshold',
      badge: 'HIGH',
      badgeColor: '#ef4444',
    },
    {
      key: 'notify_retry_exhausted',
      label: 'Auto-Retry Exhausted',
      sub: 'Final failure after all retry attempts are consumed',
      badge: 'CRITICAL',
      badgeColor: '#f59e0b',
    },
    {
      key: 'notify_loss_recovered',
      label: 'Loss Recovery',
      sub: 'Success after a previously failed transaction',
      badge: 'RECOVERY',
      badgeColor: '#10b981',
    },
  ];

  if (loading) {
    return (
      <div className="ns-wrapper d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
    <TopNavbar/>
      <Row>
        <Col md={2}>
            <Sidebar/>
        </Col>
        <Col md={10}>
            <style>{styles}</style>
      <div className="ns-wrapper">
        <Container style={{ maxWidth: 720 }}>
          <div className="ns-header">
            <div className="ns-header-icon"><Bell size={20} /></div>
            Notification Settings
          </div>

          {message && (
            <Alert className={`ns-alert alert-${message.type} mb-4 border-0 shadow-sm`}>
              <CheckCircle size={15} className="me-2" />
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSave}>
            {/* Channels */}
            <Card className="ns-card">
              <Card.Header className="ns-card-header">
                <Shield size={14} className="text-muted" />
                <p className="ns-card-header-title">Delivery Channels</p>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="channel-row">
                  <div className="channel-icon email"><Mail size={18} /></div>
                  <div className="channel-info">
                    <div className="channel-name">Email Alerts</div>
                    <div className="channel-desc">Primary alerts sent to your account email.</div>
                  </div>
                  <div className="channel-control"><span className="always-on-badge">ALWAYS ON</span></div>
                </div>

                <div className="channel-row">
                  <div className="channel-icon slack"><MessageSquare size={18} /></div>
                  <div className="channel-info">
                    <div className="channel-name">Slack Webhook</div>
                    <div className="channel-desc">Push real-time failure alerts to Slack.</div>
                    {config.slack_enabled && (
                      <Form.Control
                        type="url"
                        className="ns-input mt-2"
                        placeholder="https://hooks.slack.com/services/..."
                        value={config.slack_webhook_url || ''}
                        onChange={(e) => setConfig({ ...config, slack_webhook_url: e.target.value })}
                        required
                      />
                    )}
                  </div>
                  <div className="channel-control">
                    <Form.Check
                      type="switch"
                      className="ns-switch"
                      checked={config.slack_enabled}
                      onChange={(e) => setConfig({ ...config, slack_enabled: e.target.checked })}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Thresholds */}
            <Card className="ns-card">
              <Card.Header className="ns-card-header">
                <Activity size={14} className="text-muted" />
                <p className="ns-card-header-title">Alert Thresholds</p>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted text-uppercase">Amount ($)</Form.Label>
                    <InputGroup className="ns-input-group">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={config.amount_threshold}
                        onChange={(e) => setConfig({ ...config, amount_threshold: parseInt(e.target.value) })}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted text-uppercase">Failures / Hour</Form.Label>
                    <InputGroup className="ns-input-group">
                      <InputGroup.Text>#</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={config.failure_threshold}
                        onChange={(e) => setConfig({ ...config, failure_threshold: parseInt(e.target.value) })}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Events */}
            <Card className="ns-card">
              <Card.Header className="ns-card-header">
                <Bell size={14} className="text-muted" />
                <p className="ns-card-header-title">Notify On</p>
              </Card.Header>
              <Card.Body className="p-4">
                {eventItems.map((item) => (
                  <div
                    key={item.key}
                    className={`event-item ${config[item.key] ? 'active' : ''}`}
                    onClick={() => setConfig({ ...config, [item.key]: !config[item.key] })}
                  >
                    <input type="checkbox" className="event-checkbox me-2" checked={config[item.key]} readOnly />
                    <div style={{ flex: 1 }}>
                      <div className="channel-name">{item.label}</div>
                      <div className="channel-desc small">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end mt-4">
              <Button className="ns-save-btn" type="submit" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <><Save size={16} className="me-2" /> Save Settings</>}
              </Button>
            </div>
          </Form>
        </Container>
      </div>
        </Col>
      </Row>
    </>
  );
};

export default NotificationSettings;