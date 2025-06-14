// @ts-nocheck

import { createChat } from "@/tools/chat-store";
import { redirect } from "next/navigation";
import { getJobVacanciesByEmployer } from "@/actions/jobVacancyActions";
import Link from "next/link";
import { Briefcase, MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function Page({
  searchParams,
}: {
  searchParams: { jobVacancyId?: string };
}) {
  if (searchParams.jobVacancyId) {
    const id = await createChat(searchParams.jobVacancyId);
    redirect(`/chat/${id}?jobVacancyId=${searchParams.jobVacancyId}`);
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/chat");
  }

  const jobVacanciesResponse = await getJobVacanciesByEmployer(session.user.id);

  if (!jobVacanciesResponse.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Помилка</h1>
            <p>
              {jobVacanciesResponse.error ||
                "Не вдалося завантажити ваші вакансії"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const jobVacancies = jobVacanciesResponse.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Оберіть вакансію для спілкування
          </h1>
          <p className="text-gray-600 mt-2">
            Виберіть одну зі своїх вакансій, щоб почати розмову
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobVacancies.length > 0 ? (
            jobVacancies.map((vacancy) => (
              <Link
                key={vacancy._id}
                href={`/chat?jobVacancyId=${vacancy._id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <h2 className="font-semibold text-lg truncate">
                    {vacancy.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {vacancy.description}
                </p>
                <div className="text-sm text-gray-500">
                  {vacancy.city} • {vacancy.company}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600">У вас ще немає жодної вакансії.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
