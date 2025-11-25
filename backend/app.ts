import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import courseRoutes from './routes/course.route';
import subjectRoutes from './routes/subject.route';
import studentRoutes from './routes/student.route';
import semesterRoutes from './routes/semester.route';
import enrolledSubjectRoutes from './routes/enrolledSubject.route';
import { Request, Response } from 'express';
import paymentRoutes from './routes/paymentRoute';
import incomeRoutes from './routes/income.route';
import { getDashboardData } from './controllers/income.controller';
import { requireAuth } from './middlewares/auth';

const app = express();

const origins = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173']

// middleware & static files
app.use(cors({
    origin: origins,
    credentials: true
}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/logout', (req : Request, res : Response) =>{
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'lax' });
    res.status(200).json({ success: true });
})

app.get('/api/dashboard', requireAuth('admin') ,getDashboardData);
app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/enrolled-subjects', enrolledSubjectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/incomes', incomeRoutes);

export default app