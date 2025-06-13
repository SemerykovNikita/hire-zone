// @ts-nocheck
import { getApplicationsByJobVacancyId } from "@/actions/applicationActions";
import { getChatById } from "@/actions/chatActions";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { saveChat } from "@/tools/chat-store";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { appendResponseMessages, createIdGenerator, streamText } from "ai";

export async function POST(req: Request) {
  try {
    let { messages, id, jobVacancyId } = await req.json();

    if (!jobVacancyId) {
      const chat = await getChatById(id);

      if (!chat) {
        throw new Error("Chat not found");
      }
      jobVacancyId = chat.jobVacancy;
    }

    const [vacancy, jobVacancyApplications] = await Promise.all([
      getJobVacancyById(jobVacancyId),
      getApplicationsByJobVacancyId(jobVacancyId),
    ]);

    if (!vacancy.success || !vacancy.data) {
      throw new Error("Vacancy not found");
    }
    if (
      !jobVacancyApplications.success ||
      !jobVacancyApplications.data?.length
    ) {
      throw new Error("No resumes found");
    }

    const resumeFiles = jobVacancyApplications.data
      .filter((application) => application.resumeUrl)
      .map((application) => ({
        type: "file",
        data: new URL(application.resumeUrl),
        mimeType: "application/pdf",
      }));

    const requestMessages = [
      {
        role: "system",
        content:
          "Ти фахівець з управління персоналом. Проаналізуй надані резюме для цієї вакансії і вкажи, який кандидат найкраще підходить.",
      },
      {
        role: "user",
        content: `Назва вакансії: "${vacancy.data.title}". 
                  Опис: "${vacancy.data.description}". 
                  Вимоги: "${vacancy.data.requirements.join(", ")}".`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "These are the submitted resumes:" },
          ...resumeFiles,
        ],
      },
      ...messages,
    ];

    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      messages: requestMessages,
      experimental_generateMessageId: createIdGenerator({
        prefix: "msgs",
        size: 16,
      }),
      async onFinish({ response }) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages: messages,
            responseMessages: response.messages,
          }),
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
