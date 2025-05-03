export type Role = 'superadministrator' | 'administrator' | 'principal' | 'employee';

export type FacultyType = 'teaching' | 'non-teaching';

export interface TeachingFaculty {
  type: 'teaching';
  interRate: number;
  bsRate: number;
}

export interface NonTeachingFaculty {
  type: 'non-teaching';
  rate: number;
}

export type EmployeeDetails = TeachingFaculty | NonTeachingFaculty;

export const roleHierarchy: Record<Role, number> = {
  superadministrator: 4,
  administrator: 3,
  principal: 2,
  employee: 1,
};

export const roleLabels: Record<Role, string> = {
  superadministrator: 'Super Administrator',
  administrator: 'Administrator',
  principal: 'Principal',
  employee: 'Employee',
};

export const facultyTypeLabels: Record<FacultyType, string> = {
  'teaching': 'Teaching Faculty',
  'non-teaching': 'Non-Teaching Faculty'
}; 