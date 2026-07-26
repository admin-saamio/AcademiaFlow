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

export interface SchoolRecord {
  grade: string; // e.g. "Grade 10"
  examName: string;
  institutionName: string;
  cityCountry: string;
  yearOfCompletion: string;
  subjects: SubjectMarks[];
}

export interface UGRecord {
  degreeName: string; // e.g. "B.Tech", "B.Sc"
  collegeName: string;
  cityCountry: string;
  durationYears: number; // 3, 4, 5, 6
  semesters: SemesterData[];
}

export interface PGRecord {
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

export interface AcademicTrackerState {
  academicLevel: AcademicLevel;
  school: SchoolRecord;
  undergraduate: UGRecord;
  postgraduate: PGRecord;
  doctorate: PhDRecord;
  todos: TodoItem[];
  revisions: RevisionCheckitem[];
  lastSavedAt?: string;
}
