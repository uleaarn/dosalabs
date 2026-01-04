import React, { useEffect, useState } from "react";
import {
  applyActionCode,
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode
} from "firebase/auth";
import { auth } from "../lib/firebase.ts";

export default function AuthAction() {
  const [mode, setMode] = useState<string | null>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [status, setStatus] = useState("Processing...");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode"));
    setOobCode(params.get("oobCode"));
  }, []);

  useEffect(() => {
    if (!mode || !oobCode) return;

    if (mode === "verifyEmail") {
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus("Email verified successfully. Redirecting...");
          setTimeout(() => (window.location.href = "/#/dashboard"), 2000);
        })
        .catch(() => setStatus("Verification link invalid or expired."));
    }

    if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => setStatus("Please enter your new password."))
        .catch(() => setStatus("Reset link invalid or expired."));
    }
  }, [mode, oobCode]);

  const handleReset = async () => {
    if (!oobCode) return;
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("Password reset successful. Redirecting...");
      setTimeout(() => (window.location.href = "/#/login"), 2000);
    } catch (e) {
      setStatus("Failed to reset password. Please try again.");
    }
  };

  if (mode === "resetPassword" && status === "Please enter your new password.") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-graySubtle">
        <div className="bg-white p-10 rounded-card border border-grayBorder shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent"
            />
            <button 
              onClick={handleReset} 
              className="w-full py-4 bg-ink text-white rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-graySubtle">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink">{status}</h2>
        <div className="mt-8 animate-pulse text-accent">● ● ●</div>
      </div>
    </div>
  );
}