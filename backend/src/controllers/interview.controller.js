import { PDFParse } from "pdf-parse";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import Interview from "../models/interviewReport.model.js";

/**
 * @name generateInterviewReportController
 * @description Generate interview report from resume and job description
 * @access private
 */
export const generateInterviewReportController = async (req, res) => {
  const resumeContent = await new PDFParse({
    data: Uint8Array.from(req.file.buffer),
  }).getText();

  const { selfDescription, jobDescription } = req.body;

  const interviewReportAI = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await Interview.create({
    user: req.user._id,
    resumeText: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportAI,
  });

  res.status(201).json({
    message: "Interview Report created successfully",
    interviewReport,
  });
};

/**
 * @name getInterviewReportController
 * @description Get a specific interview report by ID
 * @access private
 */
export const getInterviewReportController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await Interview.findById({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found",
      });
    }

    res.status(200).json({
      message: "Interview Report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @name getAllReportOfUserController
 * @description Get all interview reports of a user
 * @access private
 */
export const getAllReportOfUserController = async (req, res) => {
  try {
    const interviewReports = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("title matchScore createdAt");

    res.status(200).json({
      message: "Interview Reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @name generateResumePdfController
 * @description Generate resume PDF from interview report
 * @access private
 */
export const generateResumePdfController = async (req, res) => {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await Interview.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found",
      });
    }

    const { resumeText, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="resume-${Date.now()}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
