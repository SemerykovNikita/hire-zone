// @ts-nocheck

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
import {
  Building2,
  FileText,
  Globe,
  Loader2,
  AlertCircle,
  Save,
} from "lucide-react";

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
          if (company.owner.toString() === session?.user.id) {
            setFormData(company);
            setIsOwner(true);
          } else {
            setError("У вас немає дозволу на редагування цієї компанії.");
          }
        } else {
          setError(response.error || "Компанію не знайдено.");
        }
      } catch (err) {
        setError("Сталася помилка під час завантаження даних компанії.");
      }
    };

    if (session) {
      fetchCompanyData();
    }
  }, [companyId, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        setError(result.error || "Не вдалося оновити компанію.");
      }
    } catch (err) {
      setError("Сталася невідома помилка.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader2 className="h-8 w-8 text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg w-full">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg w-full">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">
              У вас немає дозволу на редагування цієї компанії.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8" />
            Редагувати компанію
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {formData && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Назва компанії
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Назва компанії"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                  <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Опис
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    placeholder="Опис компанії"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                  <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Вебсайт
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                  <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Оновлення...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Оновити компанію
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
