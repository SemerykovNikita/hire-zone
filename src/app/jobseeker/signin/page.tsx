"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function JobSeekerSignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    const result = await signIn("credentials", {
      email,
      password,
      role: "job_seeker",
      redirect: false,
    });

    if (result?.error) {
      setError("Failed to sign in. Please check your credentials.");
    } else {
      window.location.href = "/jobseeker/dashboard";
    }
  };

  return (
    <div>
      <h1>Job Seeker Sign In</h1>
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
