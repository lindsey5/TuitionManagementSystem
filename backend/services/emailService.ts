import SibApiV3Sdk from 'sib-api-v3-sdk';
import { IStudent } from '../models/Student';
import dotenv from "dotenv";

dotenv.config();

const brevoClient = SibApiV3Sdk.ApiClient.instance;
brevoClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY as string;

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();

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