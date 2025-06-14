const verifyEmailTemplete = (name,otp) => {
    return `
              <p>Hi ${name},</p>
            <br>

            <p>Welcome to SK Kart,Thank you for registering, please verify your account</p>
            <p>your otp to verify accountis <b>${otp}</b> , please do not share this otp to any one</p>
            <p>If you did not initiate this request, please reach out to customer support</p>
            <br>
            <p>Thanks,</p>
            <p>Team SK kart</p>
            `
}  
module.exports = verifyEmailTemplete