"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import { createCompany } from "@/actions/companyActions";
import { ICompanyCreate } from "@/types/company";

export default function CreateCompanyPage() {
  const [formData, setFormData] = useState<ICompanyCreate>({
    name: "",
    description: "",
    website: "",
    owner: new mongoose.Types.ObjectId(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!session || !session.user) {
      setError("You must be logged in to create a company.");
      setIsSubmitting(false);
      return;
    }

    const ownerId = new mongoose.Types.ObjectId(session.user.id);
    const newCompanyData: ICompanyCreate = { ...formData, owner: ownerId };

    try {
      const result = await createCompany(newCompanyData);
      if (result.success) {
        setSuccess(true);
        setFormData({
          name: "",
          description: "",
          website: "",
          owner: new mongoose.Types.ObjectId(),
        });
        router.push("/employer/dashboard");
      } else {
        setError(result.error || "Failed to create company.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create Company</h1>
      {success && <p>Company created successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}
