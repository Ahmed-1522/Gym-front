import { useEffect, useState } from "react";

function Subscription() {
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 10,
      duration: 30,
      desc: "Access to gym equipment",
    },
    {
      id: 2,
      name: "Premium",
      price: 25,
      duration: 60,
      desc: "Equipment + cardio + coach",
    },
    {
      id: 3,
      name: "VIP",
      price: 50,
      duration: 90,
      desc: "All access + nutrition plan",
    },
  ];

  const [currentSub, setCurrentSub] = useState(null);

  const handleSubscribe = (plan) => {
    const existing = JSON.parse(localStorage.getItem("subscription"));

    if (existing && existing.status === "ACTIVE") {
      alert("You already have an active subscription");
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const newSubscription = {
      ...plan,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: "ACTIVE",
    };

    localStorage.setItem("subscription", JSON.stringify(newSubscription));
    setCurrentSub(newSubscription);
    alert("Subscription successful");
  };

  const handleCancel = () => {
    localStorage.removeItem("subscription");
    setCurrentSub(null);
    alert("Subscription cancelled");
  };

  const checkExpiration = () => {
    const sub = JSON.parse(localStorage.getItem("subscription"));
    if (!sub) return;

    const now = new Date();
    const end = new Date(sub.endDate);

    if (now > end && sub.status === "ACTIVE") {
      sub.status = "EXPIRED";
      localStorage.setItem("subscription", JSON.stringify(sub));
    }
  };

  useEffect(() => {
    checkExpiration();
    const sub = JSON.parse(localStorage.getItem("subscription"));
    if (sub) setCurrentSub(sub);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Plan</h1>

      {currentSub && (
        <div style={styles.current}>
          <h3>Current Plan: {currentSub.name}</h3>
          <p>Status: {currentSub.status}</p>

          <button
            style={styles.cancelBtn}
            onClick={handleCancel}
            onMouseEnter={(e) => (e.target.style.background = "#cc0000")}
            onMouseLeave={(e) => (e.target.style.background = "red")}
          >
            Cancel
          </button>
        </div>
      )}

      <div style={styles.cards}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px gold";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h2 style={styles.planName}>{plan.name}</h2>
            <p style={styles.price}>${plan.price}</p>
            <p style={styles.duration}>{plan.duration} days</p>
            <p style={styles.desc}>{plan.desc}</p>

            <button
              style={{
                ...styles.button,
                opacity: currentSub?.status === "ACTIVE" ? 0.5 : 1,
              }}
              onClick={() => handleSubscribe(plan)}
              disabled={currentSub?.status === "ACTIVE"}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#0d0d0d",
  color: "white",
  textAlign: "center",
  paddingTop: "50px",
  paddingBottom: "50px",
  overflowX: "hidden",
  boxSizing: "border-box",
},
  title: {
    marginBottom: "20px",
    fontSize: "32px",
    color: "gold",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  card: {
    background: "#1a1a1a",
    padding: "25px",
    borderRadius: "15px",
    width: "250px",
    border: "1px solid gold",
    transition: "0.3s",
    cursor: "pointer",
  },

  current: {
  background: "#222",
  padding: "20px",
  margin: "0 auto 30px",
  borderRadius: "15px",
  border: "1px solid gold",
  width: "840px",
  maxWidth: "90%",
  boxSizing: "border-box",
},

  planName: {
    fontSize: "22px",
    marginBottom: "10px",
  },

  price: {
    fontSize: "28px",
    color: "gold",
    marginBottom: "10px",
  },

  duration: {
    fontSize: "14px",
    marginBottom: "10px",
  },

  desc: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#ccc",
  },

  button: {
    background: "gold",
    color: "black",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  cancelBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Subscription;