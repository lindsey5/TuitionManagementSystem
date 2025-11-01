interface Course {
    _id?: string;
    name: string;
    code: string;
    status: 'active' | 'removed';
    createdAt?: string;
}
