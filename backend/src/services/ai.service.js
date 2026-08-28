import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 and 100 indicating how well the candidate's resume matches the job description.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention behind the technical question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, what mistakes to avoid, etc.",
          ),
      }),
    )
    .describe(
      "A list of technical questions that can be asked in the interview, along with their intention and answer.",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention behind the behavioral question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, what mistakes to avoid, etc.",
          ),
      }),
    )
    .describe(
      "A list of behavioral questions that can be asked in the interview, along with their intention and answer.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking or needs improvement in",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, indicating how critical it is for the candidate to improve this skill",
          ),
      }),
    )
    .describe(
      "A list of skill gaps that the candidate has, along with their severity.",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan"),
        focus: z.string().describe("The main focus or topic for that day"),
        task: z
          .array(z.string())
          .describe(
            "A list of tasks or activities to be completed on that day",
          ),
      }),
    )
    .describe(
      "A detailed preparation plan for the candidate, outlining what to focus on and what tasks to complete each day.",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated based on user input, it should be concise and relevant to the job description.",
    ),
});

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  try {
    const prompt = `Generate an interview report for a candidate based on the following information: - Job Description: ${jobDescription} - Resume: ${resume} - Self Description: ${selfDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(interviewReportSchema),
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Error generating interview report:", err);
  }
}

async function generatePdfFromHtml(htmlContent) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Convert HTML → PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true, // 👈 Ensures CSS @page rules are prioritized
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    await browser.close();

    return pdfBuffer;
  } catch (err) {
    console.error("Error generating pdf from html:", err);
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which ca be converted to PDF using any library like puppeteer",
      ),
  });

  try {
    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should be concise, ideally 1-2 pages long when converted to PDF. Include clean CSS in a <style> tag with professional styling, clear typography, and well-structured sections. Focus on quality, relevant experience, and high-impact bullet points.
                    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(resumePdfSchema),
      },
    });

    const jsonContent = JSON.parse(response.text);
    // Gemini HTML → Puppeteer → PDF
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating resume PDF:", error);
  }
}

export { generateInterviewReport, generateResumePdf };
