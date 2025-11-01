import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import courseRoutes from './routes/course.route';

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

app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

export default app