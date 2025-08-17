import { config } from "../shared/config";

export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  TURF_OWNER: "turfOwner",
} as const;

export type statusTypes = "active" | "pending" | "blocked";

export type TRole = "client" | "admin" | "turfOwner";

export const HTTP_STATUS = {
  // ✅ Success responses
  OK: 200, // Request was successful (e.g., fetching data, updating without response body)
  CREATED: 201, // Resource successfully created (e.g., user registration, new booking)
  ACCEPTED: 202, // Request accepted for processing but not completed yet (e.g., background job)
  NO_CONTENT: 204, // Request successful but no content returned (e.g., deleting a resource)

  // ❌ Client errors
  BAD_REQUEST: 400, // Invalid request (e.g., missing fields, invalid data format)
  UNAUTHORIZED: 401, // Authentication required (e.g., user not logged in, invalid token)
  FORBIDDEN: 403, // Access denied (e.g., trying to access admin-only routes)
  NOT_FOUND: 404, // Requested resource not found (e.g., wrong ID, missing endpoint)
  METHOD_NOT_ALLOWED: 405, // HTTP method not supported (e.g., using GET instead of POST)
  CONFLICT: 409, // Conflict in request (e.g., duplicate email, already registered)
  PAYLOAD_TOO_LARGE: 413, // Request payload is too large (e.g., file upload exceeds limit)
  UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported content type (e.g., sending XML instead of JSON)
  TOO_MANY_REQUESTS: 429, // Rate limiting (e.g., too many login attempts, API abuse)

  // ⚠️ Server errors
  INTERNAL_SERVER_ERROR: 500, // Generic server error (e.g., database failure, unhandled exception)
  NOT_IMPLEMENTED: 501, // Feature not implemented yet (e.g., unbuilt endpoint)
  BAD_GATEWAY: 502, // Server received invalid response from upstream (e.g., microservices failure)
  SERVICE_UNAVAILABLE: 503, // Server is down or overloaded (e.g., maintenance mode)
  GATEWAY_TIMEOUT: 504, // Upstream server timed out (e.g., long API response time)
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Logged in",
  REGISTRATION_SUCCESS: "Registration completed",
  OTP_SEND_SUCCESS: "OTP sent",
  OTP_VERIFIED: "OTP verified",
  LOGIN_AND_COMPLETE_YOUR_PROFILE: "Login and complete your profile!",
  LOGOUT_SUCCESS: "Logged out",
  VERIFICATION_SUCCESS: "Verification done",
  OPERATION_SUCCESS: "Action completed",
  PASSWORD_RESET_SUCCESS: "Password reset",
  EMAIL_SENT_SUCCESSFULLY: "Email sent",
  UPDATED: "Successfully Updated.",
};

export const ERROR_MESSAGES = {
  TOKEN_EXPIRED: "Session expired login again",
  TOKEN_BLACKLISTED: "Session is no longer valid",
  EMAIL_NOT_FOUND: "Email not found",
  EMAIL_EXISTS: "Email already registered",
  USERNAME_EXISTS: "Username already taken",
  INVALID_ROLE: "Access denied",
  NOT_ALLOWED: "You can't do this action",
  ACCOUNT_UNDER_VERIFICATION:
    "Your account is under verification. Please wait for admin approval.",
  LOGIN_AND_COMPLETE_YOUR_PROFILE: "Login and complete your profile!",

  PENDING_ADMIN_APPROVAL: "Your request is not approved by admin",
  SERVER_ERROR: "Something went wrong try again later",
  VALIDATION_ERROR: "Check your inputs and try again",
  UNAUTHORIZED_ACCESS: "Not authorized",
  BLOCKED: "Your account is blocked",
  INVALID_CREDENTIALS: "Wrong email or password",
  INVALID_OTP: "Invalid or expired otp",
  USER_NOT_FOUND: "User not found",
  INVALID_TOKEN: "Invalid session please login again",
  SAME_CURR_NEW_PASSWORD:
    "New password must be different from current password",
};
export const VERIFICATION_MAIL_CONTENT = (
  otp: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">KickOff</span>
      </h1>
   </div>

   <h2 style="color: #FEBA43; text-align: center; margin-bottom: 30px;">
      Welcome to KickOff – Where Style Begins! 💈
   </h2>
   
   <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Your grooming experience just got better! Book appointments, discover nearest & top barbers, and keep your style sharp. ✨
   </p>
   
   <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin-bottom: 10px; font-size: 16px;">Your verification code is:</p>
      <h1 style="background-color: #f2f2f2; color: #FEBA43; font-size: 36px; margin: 10px 0; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
         ${otp.trim()}
      </h1>
      <p style="color: #666; font-size: 14px;">
         ⏰ Code expires in 1 minute
      </p>
   </div>
   
   <p style="font-size: 14px; color: #666; margin-top: 20px;">
      🔒 For your security, please don't share this code with anyone.
   </p>
   
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@KickOff.in" style="color: #FEBA43; text-decoration: none;">support@KickOff.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} KickOff. All rights reserved.
   </div>
</div>
`;

export const PASSWORD_RESET_MAIL_CONTENT = (
  resetLink: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">KickOff</span>
      </h1>
   </div>

   <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FEBA43; font-size: 28px; margin: 0;">
         Password Reset Request 🔐
      </h2>
      <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
         Don't worry, we'll help you get back in style! ✨
      </p>
   </div>

   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc);">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We received a request to reset your password for your KickOff account. 
         Your security is our top priority! 🛡️
      </p>
      
      <!-- Action Button Section -->
      <div style="border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
         <p style="margin-bottom: 20px; font-size: 16px; color: #444;">
            Click the button below to securely reset your password:
         </p>
         
         <a href="${resetLink}" 
            style="background-color: #FEBA43; color: white; padding: 16px 40px; 
                   text-decoration: none; border-radius: 8px; font-weight: 500; 
                   display: inline-block; margin: 10px 0; font-size: 16px; 
                   box-shadow: 0 2px 4px rgba(254, 186, 67, 0.2); transition: all 0.3s ease;
                   max-width: 100%;"
            onmouseover="this.style.backgroundColor='#E6A936'"
            onmouseout="this.style.backgroundColor='#FEBA43'"
            rel="noopener noreferrer"
         >
            Reset Password 🔐
         </a>

         <p style="color: #666; font-size: 14px; margin-top: 20px;">
            ⏰ For security, this link expires in 10 minutes
         </p>
      </div>
   </div>

   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; box-shadow: 0 2px 8px rgba(254, 186, 67, 0.15);">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Security Reminders</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Never share this link with anyone
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> KickOff will never ask for your password
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure you're on our official website before logging in
         </li>
      </ul>
   </div>

   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@KickOff.in" style="color: #FEBA43; text-decoration: none;">support@kickoff.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} KickOff. All rights reserved.<br>
      <span style="color: #FEBA43;">✦</span> Your Style, Our Priority <span style="color: #FEBA43;">✦</span>
   </div>
</div>`;

export const SENT_REJECTION_EMAIL = (
  entityLabel: string,
  reason: string,
  retryUrl?: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ⚽ <span style="color: #FEBA43;">KickOff</span>
      </h1>
   </div>

   <!-- Header Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: #dc3545; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
         <h2 style="color: white; margin: 0; font-size: 24px;">
            ${entityLabel} Application Status 📋
         </h2>
      </div>
      <p style="color: #666; font-size: 16px; margin: 10px 0;">
         We've reviewed your application and have an update for you.
      </p>
   </div>

   <!-- Main Content -->
   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc); border: 1px solid #f0f0f0;">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We regret to inform you that your <strong>${entityLabel.toLowerCase()}</strong> application has been <span style="color: #dc3545; font-weight: bold;">rejected</span>.
      </p>
      
      <!-- Rejection Reason -->
      <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; border-radius: 8px; margin: 25px 0;">
         <h3 style="color: #721c24; margin: 0 0 10px 0; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚠️</span> Reason for Rejection
         </h3>
         <p style="color: #721c24; font-size: 16px; margin: 0; line-height: 1.5;">
            ${reason}
         </p>
      </div>
      
      ${
        retryUrl
          ? `
      <!-- Retry Section -->
      <div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #e7f3ff; border-radius: 12px; border: 1px solid #bee5eb;">
         <h3 style="color: #0c5460; margin: 0 0 15px 0; font-size: 18px;">
            🔄 Don't Give Up!
         </h3>
         <p style="color: #0c5460; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
            You can address the issues mentioned above and reapply. We're here to help you succeed!
         </p>
         
         <a href="${retryUrl}" 
            style="background-color: #007bff; color: white; padding: 16px 32px; 
                   text-decoration: none; border-radius: 8px; font-weight: 500; 
                   display: inline-block; margin: 10px 0; font-size: 16px; 
                   box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2); 
                   transition: all 0.3s ease;"
            onmouseover="this.style.backgroundColor='#0056b3'"
            onmouseout="this.style.backgroundColor='#007bff'"
            rel="noopener noreferrer"
         >
            🚀 Retry Application
         </a>
         
         <p style="color: #6c757d; font-size: 12px; margin-top: 10px;">
            This link will remain active for your convenience
         </p>
      </div>
      `
          : ""
      }
   </div>

   <!-- Help Section -->
   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; border: 1px solid #FFE082;">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">💡</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Need Help?</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Review our application guidelines carefully
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure all required documents are complete and clear
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Contact our support team if you need clarification
         </li>
         ${
           entityLabel === "Turf Owner"
             ? `
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure your turf facility meets our quality standards
         </li>
         `
             : ""
         }
      </ul>
   </div>

   <!-- Contact Section -->
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Have questions about this decision? We're here to help! 💬<br>
         Contact us at <a href="mailto:support@kickoff.in" style="color: #FEBA43; text-decoration: none;">support@kickoff.in</a>
      </p>
   </div>

   <!-- Footer -->
   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} KickOff. All rights reserved.<br>
      <span style="color: #FEBA43;">⚽</span> Building the Best Sports Experience <span style="color: #FEBA43;">⚽</span><br>
      <em>This is an automated message. Please do not reply directly to this email.</em>
   </div>
</div>`;

export const GOOGLE_REGISTRATION_MAIL_CONTENT = (
  fullName: string,
  tempPassword: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">kickOff</span>
      </h1>
   </div>

   <!-- Welcome Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FEBA43; font-size: 28px; margin: 0;">
         Welcome to KickOff, ${fullName}! 🎉
      </h2>
      <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
         Your Google registration is complete. Here's everything you need to get started!
      </p>
   </div>

   <!-- Account Info -->
   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc);">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We've generated a temporary password for you. Please use this password to log in and change it ASAP! 🔐
      </p>

      <!-- Temporary Password -->
      <div style="text-align: center; padding: 15px; border-radius: 8px; background-color: #FEBA43; color: white; font-size: 18px; font-weight: bold; display: inline-block; margin: 10px 0;">
         ${tempPassword}
      </div>

      <p style="color: #666; font-size: 14px; text-align: center; margin-top: 10px;">
         ✨ Make sure to update your password as soon as possible to keep your account secure!
      </p>
   </div>

   <!-- Change Password Reminder -->
   <div style="text-align: center; margin-bottom: 30px;">
      <a href="${config.cors.ALLOWED_ORIGIN}" 
         style="background-color: #FEBA43; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 500; 
                display: inline-block; margin: 10px 0; font-size: 16px; 
                box-shadow: 0 2px 4px rgba(254, 186, 67, 0.2); 
                transition: all 0.3s ease; 
                cursor: pointer;"
         onmouseover="this.style.backgroundColor='#E6A936'"
         onmouseout="this.style.backgroundColor='#FEBA43'"
         rel="noopener noreferrer"
      >
         Log in & Change Password 🔑
      </a>
   </div>

   <!-- Security Section -->
   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; box-shadow: 0 2px 8px rgba(254, 186, 67, 0.15);">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Security Reminders</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Change your password immediately after logging in
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Never share your password with anyone
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Always ensure you're on the official kickOff website before entering your credentials
         </li>
      </ul>
   </div>

   <!-- Support Section -->
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@kickOfff@gmail.com" style="color: #FEBA43; text-decoration: none;">support@kickOff.in</a>
      </p>
   </div>

   <!-- Footer -->
   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} kickOff. All rights reserved.<br>
      <span style="color: #FEBA43;">✦</span> Your Style, Our Priority <span style="color: #FEBA43;">✦</span>
   </div>
</div>`;
