import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
     user: "tajulislam199595@gmail.com",
    pass: "dkre hspg wmio btat",
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
        additionalFields:{
            role:{
                type:"string",
                defaultValue:"USER",
                required:false
            },
            phone:{
                type:"string",
                required:false
            },
            status:{
                type:"string",
                defaultValue:"ACTIVE",
                 required:false
            }
        }


    },
    emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
        const verifyToken=`${process.env.APP_URL}/verify-token?token=${token}`
       const info = await transporter.sendMail({
    from: '"PRISMA BLOG APP" <prisma_blogapp1989@gmail.com>',
    // to: "tajulislam199595@gmail.com",
    subject:`hello ${user.name}`,
    
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      padding: 24px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 32px;
      color: #374151;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      color: #111827;
    }
    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }
    .verify-button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
    }
    .verify-button:hover {
      background-color: #4338ca;
    }
    .footer {
      padding: 20px 32px;
      background-color: #f9fafb;
      color: #6b7280;
      font-size: 13px;
      text-align: center;
    }
    .link {
      word-break: break-all;
      color: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      PRISMA BLOG APP
    </div>

    <div class="content">
      <h2>Hello ${user.name}, 👋</h2>

      <p>
        Thanks for creating an account with <strong>Prisma Blog App</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verifyToken}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">
        ${verifyToken}
      </p>

      <p>
        This link will expire soon for security reasons.
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        Thanks,<br />
        <strong>Prisma Blog App Team</strong>
      </p>
    </div>

    <div class="footer">
      © 2026 Prisma Blog App. All rights reserved.
    </div>
  </div>
</body>
</html>
`
  });

  console.log("Message sent:", info.messageId);
    },
  },
});