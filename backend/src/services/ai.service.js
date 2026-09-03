import Groq from "groq-sdk";
import puppeteer from "puppeteer";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  try {
    const prompt = `You are an expert technical interviewer and career coach.
Analyze the candidate's resume and details against the target job description and generate a comprehensive interview preparation report in valid JSON format.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

You MUST respond strictly with a valid JSON object matching this exact structure:
{
  "title": "A concise and relevant job title based on the job description",
  "matchScore": 80,
  "technicalQuestions": [
    {
      "question": "technical question text",
      "intention": "intention behind the question",
      "answer": "detailed answer, key points, approach, and common mistakes to avoid"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "behavioral question text",
      "intention": "intention behind the question",
      "answer": "how to answer this using the STAR method"
    }
  ],
  "skillGaps": [
    {
      "skill": "skill name",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Core Fundamentals & Concept Revision",
      "task": ["Review core language concepts", "Study time and space complexities", "Solve 3 foundational coding problems"]
    },
    {
      "day": 2,
      "focus": "Advanced Framework Concepts & Architecture",
      "task": ["Study state management and component lifecycle", "Review performance optimization techniques", "Implement a mini sample module"]
    },
    {
      "day": 3,
      "focus": "Database & API Design",
      "task": ["Review schema design and indexing", "Practice writing complex SQL/NoSQL queries", "Design RESTful APIs following best practices"]
    },
    {
      "day": 4,
      "focus": "System Design & Scalability",
      "task": ["Study caching, load balancing, and rate limiting", "Design a scalable architecture for an interview use-case", "Review trade-offs between SQL vs NoSQL"]
    },
    {
      "day": 5,
      "focus": "Behavioral & Final Mock Interviews",
      "task": ["Prepare STAR-format answers for past projects", "Practice explaining conflict resolution and leadership", "Conduct a timed full mock interview"]
    }
  ]
}

CRITICAL RULES:
1. You MUST generate at least 5 to 7 full days in "preparationPlan" (Day 1 through Day 5 or 7).
2. Inside each day of "preparationPlan", the list of tasks MUST be an array of strings under the exact key "task".
3. In "skillGaps", "severity" must only be "low", "medium", or "high".
4. "matchScore" must be a number between 0 and 100.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer and recruiter. Always output strictly valid JSON conforming to the requested format.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq");
    }

    const report = JSON.parse(content);

    // Normalize preparationPlan to guarantee 'task' exists even if AI returned 'tasks'
    if (Array.isArray(report.preparationPlan)) {
      report.preparationPlan = report.preparationPlan.map((p) => ({
        day: p.day,
        focus: p.focus,
        task: Array.isArray(p.task)
          ? p.task
          : Array.isArray(p.tasks)
            ? p.tasks
            : [p.task || p.tasks || "Study relevant topics"],
      }));
    }

    return report;
  } catch (err) {
    console.error("Error generating interview report:", err);
    throw err;
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
      preferCSSPageSize: true,
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
    throw err;
  }
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  try {
    const prompt = `Generate a tailored, professional resume for a candidate based on:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

You MUST return a valid JSON object with a single property "html" containing clean, well-formatted, professional HTML with CSS embedded in a <style> tag.
The resume must be ATS-friendly, tailored to the job description, highlight relevant strengths, and fit 1-2 pages when converted to PDF.

Format:
{
  "html": "<!DOCTYPE html><html><head><style>body { font-family: sans-serif; }</style></head><body>...</body></html>"
}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer and ATS specialist. Return only a valid JSON object with the 'html' property.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const jsonContent = JSON.parse(completion.choices[0]?.message?.content);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    throw error;
  }
}

export { generateInterviewReport, generateResumePdf };
