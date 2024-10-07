"use client";

import { useState } from "react";
import { createUser } from "@/actions/userActions";
import { IUserCreate } from "@/types/user";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function EmployerRegisterPage() {
  const [formData, setFormData] = useState<IUserCreate>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employer",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createUser(formData);
      if (result.success) {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (signInResult?.error) {
          setError("Failed to sign in automatically.");
        } else {
          router.push("/employer/create-company");
        }
      } else {
        setError(result.error || "Failed to create user.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Employer Register</h1>
      {success && <p>Registration successful!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
