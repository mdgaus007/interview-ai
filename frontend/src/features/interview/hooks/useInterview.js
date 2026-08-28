import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context.jsx";
import {
  submit,
  getAllReportOfUser,
  getInterviewReportById,
  getGenerateResumePdf,
} from "../services/interview.api.js";
import { useNavigate, useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within InterviewProvider");
  }

  const { interviewId } = useParams();

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const [pdfLoading, setPdfLoading] = useState(false);

  const generatePDF = async (interviewReportId) => {
    try {
      setPdfLoading(true);
      const response = await getGenerateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      setPdfLoading(false);
    }
  };

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    try {
      setLoading(true);
      const response = await submit({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
      //navigate(`/interview/${response.interviewReport._id}`);
      return response.interviewReport;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    try {
      setLoading(true);
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllReport = async () => {
    try {
      setLoading(true);
      const response = await getAllReportOfUser();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReport();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReport,
    generatePDF,
    pdfLoading,
  };
};
