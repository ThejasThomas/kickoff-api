"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_REGISTRATION_MAIL_CONTENT = exports.SENT_TURF_REJECTION_EMAIL = exports.SENT_APPROVE_EMAIL = exports.SENT_TURF_APPROVAL_EMAIL = exports.SENT_REJECTION_EMAIL = exports.PASSWORD_RESET_MAIL_CONTENT = exports.VERIFICATION_MAIL_CONTENT = exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = exports.HTTP_STATUS = exports.ROLES = void 0;
const config_1 = require("../shared/config");
exports.ROLES = {
    ADMIN: "admin",
    CLIENT: "client",
    TURF_OWNER: "turfOwner",
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    // ❌ Client errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUESTS: 429,
    // ⚠️ Server errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
exports.SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Logged in",
    REGISTRATION_SUCCESS: "Registration completed",
    OTP_SEND_SUCCESS: "OTP sent",
    OTP_VERIFIED: "OTP verified",
    BOOKINGS_FETCHED_SUCCESSFULLY: "Bookings fetched successfully",
    LOGIN_AND_COMPLETE_YOUR_PROFILE: "Login and complete your profile!",
    LOGOUT_SUCCESS: "Logged out",
    HOSTED_GAME_FETCHED_SUCCESSFULLY: "Hosted upcoming games fetched successfully",
    OWNER_DASHBOARD_DATA_FETCHED: "Owner dashboard data fetched successfully",
    TURF_DETAILS_FETCHED_SUCCESSFULLY: "Turf details fetched successfully",
    VERIFICATION_SUCCESS: "Verification done",
    OPERATION_SUCCESS: "Action completed",
    PASSWORD_RESET_SUCCESS: "Password reset",
    HOSTES_GAME_CANCELLATION_REQUESTED: "Hosted game cancellation requested",
    EMAIL_SENT_SUCCESSFULLY: "Email sent",
    ADMIN_WALLET_FETCHED_SCCESSFULLY: "Admin wallet fetched successfully",
    WALLET_TRANSACTION_FETCHED: "Owner wallet transactions fetched successfully",
    APPROVAL_REQUEST_SENT: "Approval request send to the admin",
    TURF_BOOKED_SUCCESSFULLY: "Your turf slot  Booked successfully",
    UPDATED: "Successfully Updated.",
    TURF_ADDED_SUCCESSFULLY: "Turf added successfully",
    TURF_UPDATED_SUCCESSFULLY: "Turf updated successfully",
    TURF_RETRY_UPDATED_SUCCESSFULLY: "Turf updated successfully and wait for admin approval",
    PROFILE_UPDATED_SUCCESSFULLY: "Profile updated successfully",
};
exports.ERROR_MESSAGES = {
    TOKEN_EXPIRED: "Session expired login again",
    TOKEN_BLACKLISTED: "Session is no longer valid",
    EMAIL_NOT_FOUND: "Email not found",
    EMAIL_EXISTS: "Email already registered",
    USERNAME_EXISTS: "Username already taken",
    MESSAGE_NOT_FOUND: "Message not found",
    SLOT_ALREADY_EXISTS: "Slots all ready exists please check",
    INVALID_ROLE: "Access denied",
    DATABASE_ERROR: "Database Error",
    CANCELLATION_REASON_REQUIRED: "Cancellation reason required",
    FAILED_TO_FETCH_HOSTED_GAMES: "Failed to fetch hosted games",
    SLOT_LOCK_EXPIRE_OR_INVALID: "Slot lock expired or invalid",
    TRANSACTION_NOT_FOUND: "Transaction not found",
    GROUP_ID_REQUIRED: "Group id is required",
    SLOT_ALREADY_BOOKED: "Slot already booked",
    SLOT_ALREADY_SELECTED: "Slot already selected by another user",
    CHAT_GROUP_NOT_FOUND: "Chat group not found",
    WALLET_TRANSACTION_FAILED: "Wallet transaction failed",
    WALLET_TRANSACTION_FETCH_FAILED: "Failed to fetch wallet transactions",
    REVIEW_ONLY_COMPLETED_BOOKINGS: "You can review only completed bookings",
    REVIEW_ALREADY_SUBMITTED: "Review already submitted for this booking",
    OWNER_PERMISSION_DENIED: "Access denied. Your account is not approved to add services.",
    INVALID_TEXT_MESSAGE: "Invalid text message data",
    BOOKING_FAILED: "Slot booking failed",
    INVALID_ID: "Invalid booking id",
    ALREADY_JOINED: "You already joined the game",
    INVALID_COURT_TYPE: "Invalid court type",
    REQUEST_ID_REQUIRED: "Request id is required",
    INVALID_ACTION: "Invalid action",
    CANNOT_JOIN_OWN_GAME: "Cannot join own game",
    NOT_GAME_FOUND: "No game found",
    GAME_IS_FULL: "Game is full",
    REQUEST_NOT_FOUND: "request not found",
    REQUEST_ALREADY_SUBMITTED: "Cancellation request already submitted",
    CANCELLATION_NOT_ALLOWED: "Cancellation allowed only 1 hour before start time",
    BOOKING_NOT_FOUND: "Booking not found",
    INVALID_DAY_INDEX: "Invalid day index",
    SLOT_NOT_FOUND: "Slot not found",
    MISSING_REQUIRED_FIELDS: "Missing required field",
    FAILED_TO_FETCH_BOOKINGS: "Failed to bookings",
    NOT_ALLOWED: "You can't do this action",
    TURF_NOT_FOUND: "Turf not found",
    INVALID_TURFID_OR_DATE: "Invalid turfId or date",
    LATITUDE_LONGITUDE_REQUIRED: "Latitude and longitude are required",
    FOLDER_NOT_FOUND: "Folder not Found",
    SLOT_UPDATE_FAILED: "Slot updated failed",
    SLOT_NOT_FOUND_OR_ALREADY_BOOKED: "Slot not found or it already booked",
    ACCOUNT_UNDER_VERIFICATION: "Your account is under verification. Please wait for admin approval.",
    LOGIN_AND_COMPLETE_YOUR_PROFILE: "Login and complete your profile!",
    OWNER_NOT_FOUND: "Owner not found",
    FAILED_TO_FETCH_TURF_DETAILS: "Failed to fetch turf details",
    TURF_CREATION_FAILED: "Failed to add turf. Please try again ",
    AMOUNT_MUST_BE_POSITIVE: "Amount must be greater than 0",
    OWNER_NOT_ACTIVE: "Owner is not active now please update your profile and try again",
    PENDING_ADMIN_APPROVAL: "Your request is not approved by admin",
    SERVER_ERROR: "Something went wrong try again later",
    VALIDATION_ERROR: "Check your inputs and try again",
    UNAUTHORIZED_ACCESS: "Not authorized",
    BLOCKED: "Your account is blocked",
    INVALID_CREDENTIALS: "Wrong email or password",
    INVALID_OTP: "Invalid or expired otp",
    USER_NOT_FOUND: "User not found",
    INVALID_TOKEN: "Invalid session please login again",
    SAME_CURR_NEW_PASSWORD: "New password must be different from current password",
    UPDATE_FAILED: "failed to update profile",
};
const VERIFICATION_MAIL_CONTENT = (otp) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ⚽ <span style="color: #FEBA43;">KickOff</span>
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
exports.VERIFICATION_MAIL_CONTENT = VERIFICATION_MAIL_CONTENT;
const PASSWORD_RESET_MAIL_CONTENT = (resetLink) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ⚽ <span style="color: #FEBA43;">KickOff</span>
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
exports.PASSWORD_RESET_MAIL_CONTENT = PASSWORD_RESET_MAIL_CONTENT;
const SENT_REJECTION_EMAIL = (entityLabel, reason, retryUrl) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
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
<div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc); border: 1px solid #f0f0f0;">
  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
    We regret to inform you that your <strong>${entityLabel.toLowerCase()}</strong> application has been 
    <span style="color: #dc3545; font-weight: bold;">rejected</span>.
  </p>
  <p style="font-size: 15px; line-height: 1.6; text-align: center; color: #555;">
    To get access to add <strong>turfs</strong> and <strong>services</strong>, please login and complete your profile.
  </p>
</div>

      
      <!-- Rejection Reason -->
      <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; border-radius: 8px; margin: 25px 0;">
         <h3 style="color: #721c24; margin: 0 0 10px 0; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚠️</span> Reason for Rejection
         </h3>
         <p style="color: #721c24; font-size: 16px; margin: 0; line-height: 1.5;">
            ${reason}
         </p>
      </div>
      
      ${retryUrl
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
    : ""}
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
         ${entityLabel === "Turf Owner"
    ? `
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure your turf facility meets our quality standards
         </li>
         `
    : ""}
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
exports.SENT_REJECTION_EMAIL = SENT_REJECTION_EMAIL;
const SENT_TURF_APPROVAL_EMAIL = (turfName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #28a745; margin: 0;">🎉 Turf Registration Approved!</h1>
      </div>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear Turf Owner,</p>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
        Congratulations! Your turf registration for <strong>"${turfName}"</strong> has been approved by our admin team.
      </p>
      
      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h4 style="color: #155724; margin: 0 0 10px 0;">What's Next?</h4>
        <p style="color: #155724; margin: 0;">
          Your turf is now live and available for bookings. You can manage your turf settings, view bookings, and track earnings through your dashboard.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config_1.config.cors.ALLOWED_ORIGIN}/turfOwner/dashboard" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Go to Dashboard
        </a>
      </div>
      
      <p style="font-size: 16px; color: #333; margin: 20px 0;">
        Thank you for joining KickOff and contributing to our sports community!
      </p>
      
      <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="font-size: 14px; color: #666; margin: 0;">
          Best regards,<br>
          <strong>KickOff Team</strong>
        </p>
      </div>
    </div>
  </div>
`;
exports.SENT_TURF_APPROVAL_EMAIL = SENT_TURF_APPROVAL_EMAIL;
const SENT_APPROVE_EMAIL = (entityLabel) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
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
<div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc); border: 1px solid #f0f0f0;">
  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
    We happily to inform you that your <strong>${entityLabel.toLowerCase()}</strong> application has been 
    <span style="color: #dc3545; font-weight: bold;">accepted</span>.
  </p>
</div>
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
         ${entityLabel === "Turf Owner"
    ? `
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure your turf facility meets our quality standards
         </li>
         `
    : ""}
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
exports.SENT_APPROVE_EMAIL = SENT_APPROVE_EMAIL;
const SENT_TURF_REJECTION_EMAIL = (turfName, reason, retryUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc3545; margin: 0;">Turf Registration Rejected</h1>
      </div>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear Turf Owner,</p>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
        We regret to inform you that your turf registration for <strong>"${turfName}"</strong> has been rejected by our admin team.
      </p>
      
      <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h4 style="color: #721c24; margin: 0 0 10px 0;">Rejection Reason:</h4>
        <p style="color: #721c24; margin: 0;">${reason}</p>
      </div>
      
      <p style="font-size: 16px; color: #333; margin: 20px 0;">
        You can review and resubmit your turf registration by clicking the button below:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${retryUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Resubmit Turf Registration
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        If you have any questions, please contact our support team.
      </p>
      
      <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="font-size: 14px; color: #666; margin: 0;">
          Best regards,<br>
          <strong>KickOff Team</strong>
        </p>
      </div>
    </div>
  </div>
`;
exports.SENT_TURF_REJECTION_EMAIL = SENT_TURF_REJECTION_EMAIL;
const GOOGLE_REGISTRATION_MAIL_CONTENT = (fullName, tempPassword) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ⚽ <span style="color: #FEBA43;">kickOff</span>
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
      <a href="${config_1.config.cors.ALLOWED_ORIGIN}" 
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
exports.GOOGLE_REGISTRATION_MAIL_CONTENT = GOOGLE_REGISTRATION_MAIL_CONTENT;
