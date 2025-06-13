// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserDetails,
  updateUserProfile,
  deleteUserAccount,
} from "@/actions/userActions";
import { signOut } from "next-auth/react";
import { User, Mail, AlertCircle, Loader2, Save, Trash2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      const result = await updateUserProfile({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => router.push("/user/profile"), 2000);
      } else {
        setError(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const result = await deleteUserAccount();
        if (result.success) {
          await signOut();
          router.push("/goodbye");
        } else {
          setError(result.error || "Failed to delete account.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-primary/5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
          </div>

          {(error || success) && (
            <div className={`p-4 ${error ? "bg-red-50" : "bg-green-50"}`}>
              <div className="flex items-center space-x-2">
                {error ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Save className="h-5 w-5 text-green-500" />
                )}
                <p className={error ? "text-red-700" : "text-green-700"}>
                  {error || success}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>First Name</span>
                </div>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Last Name</span>
                </div>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Account
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                Warning: Deleting your account is permanent and cannot be
                undone. All your data will be permanently removed.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center px-4 py-2 border border-red-600 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
