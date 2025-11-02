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
    _id?: string;
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