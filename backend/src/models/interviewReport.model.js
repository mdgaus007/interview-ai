import mongoose from "mongoose";

/** Schema
 * -title : String
 * -------------------------------
 * -job description: String
 * -------------------------------
 * -resumeText: String
 * -------------------------------
 * selfDescription: String
 * -------------------------------
 * -matchScore: Number
 * -------------------------------
 * -Technical ques: [{
 *  question: "",
 *  answer: "",
 *  intention: "",
 * }]
 * -------------------------------
 * -Behavioral ques: [{
 *  question: "",
 *  answer: "",
 *  intention: ""
 * }]
 * -------------------------------
 * -skillGaps: [{
 *  skill: "",
 *  severity: {
 *  type: String,
 *  enum:["low","medium","high"]
 *  }
 * }]
 * -------------------------------
 * -preparationPlan: [{
 *  day: Number,
 *  focus: String,
 *  task: [string]
 * }]
 * -------------------------------
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },
    answer: {
      type: String,
      required: [true, "Technical answer is required"],
    },
    intention: {
      type: String,
      required: [true, "Technical intention is required"],
    },
  },
  { _id: false },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    answer: {
      type: String,
      required: [true, "Behavioral answer is required"],
    },
    intention: {
      type: String,
      required: [true, "Behavioral intention is required"],
    },
  },
  { _id: false },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: ["low", "medium", "high"],
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    task: [
      {
        type: String,
        required: [true, "Task is required"],
      },
    ],
  },
  { _id: false },
);

//now the main schema for the interview report which will include all the above sub-schemas.
const interviewReportSchema = new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    title:{
      type: String,
      required: [true, "Job Title is required"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resumeText: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],

    behavioralQuestions: [behavioralQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema],
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewReportSchema);

export default Interview;
