import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AcademiaFlowState } from "@/types/academic";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INITIAL_ACADEMIC_STATE: AcademiaFlowState = {
  academicLevel: 'undergraduate',
  school: {
    grade: 'Grade 10',
    examName: 'Final Annual Exam',
    institutionName: 'St. Joseph Higher Secondary School',
    cityCountry: 'Bangalore, India',
    yearOfCompletion: '2022',
    subjects: [
      { id: '1', name: 'Mathematics', obtained: 95, max: 100 },
      { id: '2', name: 'Physics', obtained: 88, max: 100 },
      { id: '3', name: 'Chemistry', obtained: 91, max: 100 },
      { id: '4', name: 'Computer Science', obtained: 98, max: 100 },
      { id: '5', name: 'English Literature', obtained: 89, max: 100 },
    ],
  },
  undergraduate: {
    degreeName: 'B.Tech in Computer Science',
    collegeName: 'National Institute of Technology',
    cityCountry: 'Bangalore, India',
    durationYears: 4,
    semesters: Array.from({ length: 8 }, (_, i) => ({
      semNumber: i + 1,
      sgpa: i === 0 ? 9.2 : i === 1 ? 8.9 : i === 2 ? 9.1 : 8.5,
      obtained: i < 4 ? 450 + i * 5 : 0,
      max: i < 4 ? 500 : 0,
      subjects: [
        { id: `sem${i+1}-s1`, name: 'Data Structures & Algorithms', obtained: 92, max: 100 },
        { id: `sem${i+1}-s2`, name: 'Database Systems', obtained: 88, max: 100 },
        { id: `sem${i+1}-s3`, name: 'Operating Systems', obtained: 90, max: 100 },
      ]
    })),
  },
  postgraduate: {
    degreeName: 'M.Tech in Artificial Intelligence',
    universityName: 'Indian Institute of Science',
    durationYears: 2,
    semesters: Array.from({ length: 4 }, (_, i) => ({
      semNumber: i + 1,
      sgpa: i === 0 ? 9.5 : i === 1 ? 9.3 : 0,
    })),
  },
  doctorate: {
    courseworkCgpa: 9.8,
    thesisTitle: 'Deep Reinforcement Learning for Autonomous Agent Optimization',
    defenseStatus: 'Enrolled',
    publications: [
      {
        id: 'pub-1',
        title: 'Efficient Multi-Agent Policy Gradient Frameworks',
        venue: 'NeurIPS 2025',
        year: '2025',
        doiLink: 'https://doi.org/10.1000/182',
        status: 'Published',
      },
    ],
  },
  todos: [
    {
      id: 't-1',
      title: 'Submit Machine Learning Assignment #3',
      deadline: '2026-08-01',
      completed: false,
      priority: 'high',
    },
    {
      id: 't-2',
      title: 'Prepare Mid-Term Presentation Slides',
      deadline: '2026-08-05',
      completed: false,
      priority: 'medium',
    },
    {
      id: 't-3',
      title: 'Renew Library Book Return',
      deadline: '2026-08-10',
      completed: true,
      priority: 'low',
    },
  ],
  revisions: [
    { id: 'r-1', title: 'Read Chapter 4 & 5 Core Theory', completed: true },
    { id: 'r-2', title: 'Solve Past 5 Years Exam Papers', completed: true },
    { id: 'r-3', title: 'Formula & Theorem Sheet Review', completed: false },
    { id: 'r-4', title: 'Mock Timed Quiz Practice', completed: false },
  ],
};
