"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCompanyById, updateCompany } from "@/actions/companyActions";
import {
  IUpdateCompany,
  IGetCompanyResponse,
  IUpdateCompanyResponse,
} from "@/types/company";
import { ICompany } from "@/models/Company";

export default function EditCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const [formData, setFormData] = useState<ICompany | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const companyId = params.id;

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response: IGetCompanyResponse = await getCompanyById(companyId);
        if (response.success && response.data) {
          const company = response.data;
          // Перевірка, чи користувач є власником компанії
          if (company.owner.toString() === session?.user.id) {
            setFormData(company);
            setIsOwner(true);
          } else {
            setError("You do not have permission to edit this company.");
          }
        } else {
          setError(response.error || "Company not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the company data.");
      }
    };

    if (session) {
      fetchCompanyData();
    }
  }, [companyId, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    const updateData: IUpdateCompany = {
      name: formData.name,
      description: formData.description,
      website: formData.website,
    };

    try {
      const result: IUpdateCompanyResponse = await updateCompany(
        companyId,
        updateData
      );
      if (result.success) {
        router.push("/employer/dashboard");
      } else {
        setError(result.error || "Failed to update the company.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!isOwner) {
    return <p>You do not have permission to edit this company.</p>;
  }

  return (
    <div>
      <h1>Edit Company</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {formData && (
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
            value={formData.description || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website || ""}
            onChange={handleChange}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Company"}
          </button>
        </form>
      )}
    </div>
  );
}
