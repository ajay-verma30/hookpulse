import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  Container, Form, Row, Col, Spinner, Badge,
  ButtonGroup, Button, Card, Modal, Alert
} from "react-bootstrap";
import { useAuth } from "../Middleware/AuthContext";
import TopNavbar from "../Components/TopNavbar";
import Sidebar from "../Components/Sidebar";
import AnalyticsChart from "../Components/AnalyticsChart";
import {
  ShieldCheck, Zap, TrendingUp, ArrowUpRight, Activity,
  AlertCircle, CheckCircle2, RefreshCw, ChevronRight,
  DollarSign, BarChart2, XCircle, Wifi
} from "lucide-react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');

  :root {
    --bg:          #F4F6FA;
    --surface:     #FFFFFF;
    --surface-2:   #F0F2F7;
    --surface-3:   #E8EBF2;
    --border:      #DDE1EC;
    --border-2:    #C8CDDE;
    --text:        #111827;
    --text-2:      #5A6480;
    --text-3:      #9AA3B8;
    --green:       #00A86B;
    --green-dim:   rgba(0,168,107,0.08);
    --green-glow:  rgba(0,168,107,0.18);
    --green-mid:   rgba(0,168,107,0.35);
    --blue:        #2B7FE0;
    --blue-dim:    rgba(43,127,224,0.08);
    --red:         #E53E5A;
    --red-dim:     rgba(229,62,90,0.08);
    --amber:       #D97706;
    --amber-dim:   rgba(217,119,6,0.08);
    --purple:      #7C5FD4;
    --r:           12px;
    --r-lg:        18px;
    --font:        'Bricolage Grotesque', sans-serif;
    --mono:        'Geist Mono', monospace;
  }

  * { box-sizing: border-box; }

  .db-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    color: var(--text);
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }

  /* ── Hero Recovery Banner ── */
  .hero-banner {
    position: relative;
    background: linear-gradient(135deg, #EAF7F2 0%, #EEF4FF 100%);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 28px 32px;
    margin-bottom: 24px;
    overflow: hidden;
  }
  .hero-banner::before {
    content: '';
    position: absolute;
    top: -60px; left: -60px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, var(--green-glow) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-banner::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -40px;
    width: 300px; height: 200px;
    background: radial-gradient(ellipse, rgba(77,158,255,0.06) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-amount {
    font-size: 3.2rem;
    font-weight: 800;
    color: var(--green);
    line-height: 1;
    letter-spacing: -1.5px;
  }
  .hero-label {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-2);
    margin-bottom: 8px;
  }
  .hero-sub {
    font-size: 0.88rem;
    color: var(--text-2);
    margin-top: 6px;
  }
  .hero-divider {
    width: 1px;
    background: var(--border);
    align-self: stretch;
    margin: 0 32px;
  }
  .recovery-rate-ring {
    position: relative;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
  }
  .recovery-rate-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--green);
    line-height: 1.1;
  }
  .recovery-rate-text span {
    font-size: 0.55rem;
    font-weight: 500;
    color: var(--text-2);
    letter-spacing: 0.04em;
  }

  /* ── Active Status Pill ── */
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--green-dim);
    border: 1px solid var(--green-glow);
    border-radius: 99px;
    padding: 4px 12px;
    font-size: 0.73rem;
    font-weight: 600;
    color: var(--green);
    letter-spacing: 0.04em;
  }
  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .status-pill.offline {
    background: var(--red-dim);
    border-color: rgba(255,77,106,0.25);
    color: var(--red);
  }
  .status-pill.offline .status-dot {
    background: var(--red);
    box-shadow: 0 0 6px var(--red);
    animation: none;
  }

  /* ── Metric Cards ── */
  .metric-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 20px;
    transition: border-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .metric-card:hover {
    border-color: var(--border-2);
    transform: translateY(-2px);
  }
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: var(--r) var(--r) 0 0;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .metric-card:hover::before { opacity: 1; }
  .metric-card.green::before  { background: var(--green); }
  .metric-card.blue::before   { background: var(--blue); }
  .metric-card.red::before    { background: var(--red); }
  .metric-card.amber::before  { background: var(--amber); }
  .metric-card.purple::before { background: var(--purple); }

  .metric-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .metric-val {
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .metric-title {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  /* ── Panel Cards ── */
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .panel-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-title {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-2);
    margin: 0;
  }

  /* ── Chart insight bar ── */
  .chart-insight {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,181,71,0.06);
    border: 1px solid rgba(255,181,71,0.15);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 0.8rem;
    color: var(--amber);
    margin-bottom: 20px;
  }

  /* ── RCA rows ── */
  .rca-row {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .rca-row:last-child { border-bottom: none; }
  .rca-row:hover { background: var(--surface-2); }
  .rca-badge {
    font-family: var(--mono);
    font-size: 0.65rem;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }
  .rca-tag {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-2);
    background: var(--surface-3);
    border: 1px solid var(--border-2);
    border-radius: 6px;
    padding: 3px 8px;
    margin-top: 4px;
    display: inline-block;
  }

  /* ── Activity feed ── */
  .activity-item {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { background: var(--surface-2); }
  .activity-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .activity-amount {
    font-family: var(--mono);
    font-size: 0.82rem;
    font-weight: 500;
  }
  .activity-time {
    font-size: 0.7rem;
    color: var(--text-3);
    font-family: var(--mono);
  }

  /* ── Filter buttons ── */
  .filter-group {
    display: flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
  }
  .filter-btn {
    border: none !important;
    background: transparent !important;
    color: var(--text-2) !important;
    font-family: var(--font) !important;
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    padding: 6px 14px !important;
    border-radius: 7px !important;
    transition: all 0.15s !important;
    letter-spacing: 0.02em;
  }
  .filter-btn:hover { color: var(--text) !important; background: var(--surface-2) !important; }
  .filter-btn.active { background: var(--surface-3) !important; color: var(--text) !important; border: 1px solid var(--border-2) !important; }

  /* ── Gateway selector ── */
  .gw-selector {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    border-radius: 10px !important;
    font-family: var(--font) !important;
    font-size: 0.88rem !important;
    font-weight: 600 !important;
    padding: 10px 16px !important;
    min-width: 220px;
    cursor: pointer;
  }
  .gw-selector:focus {
    border-color: var(--border-2) !important;
    box-shadow: none !important;
    background: var(--surface-2) !important;
    color: var(--text) !important;
  }
  .gw-selector option { background: var(--surface-2); color: var(--text); }

  /* ── Add gateway button ── */
  .add-gw-btn {
    background: var(--text) !important;
    border: none !important;
    color: var(--bg) !important;
    font-family: var(--font) !important;
    font-size: 0.82rem !important;
    font-weight: 700 !important;
    padding: 10px 18px !important;
    border-radius: 10px !important;
    transition: opacity 0.15s !important;
    letter-spacing: 0.02em;
  }
  .add-gw-btn:hover { opacity: 0.88 !important; }

  /* ── Insight widget ── */
  .insight-widget {
    background: linear-gradient(135deg, rgba(43,127,224,0.05), rgba(124,95,212,0.05));
    border: 1px solid rgba(43,127,224,0.15);
    border-radius: var(--r);
    padding: 16px 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .insight-icon {
    width: 32px; height: 32px;
    background: rgba(43,127,224,0.1);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--blue);
    flex-shrink: 0;
  }

  /* ── Modal styles ── */
  .db-modal .modal-content {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--r-lg) !important;
    color: var(--text) !important;
  }
  .db-modal .modal-header {
    border-bottom: 1px solid var(--border) !important;
    padding: 20px 24px !important;
  }
  .db-modal .modal-title { font-weight: 700 !important; font-size: 1rem !important; }
  .db-modal .btn-close { filter: none !important; opacity: 0.5 !important; }
  .db-modal .modal-body { padding: 24px !important; }
  .db-modal .form-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-2);
    margin-bottom: 8px;
  }
  .db-modal .form-control,
  .db-modal .form-select {
    background: var(--surface-2) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    border-radius: 10px !important;
    padding: 11px 14px !important;
    font-family: var(--font) !important;
    font-size: 0.88rem !important;
    transition: border-color 0.15s !important;
  }
  .db-modal .form-control:focus,
  .db-modal .form-select:focus {
    border-color: var(--border-2) !important;
    box-shadow: none !important;
    background: var(--surface-3) !important;
    color: var(--text) !important;
  }
  .db-modal .form-control::placeholder { color: var(--text-3) !important; }
  .db-modal .form-select option { background: var(--surface-2); }
  .db-modal-submit {
    background: var(--green) !important;
    border: none !important;
    color: #FFFFFF !important;
    font-family: var(--font) !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    padding: 12px !important;
    border-radius: 10px !important;
    width: 100%;
    transition: opacity 0.15s !important;
  }
  .db-modal-submit:hover { opacity: 0.9 !important; }
  .db-modal-submit:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }

  /* ── Empty state ── */
  .empty-overlay {
    position: absolute; inset: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
    background: rgba(244,246,250,0.75);
    display: flex; align-items: center; justify-content: center;
  }
  .empty-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 40px 48px;
    text-align: center;
    max-width: 380px;
    width: 90%;
  }
  .empty-icon {
    width: 60px; height: 60px;
    background: var(--green-dim);
    border: 1px solid var(--green-glow);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--green);
  }

  /* ── Animations ── */
  .fade-up {
    animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.10s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.20s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.30s; }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function RecoveryRing({ pct = 0, size = 72 }) {
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="recovery-rate-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--green)" strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="recovery-rate-text">
        {pct}%<span>saved</span>
      </div>
    </div>
  );
}

function MetricCard({ title, val, color, icon: Icon, iconBg, delay = "" }) {
  return (
    <div className={`metric-card ${color} fade-up ${delay}`}>
      <div className="metric-icon" style={{ background: iconBg }}>
        <Icon size={16} color={`var(--${color === 'green' ? 'green' : color === 'blue' ? 'blue' : color === 'red' ? 'red' : color === 'amber' ? 'amber' : 'purple'})`} />
      </div>
      <div className="metric-val" style={{ color: `var(--${color === 'green' ? 'green' : color === 'blue' ? 'blue' : color === 'red' ? 'red' : color === 'amber' ? 'amber' : 'purple'})` }}>
        {val ?? "--"}
      </div>
      <div className="metric-title">{title}</div>
    </div>
  );
}

const RCA_HINTS = {
  "generic_decline":         { label: "Bank Decline (Generic)",     hint: "Retry after 24h — auto-handled" },
  "insufficient_funds":      { label: "Insufficient Funds",          hint: "Schedule retry on payday cycle" },
  "card_expired":            { label: "Card Expired",                hint: "Send card-update request to customer" },
  "do_not_honor":            { label: "Card Blocked by Bank",        hint: "Customer must call their bank" },
  "authentication_required": { label: "3DS Auth Required",          hint: "Redirect customer to re-authenticate" },
};
function humanizeError(msg) {
  if (!msg) return "Unknown Error";
  const key = msg.toLowerCase().replace(/\s+/g,"_");
  return RCA_HINTS[key]?.label || msg.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase());
}
function errorHint(msg) {
  if (!msg) return "Monitor and investigate";
  const key = msg.toLowerCase().replace(/\s+/g,"_");
  return RCA_HINTS[key]?.hint || "Auto-retry scheduled — no action needed";
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
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
  const [filter, setFilter] = useState("1h");

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [registeredUrl, setRegisteredUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "", provider_type: "stripe", webhook_secret: "",
  });

  const fetchAnalytics = useCallback(async (gatewayId, timeFilter, silent = false) => {
    if (!gatewayId) return;
    if (!silent) setIsFetching(true);
    try {
      const res = await API.get(`/analytics/${gatewayId}?filter=${timeFilter}`);
      setAnalytics(res.data);
      setIsLivePulse(true);
      setTimeout(() => setIsLivePulse(false), 800);
    } catch (err) { console.error(err); }
    finally { setIsFetching(false); }
  }, [API]);

  const fetchGateways = useCallback(async () => {
    try {
      const res = await API.get("/gateways");
      const data = res.data.gateways || res.data;
      setGateways(data);
      const storedId = localStorage.getItem("selectedGateway");
      const isValid = data.some((gw) => gw.id === storedId);
      if (isValid) setSelectedGateway(storedId);
      else if (data.length > 0) setSelectedGateway(data[0].id);
    } catch (err) { console.error("Fetch Gateways Error:", err); }
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
    } finally { setIsCreating(false); }
  };

  if (authLoading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="db-root vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" style={{ color: "var(--green)" }} />
        </div>
      </>
    );
  }

  // Derived values
  const summary   = analytics?.summary || {};
  const loss      = analytics?.loss    || {};
  const recoveredAmt  = loss.recovered?.amount  || "$0";
  const atRiskAmt     = loss.total_at_risk?.amount || "$0";
  const netLossAmt    = loss.net_loss?.amount || "$0";
  const successRate   = summary.success_rate || "0%";
  const recoveryPct   = parseInt(successRate) || 0;
  const gwName        = gateways.find(g => g.id === selectedGateway)?.name || "Gateway";
  const showEmptyState = gateways.length === 0;

  const METRICS = [
    { title: "Total Payments",     val: summary.total_events, color: "blue",   icon: BarChart2,   iconBg: "var(--blue-dim)",  delay: "stagger-1" },
    { title: "Payment Success",    val: successRate,           color: "green",  icon: CheckCircle2,iconBg: "var(--green-dim)", delay: "stagger-2" },
    { title: "Failed Payments",    val: summary.failed_events, color: "red",    icon: XCircle,     iconBg: "var(--red-dim)",   delay: "stagger-3" },
    { title: "Revenue at Risk",    val: atRiskAmt,             color: "amber",  icon: AlertCircle, iconBg: "var(--amber-dim)", delay: "stagger-4" },
    { title: "Recovered Revenue",  val: recoveredAmt,          color: "green",  icon: ShieldCheck, iconBg: "var(--green-dim)", delay: "stagger-5" },
    { title: "Final Loss",         val: netLossAmt,            color: "red",    icon: TrendingUp,  iconBg: "var(--red-dim)",   delay: "stagger-6" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">
        <TopNavbar />

        <div className="d-flex">
          {/* Sidebar */}
          <div style={{ width: "240px", minHeight: "calc(100vh - 60px)", flexShrink: 0 }}>
            <Sidebar 
  selectedGateway={selectedGateway} 
  gateways={gateways} 
  onSelectGateway={(id) => setSelectedGateway(id)} 
/>
          </div>

          {/* Main */}
          <div className="flex-grow-1 pb-5 position-relative" style={{ minWidth: 0 }}>
            {showEmptyState && (
              <div className="empty-overlay" style={{marginTop:"-600px"}}>
                <div className="empty-card">
                  <div className="empty-icon"><Zap size={26} /></div>
                  <h5 style={{ fontWeight: 800, marginBottom: 8 }}>No Gateway Connected</h5>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginBottom: 24 }}>
                    Connect a payment provider to start recovering failed payments automatically.
                  </p>
                  <button className="add-gw-btn" style={{ width: "100%", padding: "12px", borderRadius: "10px", cursor: "pointer" }} onClick={() => setShowModal(true)}>
                    + Register Your First Gateway
                  </button>
                </div>
              </div>
            )}

            <Container fluid className="p-4" style={{ filter: showEmptyState ? "grayscale(0.8) blur(2px)" : "none", pointerEvents: showEmptyState ? "none" : "auto" }}>

              {/* ── Top bar ── */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                {/* <div className="d-flex align-items-center gap-3">
                  <Form.Select
                    className="gw-selector"
                    value={selectedGateway}
                    onChange={(e) => setSelectedGateway(e.target.value)}
                  >
                    <option value="" disabled>Select Gateway</option>
                    {gateways.map((gw) => (
                      <option key={gw.id} value={gw.id}>{gw.name}</option>
                    ))}
                  </Form.Select>
                  <div className={`status-pill ${analytics?.is_active || isLivePulse ? "" : "offline"}`}>
                    <span className="status-dot" />
                    {isLivePulse ? "Syncing…" : analytics?.is_active ? "Recovery Active" : "Offline"}
                  </div>
                </div> */}
                <div className="d-flex gap-2 align-items-center">
                  <div className="filter-group">
                    {["1h","24h","7d","30d"].map(t => (
                      <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <button className="add-gw-btn" onClick={() => setShowModal(true)}>+ Add Gateway</button>
                </div>
              </div>
<Alert variant="info" className="mb-3">
  🚀 We’re in beta — your account is free during early access.
</Alert>
              {/* ── Hero Recovery Banner ── */}
              {analytics && (
                <div className="hero-banner fade-up mb-4">
                  <div className="d-flex align-items-center flex-wrap gap-4">
                    <div>
                      <div className="hero-label">Revenue Recovered · {filter}</div>
                      <div className="hero-amount">{recoveredAmt}</div>
                      <div className="hero-sub">
                        Automatically salvaged from <strong style={{ color: "var(--text)" }}>{atRiskAmt}</strong> at-risk revenue
                      </div>
                    </div>
                    <div className="hero-divider d-none d-md-block" />
                    <div className="d-flex align-items-center gap-16" style={{ gap: 16 }}>
                      <RecoveryRing pct={recoveryPct} />
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Recovery Rate</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>of failed payments<br />recovered automatically</div>
                      </div>
                    </div>
                    <div className="hero-divider d-none d-lg-block" />
                    <div style={{ marginLeft: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <RefreshCw size={14} color="var(--green)" />
                        <span style={{ fontSize: "0.82rem", color: "var(--green)", fontWeight: 600 }}>Auto-Recovery is Active</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-2)" }}>No manual action needed.<br />Retries run in the background.</div>
                    </div>
                  </div>
                </div>
              )}

              {isFetching && !analytics && (
                <div className="text-center py-5">
                  <Spinner animation="grow" style={{ color: "var(--green)", width: "1rem", height: "1rem" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-2)", marginLeft: 12 }}>Loading payment insights…</span>
                </div>
              )}

              {analytics && (
                <>
                  {/* ── Metrics row ── */}
                  <Row className="g-3 mb-4">
                    {METRICS.map((m, i) => (
                      <Col key={i} xs={6} md={4} lg={2}>
                        <MetricCard {...m} />
                      </Col>
                    ))}
                  </Row>

                  {/* ── Insight of the Week ── */}
                  <div className="insight-widget mb-4 fade-up stagger-3">
                    <div className="insight-icon"><Zap size={16} /></div>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--blue)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                        Weekly Insight
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                        <strong style={{ color: "var(--text)" }}>{recoveryPct}% of failed payments</strong> were recovered within minutes — {gwName} auto-retry is running optimally.
                      </div>
                    </div>
                  </div>

                  {/* ── Chart + Activity ── */}
                  <Row className="g-4">
                    <Col lg={8}>

                      {/* Chart Panel */}
                      <div className="panel mb-4 fade-up stagger-2">
                        <div className="panel-header">
                          <div className="panel-title">Payment Traffic Flow</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.73rem", color: "var(--text-2)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                              Recovered
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
                              Failed
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          {(analytics.chart_data || []).some(d => d.failed > 0) && (
                            <div className="chart-insight">
                              <AlertCircle size={14} />
                              Failures detected — most recovered within minutes by auto-retry
                            </div>
                          )}
                          <AnalyticsChart
                            data={analytics.chart_data}
                            darkMode={false}
                            summary={analytics.summary}
                            topErrors={analytics.top_errors ?? []}
                          />
                        </div>
                      </div>

                      {/* RCA Panel */}
                      <div className="panel fade-up stagger-3">
                        <div className="panel-header">
                          <div className="panel-title">Revenue Guard — Failure Analysis</div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>
                            {(analytics.top_errors ?? []).length} issue{(analytics.top_errors ?? []).length !== 1 ? "s" : ""} detected
                          </span>
                        </div>
                        {(analytics.top_errors ?? []).length > 0 ? (
                          (analytics.top_errors).map((error, idx) => (
                            <div className="rca-row" key={idx}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--red-dim)", border: "1px solid rgba(255,77,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <XCircle size={14} color="var(--red)" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                                  {humanizeError(error.last_error_message)}
                                </div>
                                <div className="rca-tag">✓ {errorHint(error.last_error_message)}</div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div className="rca-badge" style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(255,77,106,0.2)" }}>
                                  {error.occurrence}×
                                </div>
                                <div style={{ fontSize: "0.68rem", color: "var(--text-3)", marginTop: 4 }}>occurrences</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "32px 24px", textAlign: "center" }}>
                            <CheckCircle2 size={28} color="var(--green)" style={{ marginBottom: 10 }} />
                            <div style={{ fontSize: "0.88rem", color: "var(--green)", fontWeight: 600 }}>No Recurring Failures</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-2)", marginTop: 4 }}>Payment system is healthy</div>
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col lg={4}>
                      {/* Activity Feed */}
                      <div className="panel fade-up stagger-4" style={{ height: "100%" }}>
                        <div className="panel-header">
                          <div className="panel-title">Last 10 Activities</div>
                          <Activity size={14} color="var(--text-2)" />
                        </div>
                        <div style={{ overflowY: "auto", maxHeight: 600 }}>
                          {(analytics.recent_hits ?? []).map((hit, i) => {
                            const isFailed = hit.status !== "SUCCESS";
                            return (
                              <div className="activity-item" key={i} onClick={() => navigate(`/log_details/${hit.id}?gateway=${selectedGateway}`)}>
                                <span className="activity-dot" style={{ background: isFailed ? "var(--red)" : "var(--green)" }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {hit.event_type?.split(".").pop()}
                                  </div>
                                  <div className="activity-time">{hit.time}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <div className="activity-amount" style={{ color: isFailed ? "var(--red)" : "var(--text)" }}>
                                    {hit.amount ? `$${parseFloat(hit.amount).toFixed(2)}` : "--"}
                                  </div>
                                  <div style={{ fontSize: "0.68rem", fontWeight: 700, marginTop: 2, letterSpacing: "0.06em", color: isFailed ? "var(--red)" : "var(--green)" }}>
                                    {isFailed ? "FAILED" : "RECOVERED"}
                                  </div>
                                </div>
                                <ChevronRight size={12} color="var(--text-3)" style={{ marginLeft: 4 }} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </div>
        </div>

        {/* ── Register Modal ── */}
        <Modal show={showModal} onHide={() => { setShowModal(false); setRegisteredUrl(""); }} centered className="db-modal">
          <Modal.Header closeButton>
            <Modal.Title>Register Payment Gateway</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!registeredUrl ? (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Gateway Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Stripe Production" required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Provider</label>
                  <select className="form-select"
                    onChange={(e) => setFormData({ ...formData, provider_type: e.target.value })}>
                    <option value="stripe">Stripe</option>
                    <option value="adyen">Adyen</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label">Webhook Signing Secret</label>
                  <input type="password" className="form-control" placeholder="whsec_…" required
                    onChange={(e) => setFormData({ ...formData, webhook_secret: e.target.value })} />
                </div>
                <button className="db-modal-submit" type="submit" disabled={isCreating}>
                  {isCreating ? <Spinner size="sm" style={{ borderColor: "rgba(0,26,14,0.3)", borderRightColor: "transparent" }} /> : "Generate Webhook URL →"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ width: 52, height: 52, background: "var(--green-dim)", border: "1px solid var(--green-glow)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--green)" }}>
                  <CheckCircle2 size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>Gateway Registered!</div>
                <p style={{ fontSize: "0.83rem", color: "var(--text-2)", marginBottom: 16 }}>Paste this URL in your provider's Webhook settings:</p>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
                  <code style={{ fontSize: "0.78rem", color: "var(--green)", wordBreak: "break-all", fontFamily: "var(--mono)" }}>{registeredUrl}</code>
                </div>
                <button className="db-modal-submit" onClick={() => setShowModal(false)}>Done</button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Dashboard;