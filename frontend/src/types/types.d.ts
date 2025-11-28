interface Admin {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

interface Course {
    _id?: string;
    name: string;
    code: string;
    status: 'active' | 'removed';
    createdAt?: Date;
}

interface Subject {
    _id?: string;
    name: string;
    code: string;
    units: number;
    status: 'active' | 'removed';
    createdAt?: Date;
}

interface Student {
    _id: string;
    student_id: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    course: Course;
    gender: 'Male' | 'Female';
    email: string;
    password: string;
    createdAt?: Date;
}

interface Semester {
    _id: string;
    student_id: string;
    term: "1st" | "2nd" | "Summer";
    schoolYear: string;
    enrollmentStatus: "Regular" | "Irregular";
    course: Course;
    pricePerUnit: number;
}

interface EnrolledSubject {
    _id: string;
    student_id: string;
    subject: Subject;
    semester: Semester;
}

interface Payment {
    _id: string;
    student_id: Student;
    amount: number;
    semester: Semester;
    createdAt: Date;
    balance: number;
    remainingBalance: number;
}

interface ProfileBase{
    _id: string;
    student_id?: string;
    firstname: string;
    lastname: string;
    email: string;
}

interface Option {
  label: string;
  value: any;
}
