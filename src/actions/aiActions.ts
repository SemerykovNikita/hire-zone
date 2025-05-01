import { getJobVacancyById } from "./jobVacancyActions";
import { getUserResumes } from "./userActions";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function analyzeJobEligibility(vacancyId: string) {
  try {
    const vacancy = await getJobVacancyById(vacancyId);
    if (!vacancy.success || !vacancy.data) {
      throw new Error("Vacancy not found");
    }

    const userResume = await getUserResumes();
    if (!userResume.success || !userResume.data.length) {
      throw new Error("No resumes found");
    }

    const resumeFiles = userResume.data.map(
      (resume: { url: string | URL }) => ({
        type: "file",
        data: new URL(resume.url),
        mimeType: "application/pdf",
      })
    );

    const { textStream } = streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content:
            "Ти фахівець з управління персоналом. Подумайте про те, щоб дати цьому кандидату шанс на роботу, якщо необхідні зміни незначні. Якщо ні, надайте чіткі поради щодо того, чого потрібно навчитися або вдосконалити, щоб відповідати вимогам. дай відповідь на укр",
        },
        {
          role: "user",
          content: `This is the vacancy title: "${
            vacancy.data.title
          }", description: "${
            vacancy.data.description
          }", requirements: "${vacancy.data.requirements.join(", ")}".`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "These are my resumes:" },
            ...resumeFiles,
          ],
        },
      ],
    });

    return { success: true, data: textStream };
  } catch (error) {
    console.error("Error in analyzeJobEligibility:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
