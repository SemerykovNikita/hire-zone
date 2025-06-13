// @ts-nocheck

import { streamText } from "ai";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { getUserResumes } from "@/actions/userActions";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const [vacancy, userResume] = await Promise.all([
    getJobVacancyById(prompt),
    getUserResumes(),
  ]);

  if (!vacancy.success || !vacancy.data) {
    throw new Error("Vacancy not found");
  }

  const messages: any[] = [
    {
      role: "system",
      content:
        "Ви фахівець з управління персоналом. Подумайте про те, щоб дати цьому кандидату шанс на роботу, якщо необхідні зміни незначні. Якщо ні, надайте чіткі поради щодо того, чого потрібно навчитися або вдосконалити, щоб відповідати вимогам. дай відповідь на укр",
    },
    {
      role: "user",
      content: `This is the vacancy title: "${
        vacancy.data.title
      }", description: "${
        vacancy.data.description
      }", requirements: "${vacancy.data.requirements.join(", ")}".`,
    },
  ];

  if (userResume?.data?.length > 0) {
    const resumeFiles = userResume.data.map(
      (resume: { url: string | URL }) => ({
        type: "file",
        data: new URL(resume.url),
        mimeType: "application/pdf",
      })
    );

    messages.push({
      role: "user",
      content: [
        { type: "text", text: "These are my resumes:" },
        ...resumeFiles,
      ],
    });
  }

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages,
  });

  return result.toDataStreamResponse();
}
