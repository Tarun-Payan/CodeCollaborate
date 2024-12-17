import { client, sender } from "./mailtrap.config.js";
import { 
    VERIFICATION_EMAIL_TEMPLATE, 
    PASSWORD_RESET_REQUEST_TEMPLATE, 
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE
} from "./emailTemplets.js"

// send welcome email when user sigup or register
export const sendWelcomeEmail = async (email, company_name, user_name, next_step_link) => {
    try{
        const recipients = [{email}];

        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Welcome to our Code Collaborate",
            html: WELCOME_EMAIL_TEMPLATE.replaceAll("{Company Name}", company_name).replace("{{user_name}}", user_name).replace("{{next_step_link}}", next_step_link),
            category: "Welcome Email"
        })

        console.log("Successfully send welcome email")
    } catch(error){
        console.error("Error sending welome email, ", error)
        throw new error("Error sending welcome email, ", error)
    }
}

// send email to varify email during signup
export const sendEmailVarificationEmail = async (email, varificationCode) => {
        const recipients = [
            {
                email: email,
            }
        ];

        try{
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Your CodeCollaborate email varification code",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", varificationCode),
            category: "Integration Test",
        })

        console.log("Successfully send varification email, ", response)
    } catch(error){
        console.error("Error sending varification email, ", error.message)
        throw new Error("Error sending varification email")
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try{
        const recipients = [{ email }];

        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Reset Your CodeCollaborate Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Reset Password"
        })

        console.log("Successfully send password reset email", response)
    } catch(error){
        console.log("Error sending password reset email", error)
        throw new error("Error sending password reset email")
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    try{
        const recipients = [{ email }];
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Your CodeCollaborate password has been reset",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password"
        })
        console.log("Successfully send password reset success email", response)
    } catch(error){
        console.log("Error sending password reset success email", error)
        throw new error("Error sending password reset success email, ", error)
    }
}