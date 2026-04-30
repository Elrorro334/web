import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { subject, html, replyToEmail, replyToName } = data;

    if (!html) {
      return NextResponse.json({ error: "Missing email body" }, { status: 400 });
    }

    // 1. Connect to Gmail (This ensures it's saved in their Sent folder)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'invita4you@gmail.com', // Planner's email
        pass: 'xfbmhezqahdeeehp'      // App Password
      }
    });

    // 2. Build the email package
    const mailOptions = {
      from: '"Wedding Notifications" <invita4you@gmail.com>', // Sender display name
      //to: 'sanxcruro122@gmail.com , contacto@rodnix.com.mx',
      to: 'greeneyeclovergirl@gmail.com, Armando.a.salinas@gmail.com',
      replyTo: replyToEmail ? `"${replyToName}" <${replyToEmail}>` : undefined,
      subject: subject,
      html: html
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }
}