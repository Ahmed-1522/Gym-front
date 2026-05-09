import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MemberHome() {
  const [member, setMember] = useState(null);
  const [hoveredButton, setHoveredButton] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setMember({
      id: 1,
      name: "Test User",
      email: "test@email.com",
      phone: "01000000000",
      subscriptionStatus: "ACTIVE",
      currentPlan: "Premium"
    });
  }, []);

  if (!member) return <p>Loading...</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Profile</h1>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          <i className="fas fa-user"></i>
        </div>

        <h2 style={styles.name}>{member.name}</h2>

        <p style={styles.memberId}>
          Member ID: #{member.id}
        </p>

        <p style={styles.info}>
          <span>Email:</span> {member.email}
        </p>

        <p style={styles.info}>
          <span>Phone:</span> {member.phone}
        </p>

        <p style={styles.info}>
          <span>Current Plan:</span> {member.currentPlan}
        </p>

        <p style={styles.status}>
          Status: {member.subscriptionStatus}
        </p>

        <div style={styles.buttons}>
          <button
            style={{
              ...styles.goldBtn,
              ...(hoveredButton === "gold" && styles.goldBtnHover)
            }}
            onMouseEnter={() => setHoveredButton("gold")}
            onMouseLeave={() => setHoveredButton("")}
          >
            Edit Profile
          </button>

          <button
            style={{
              ...styles.darkBtn,
              ...(hoveredButton === "dark" && styles.darkBtnHover)
            }}
            onMouseEnter={() => setHoveredButton("dark")}
            onMouseLeave={() => setHoveredButton("")}
            onClick={() => navigate("/subscription")}
          >
            View Plans
          </button>

          <button
            style={{
              ...styles.redBtn,
              ...(hoveredButton === "red" && styles.redBtnHover)
            }}
            onMouseEnter={() => setHoveredButton("red")}
            onMouseLeave={() => setHoveredButton("")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "60px 20px",
    textAlign: "center"
  },

  title: {
    color: "#FFD700",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "1px",
    textAlign: "left",
    marginBottom: "30px",
    marginTop: "-20px",
    marginLeft: "20px"
  },

  profileCard: {
    maxWidth: "650px",
    margin: "auto",
    background: "linear-gradient(145deg, #111, #1a1a1a)",
    border: "1px solid rgba(255,215,0,0.5)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 0 30px rgba(255,215,0,0.08)",
    transition: "0.3s ease"
  },

  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(255,215,0,0.1)",
    border: "2px solid #FFD700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "40px",
    color: "#FFD700"
  },

  name: {
    fontSize: "32px",
    marginBottom: "10px"
  },

  memberId: {
    color: "#FFD700",
    fontSize: "18px",
    marginBottom: "25px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  },

  info: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#ddd"
  },

  status: {
    color: "#00ff99",
    fontWeight: "700",
    marginTop: "20px",
    marginBottom: "30px",
    fontSize: "20px"
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap"
  },

  goldBtn: {
    background: "linear-gradient(135deg, #FFD700, #B8860B)",
    color: "#111",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },

  goldBtnHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255,215,0,0.5)"
  },

  darkBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #FFD700",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },

  darkBtnHover: {
    background: "#FFD700",
    color: "#111",
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255,215,0,0.4)"
  },

  redBtn: {
    background: "#ff2e2e",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },

  redBtnHover: {
    background: "#ff0000",
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255,0,0,0.4)"
  }
};