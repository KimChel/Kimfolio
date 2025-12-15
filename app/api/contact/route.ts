import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define the shape of the data we expect from the form
interface FormData {
  fname: string;
  lname: string;
  email: string;
  message: string;
}

// Ensure environment variables are loaded (Next.js does this automatically)
const EMAIL_USER = process.env.MY_EMAIL; // Your Gmail address
const EMAIL_PASS = process.env.MY_PASSWORD; // Your Gmail App Password

// POST handler for the API route
export async function POST(request: Request) {
  try {
    // 1. Parse the request body
    const data: FormData = await request.json();
    
    // Simple validation (can be more robust)
    if (!data.fname || !data.lname || !data.email || !data.message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 2. Configure the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'gmail' for simplicity
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      // Optional: Add logging for debugging
      // logger: true,
    });

    // 3. Define the email content
    const mailOptions = {
      from: EMAIL_USER, // Sender address (your email)
      to: EMAIL_USER,   // Receiver address (your email)
      subject: `[BUSINESS INQUIRY] from ${data.fname} ${data.lname}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.fname} ${data.lname}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr/>
        <p><em>Reply to: ${data.email}</em></p>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully!');
    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}