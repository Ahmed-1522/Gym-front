import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  content: {
    flex: 1
  }
};