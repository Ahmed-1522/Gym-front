export default function Footer() {
  return (
    <div style={styles.footer}>
      <p>© 2024 Gold's Gym. All rights reserved.</p>

      <div style={styles.icons}>
        <a href="#" style={styles.icon}>
          <i className="fab fa-facebook-f"></i>
        </a>

        <a href="#" style={styles.icon}>
          <i className="fab fa-instagram"></i>
        </a>

        <a href="#" style={styles.icon}>
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </div>
  );
}

const styles = {
  footer: {
    width: "100%",
    background: "#111",
    color: "#fff",
    textAlign: "center",
    padding: "20px 0"
  },
  icons: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  icon: {
    color: "#fff",
    fontSize: "20px",
    textDecoration: "none"
  }
};