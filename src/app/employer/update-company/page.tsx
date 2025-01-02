"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany, updateCompany } from "@/actions/companyActions";
import { IUpdateCompany } from "@/types/company";
import { ICompany } from "@/models/Company";

export default function UpdateCompanyPage() {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [formData, setFormData] = useState<IUpdateCompany>({
    name: "",
    description: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyResponse = await getUserCompany();
        if (!companyResponse.success || !companyResponse.data) {
          router.push("/employer/create-company");
          return;
        }

        setCompany(companyResponse.data);
        setFormData({
          name: companyResponse.data.name,
          description: companyResponse.data.description || "",
          website: companyResponse.data.website || "",
        });
      } catch (err) {
        setError("An error occurred while fetching the company.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompany();
    }
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company) return;

    try {
      const result = await updateCompany(company._id, formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to update the company.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Update Company</h1>
      {success && (
        <p style={{ color: "green" }}>Company updated successfully!</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="website">Website:</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Company</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
