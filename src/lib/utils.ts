import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AcademiaFlowState } from "@/types/academic";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INITIAL_ACADEMIC_STATE: AcademiaFlowState = {
  studentName: "",
  academicLevel: 'undergraduate',
  school: {
    grade: 'Grade 10',
    examsByGrade: {}
  },
  undergraduate: [],
  postgraduate: [],
  doctorate: [],
  todos: [],
  revisions: [],
  notes: []
};
