const verifyEmailTemplete = (url) => {
    return `
            <p>Welcome to SK Kart,Thank you for registering, please verify your email by clicking the link below...</p>
            <a href=${url} style="color:black;background :orange;margin-top : 10px,padding:20px,display:block"> Verify Email</a>
            `
}  
module.exports = verifyEmailTemplete