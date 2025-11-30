import SibApiV3Sdk from 'sib-api-v3-sdk';
import { IStudent } from '../models/Student';
import dotenv from "dotenv";

dotenv.config();

const brevoClient = SibApiV3Sdk.ApiClient.instance;
brevoClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY as string;

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOverdueNotificationEmail = async (
    student: IStudent,
    tuitionInfo: {
        course: string;
        semester: string;
        totalTuition: number;
        dueDate: string;
        remainingBalance: number;
    }
) => {
    try {
        const htmlContent = `
        <p>Dear <strong>${student.firstname} ${student.lastname}</strong>,</p>

        <p>This is a reminder that your tuition payment is now <strong>OVERDUE</strong>.</p>

        <p>Below are the details of your outstanding balance:</p>

        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
                <td><strong>Student ID:</strong></td>
                <td>${student.student_id}</td>
            </tr>
            <tr>
                <td><strong>Course:</strong></td>
                <td>${tuitionInfo.course}</td>
            </tr>
            <tr>
                <td><strong>Semester:</strong></td>
                <td>${tuitionInfo.semester}</td>
            </tr>
            <tr>
                <td><strong>Total Tuition:</strong></td>
                <td>₱${tuitionInfo.totalTuition.toLocaleString()}</td>
            </tr>
            <tr>
                <td><strong>Due Date:</strong></td>
                <td>${tuitionInfo.dueDate}</td>
            </tr>
            <tr>
                <td><strong>Remaining Balance:</strong></td>
                <td><strong style="color: red;">₱${tuitionInfo.remainingBalance.toLocaleString()}</strong></td>
            </tr>
        </table>

        <br/>

        <p>Please settle your remaining balance as soon as possible to avoid further penalties.</p>

        <p>If you have already completed your payment, you may disregard this email.</p>

        <br/>

        <p>Thank you,<br/>Tuition Management System</p>
        `;

        const emailData = {
            sender: { name: 'Tuition Management System', email: process.env.EMAIL_USER },
            to: [{ email: student.email, name: `${student.firstname} ${student.lastname}` }],
            subject: 'Overdue Tuition Notice',
            htmlContent,
        };

        await brevo.sendTransacEmail(emailData);

        return true;

    } catch (err: any) {
        console.error('Error sending overdue email:', err);
        throw new Error(err.message || 'Failed to send overdue email via Brevo');
    }
};

export const sendStudentEmail = async (student: IStudent, password: string) => {
    try {
        const htmlContent = `
        ${student.firstname} ${student.lastname},<br/><br/>
        Your account has been created successfully. Below are your account details:<br/><br/>
        <strong>Student ID:</strong> ${student.student_id}<br/>
        <strong>Email:</strong> ${student.email}<br/>
        <strong>Temporary Password:</strong> ${password}<br/><br/>
        Please log in and change your password immediately for security purposes.<br/><br/>
        Thank you,<br/>
        `;

        const emailData = {
        sender: { name: 'Tuition Management System', email: process.env.EMAIL_USER },
        to: [{ email: student.email, name: `${student.firstname} ${student.lastname}` }],
        subject: 'Student Account Information',
        htmlContent,
        };

        await brevo.sendTransacEmail(emailData);

        return true;
    } catch (err: any) {
        console.error('Error sending student email:', err);
        throw new Error(err.message || 'Failed to send email via Brevo');
    }
};