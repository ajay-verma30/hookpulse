import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BellRing } from "lucide-react";

const Sidebar = ({ selectedGateway }) => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>H</div>
        <h4 style={styles.logoText}>HookPulse <span style={styles.logoBadge}>RCA</span></h4>
      </div>

      <Nav className="flex-column" style={styles.navLinks}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <LayoutDashboard size={20} style={styles.icon} />
          Dashboard
        </NavLink>

        <NavLink
          to="/communications/config"
          state={{ gatewayId: selectedGateway }}
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <BellRing size={20} style={styles.icon} />
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
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#0f172a", // Dark navy jo image mein hai
    padding: "24px 16px",
    color: "#fff",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    paddingLeft: "8px",
  },
  logoIcon: {
    backgroundColor: "#3b82f6", // Blue accent
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
  logoText: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  logoBadge: {
    fontSize: "0.8rem",
    color: "#3b82f6",
    fontWeight: "600",
  },
  navLinks: {
    gap: "8px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    color: "#94a3b8", // Muted slate color
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  activeLink: {
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue tint
    color: "#fff",
  },
  icon: {
    marginRight: "12px",
  },
};

export default Sidebar;