import api from "../../../api/axios.js";

/**
 * @description Submit the interview data to the server
 * @access private
 * @params selfDescription, jobDescription, resumeFile
 */
export async function submit({ selfDescription, jobDescription, resumeFile }) {
  try {
    const formData = new FormData();
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Get a specific interview report by ID
 * @access private
 * @params interviewId
 */
export async function getInterviewReportById(interviewId) {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Get all interview reports of a user
 * @access private
 * @params void
 */
export async function getAllReportOfUser() {
  try {
    const response = await api.get(`/api/interview`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Generate resume pdf
 * @access private
 * @params interviewReportId
 */
export async function getGenerateResumePdf({ interviewReportId }) {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      null,
      { responseType: "blob" },
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
