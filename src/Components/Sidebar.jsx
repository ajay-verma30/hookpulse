import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BellRing, Globe } from "lucide-react";

const Sidebar = ({ selectedGateway, gateways, onSelectGateway }) => {
  return (
    <div style={styles.sidebar}>
      {/* Logo Section (Optional but recommended) */}
      <div style={{ padding: "0 12px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "bold" }}>HookPulse</h4>
      </div>

      <Nav className="flex-column" style={styles.navLinks}>
        <div style={styles.sectionLabel}>Overview</div>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <LayoutDashboard size={18} style={styles.icon} />
          Main Dashboard
        </NavLink>

        <div style={styles.sectionLabel}>Your Gateways</div>
        <div style={styles.gatewayList}>
          {gateways.map((gw) => (
            <div
              key={gw.id}
              onClick={() => onSelectGateway(gw.id)}
              style={{
                ...styles.gatewayItem,
                ...(selectedGateway === gw.id ? styles.activeGateway : {}),
              }}
            >
              <Globe size={14} style={styles.icon} />
              <span style={styles.gatewayName}>{gw.name}</span>
              {selectedGateway === gw.id && <div style={styles.activeIndicator} />}
            </div>
          ))}
        </div>

        <div style={styles.divider} />
        <NavLink
          to="/communications/config"
          state={{ gatewayId: selectedGateway }}
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <BellRing size={18} style={styles.icon} />
          Communications
        </NavLink>
      </Nav>
    </div>
  );
};

const styles = {
  sidebar: {
    height: "100vh",
    width: "260px",
    backgroundColor: "#0f172a",
    padding: "24px 12px",
    color: "#cbd5e1",
    display: "flex",
    flexDirection: "column",
    // Sticky/Fixed Logic
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    overflowY: "auto", // List badi hone par sidebar scroll hoga
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    color: "#64748b",
    fontWeight: "700",
    padding: "20px 12px 8px 12px",
    letterSpacing: "0.05em",
  },
  gatewayList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  gatewayItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    position: "relative",
    color: "#94a3b8",
  },
  activeGateway: {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    fontWeight: "500",
  },
  activeIndicator: {
    position: "absolute",
    left: "-4px",
    height: "20px",
    width: "3px",
    backgroundColor: "#38bdf8",
    borderRadius: "0 4px 4px 0",
  },
  gatewayName: {
    marginLeft: "10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  activeLink: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
  },
  icon: {
    minWidth: "20px",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: "15px 12px",
  }
};

export default Sidebar;