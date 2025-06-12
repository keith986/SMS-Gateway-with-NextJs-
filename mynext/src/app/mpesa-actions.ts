"use server"
import Axios from "axios"

export default async function handleMpesaSubmit(prevState, formData: FormData){    
    await new Promise((resolve) => {setTimeout(resolve, 2000)});
    const phone_number = formData.get("phonenumber");

    // ACCESS TOKEN FUNCTION - Updated to use 'axios'
    const consumer_key = "xrhmuY8WLWvD1qw6RAGQlyel9dw8GBAWK5vjOaLKz4Dmi4GV"; // REPLACE IT WITH YOUR CONSUMER KEY
    const consumer_secret = "HHsoFqF0nqZ3LfpOUcCKJysy4JKFnAUKZpgXQJj6PgYEFA3uxklpC9GBvYu6egJJ"; // REPLACE IT WITH YOUR CONSUMER SECRET
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth =
      "Basic " +
      new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
    try {
      const response = Axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });     
      //const dataresponse = response.data;
      //const accessToken = dataresponse.access_token;
      return response;
    } catch (error) {
      throw error;
    }


}