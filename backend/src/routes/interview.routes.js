import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  generateInterviewReportController,
  getInterviewReportController,
  getAllReportOfUserController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @routes POST /api/interview
 * @description Generate a new interview report on the basis of resume, job description and self description
 * @access private
 */
interviewRouter.post(
  "/",
  isAuth,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @routes GET /api/interview/report/:interviewId
 * @description Get a specific interview report by ID
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  isAuth,
  getInterviewReportController,
);

/**
 * @routes GET /api/interview
 * @description Get all interview reports of a user
 * @access private
 */
interviewRouter.get("/", isAuth, getAllReportOfUserController);

/**
 * @routes GET /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume PDF from interview report
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  isAuth,
  generateResumePdfController,
);

export default interviewRouter;
