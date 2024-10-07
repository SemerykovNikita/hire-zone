"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function EmployerSignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    const result = await signIn("credentials", {
      email,
      password,
      role: "employer",
      redirect: false,
    });

    if (result?.error) {
      setError("Failed to sign in. Please check your credentials and role.");
    } else {
      window.location.href = "/employer/dashboard";
    }
  };

  return (
    <div>
      <h1>Employer Sign In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
