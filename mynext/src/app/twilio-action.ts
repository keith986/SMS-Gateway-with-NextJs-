"use server"

import twilio from "twilio"

export default async function handleSubmitMessage(formData : FormData) {
    const message = formData.get("message")
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
      
    return client.messages.create({
         to : "+254748604658",
         from : process.env.TWILIO_PHONE_NUMBER,
         body : message
         })
         .then((response) => {
            console.log(response)
         })
         .catch((error) => {
            console.log(error.message)
         })
}