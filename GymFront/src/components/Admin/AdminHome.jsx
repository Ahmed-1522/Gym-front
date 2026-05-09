import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminHome() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState("");
  const [hoveredManage, setHoveredManage] = useState("");

  const adminSections = [
    {
      id: "members",
      title: "Members",
      desc: "Manage all gym members and member profiles",
      icon: "fas fa-users",
      color: "#FFD700",
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      desc: "Manage plans and subscriptions",
      icon: "fas fa-credit-card",
      color: "#00c2ff",
    },
    {
      id: "equipment",
      title: "Equipment",
      desc: "Manage gym equipment inventory",
      icon: "fas fa-dumbbell",
      color: "#ff7b00",
    },
    {
      id: "attendance",
      title: "Attendance",
      desc: "Track check-ins and check-outs",
      icon: "fas fa-calendar-check",
      color: "#00ff99",
    },
    {
      id: "invitations",
      title: "Invitations",
      desc: "Send and manage invitations",
      icon: "fas fa-envelope",
      color: "#ff4d6d",
    },
    {
      id: "reports",
      title: "Reports",
      desc: "Dashboard statistics and accounting",
      icon: "fas fa-chart-line",
      color: "#9b5cff",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>

          <p style={styles.subtitle}>Control and manage Gold's Gym system</p>
        </div>

        <button style={styles.logoutBtn} onClick={() => navigate("/logout")}>
          Logout
        </button>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>120</h2>
          <p style={styles.statText}>Total Members</p>
        </div>

        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>48</h2>
          <p style={styles.statText}>Active Subscriptions</p>
        </div>

        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>35</h2>
          <p style={styles.statText}>Equipment Items</p>
        </div>

        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>78</h2>
          <p style={styles.statText}>Today Attendance</p>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        {adminSections.map((section) => (
          <div
            key={section.id}
            style={{
              ...styles.card,
              ...(hoveredCard === section.id && styles.cardHover),
            }}
            onMouseEnter={() => setHoveredCard(section.id)}
            onMouseLeave={() => setHoveredCard("")}
          >
            <div
              style={{
                ...styles.iconBox,
                border: `2px solid ${section.color}`,
              }}
            >
              <i className={section.icon} style={{ color: section.color }}></i>
            </div>

            <h2 style={styles.cardTitle}>{section.title}</h2>

            <p style={styles.cardDesc}>{section.desc}</p>

            <button
              style={{
                ...styles.manageBtn,
                ...(hoveredManage === section.id && styles.manageBtnHover),
              }}
              onMouseEnter={() => setHoveredManage(section.id)}
              onMouseLeave={() => setHoveredManage("")}
              onClick={() => navigate(`/${section.id}`)}
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    padding: "50px 40px",
    color: "#fff",
  },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
    flexWrap: "wrap",
    gap: "20px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#FFD700",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#aaa",
    fontSize: "18px",
  },

  logoutBtn: {
    background: "#ff2e2e",
    border: "none",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "50px",
  },

  statCard: {
    background: "linear-gradient(145deg, #111, #1b1b1b)",
    border: "1px solid rgba(255,215,0,0.4)",
    borderRadius: "22px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(255,215,0,0.08)",
  },

  statNumber: {
    fontSize: "42px",
    color: "#FFD700",
    marginBottom: "10px",
  },

  statText: {
    color: "#ccc",
    fontSize: "17px",
  },

  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 280px))",
    justifyContent: "center",
    gap: "25px",
  },

  card: {
    background: "linear-gradient(145deg, #101010, #1a1a1a)",
    border: "1px solid rgba(255,215,0,0.3)",
    borderRadius: "24px",
    padding: "35px 25px",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 0 25px rgba(255,215,0,0.06)",
  },

  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 0 35px rgba(255,215,0,0.18)",
    border: "1px solid rgba(255,215,0,0.8)",
  },

  iconBox: {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "32px",
    background: "rgba(255,255,255,0.03)",
  },

  cardTitle: {
    fontSize: "28px",
    marginBottom: "15px",
    color: "#fff",
  },

  cardDesc: {
    color: "#bbb",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "25px",
  },

  manageBtn: {
    background: "linear-gradient(135deg, #FFD700, #B8860B)",
    color: "#111",
    border: "none",
    padding: "12px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  manageBtnHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255,215,0,0.5)",
  },
};
