// app/welcome/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WelcomeContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const enName = searchParams.get("en_name");
  const userId = searchParams.get("user_id");
  const openId = searchParams.get("open_id");
  const employeeId = searchParams.get("employee_id");
  const email = searchParams.get("email");
  const avatar = searchParams.get("avatar");

  return (
    <div style={styles.container}>
      {avatar && <img src={avatar} alt="avatar" style={styles.avatar} />}
      <h1 style={styles.welcome}>👋 Welcome, {name}!</h1>
      <div style={styles.card}>
        <Row label="Display Name" value={name} />
        <Row label="English Name" value={enName} />
        <Row label="User ID" value={userId} />
        <Row label="Open ID" value={openId} />
        <Row label="Employee ID" value={employeeId} />
        <Row label="Email" value={email} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value || "—"}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { fontFamily: "sans-serif", maxWidth: 480, margin: "60px auto", padding: 24, textAlign: "center" },
  avatar: { width: 80, height: 80, borderRadius: "50%", marginBottom: 16 },
  welcome: { fontSize: 28, marginBottom: 24, color: "#1a1a2e" },
  card: { background: "#f5f7fa", borderRadius: 12, padding: 24, textAlign: "left" },
  row: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e0e0e0" },
  label: { fontWeight: 600, color: "#555" },
  value: { color: "#222" },
};

export default function WelcomePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <WelcomeContent />
    </Suspense>
  );
}