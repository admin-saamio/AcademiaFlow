export type AcademicLevel = 'school' | 'undergraduate' | 'postgraduate' | 'doctorate';

export interface SubjectMarks {
  id: string;
  name: string;
  obtained: number;
  max: number;
}

export interface SemesterData {
  semNumber: number;
  sgpa: number;
  obtained: number;
  max: number;
  subjects: SubjectMarks[];
}

export interface SchoolExam {
  id: string;
  examName: string;
  institutionName: string;
  cityCountry: string;
  yearOfCompletion: string;
  subjects: SubjectMarks[];
}

export interface SchoolRecord {
  grade: string; // currently selected grade
  examsByGrade: Record<string, SchoolExam[]>; // e.g. { "Grade 10": [SchoolExam] }
}

export interface UGRecord {
  id: string;
  degreeName: string; // e.g. "B.Tech", "B.Sc"
  collegeName: string;
  cityCountry: string;
  durationYears: number; // 3, 4, 5, 6
  semesters: SemesterData[];
}

export interface PGRecord {
  id: string;
  degreeName: string; // e.g. "M.Tech", "M.Sc", "MBA"
  universityName: string;
  durationYears: number; // 1, 2, 3
  semesters: Array<{ semNumber: number; sgpa: number }>;
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  doiLink: string;
  status: 'Published' | 'Under Review' | 'In Preparation';
}

export interface PhDRecord {
  id: string;
  courseworkCgpa: number;
  thesisTitle: string;
  defenseStatus: 'Enrolled' | 'Submitted' | 'Awarded';
  publications: PublicationItem[];
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  completed: boolean;
  priority: PriorityLevel;
}

export interface RevisionCheckitem {
  id: string;
  title: string;
  completed: boolean;
}

export interface AcademiaFlowState {
  academicLevel: AcademicLevel;
  school: SchoolRecord;
  undergraduate: UGRecord[];
  postgraduate: PGRecord[];
  doctorate: PhDRecord[];
  todos: TodoItem[];
  revisions: RevisionCheckitem[];
  notes: NoteItem[];
  lastSavedAt?: string;
}
