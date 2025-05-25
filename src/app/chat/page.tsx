import { createChat } from "@/tools/chat-store";
import { redirect } from "next/navigation";
import { getJobVacanciesByEmployer } from "@/actions/jobVacancyActions";
import Link from "next/link";
import { Briefcase, MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page({
  searchParams,
}: {
  searchParams: { jobVacancyId?: string };
}) {
  // If jobVacancyId is provided, create a chat and redirect
  if (searchParams.jobVacancyId) {
    const id = await createChat(searchParams.jobVacancyId);
    redirect(`/chat/${id}?jobVacancyId=${searchParams.jobVacancyId}`);
  }

  // Get the current user session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/chat");
  }

  // Fetch only the employer's job vacancies
  const jobVacanciesResponse = await getJobVacanciesByEmployer(session.user.id);

  if (!jobVacanciesResponse.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p>
              {jobVacanciesResponse.error ||
                "Failed to load your job vacancies"}
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
            Select Your Job Vacancy to Chat About
          </h1>
          <p className="text-gray-600 mt-2">
            Choose one of your job vacancies to start a conversation
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
              <p className="text-gray-600">
                You don't have any job vacancies yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
