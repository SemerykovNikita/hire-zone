"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserDetails,
  updateUserProfile,
  deleteUserAccount,
} from "@/actions/userActions";
import { signOut } from "next-auth/react";

export default function UpdateProfilePage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getUserDetails();
        if (result.success) {
          setUserData(result.data);
        } else {
          setError(result.error || "Failed to load user details.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const result = await updateUserProfile({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
      if (result.success) {
        setSuccess("Profile updated successfully!");
        router.push("/profile");
      } else {
        setError(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const result = await deleteUserAccount();
        if (result.success) {
          alert(result.message);
          router.push("/goodbye");
          await signOut();
        } else {
          setError(result.error || "Failed to delete account.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Update Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={userData.role}
            disabled
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <hr />

      <h2>Delete Account</h2>
      <p>
        <strong>Warning:</strong> Deleting your account is permanent and cannot
        be undone.
      </p>
      <button
        type="button"
        style={{ color: "red" }}
        onClick={handleDeleteAccount}
      >
        Delete Account
      </button>
    </div>
  );
}
