"use server"
import Axios from "axios"
import { Buffer } from 'node:buffer';

export default async function handleMpesaSubmit(prevState, formData: FormData) {
    try {
        // Add loading delay (consider removing in production)
        await new Promise((resolve) => { setTimeout(resolve, 2000) });
        
        const phone_number = formData.get("phonenumber");
        
        // Validate phone number
        if (!phone_number || typeof phone_number !== 'string') {
            return { success: false, error: "Phone number is required" };
        }
        
        // Format phone number (ensure it starts with 254)
        const formattedPhone = formatPhoneNumber(phone_number);
        if (!formattedPhone) {
            return { success: false, error: "Invalid phone number format" };
        }

        // Environment variables for security
        const consumer_key = process.env.MPESA_CONSUMER_KEY || "YS5qZyYGGp4DA5KOlX5tnZbve3KTDKEkaplKmpxkpy0WFSKE";
        const consumer_secret = process.env.MPESA_CONSUMER_SECRET || "kcpXInRu6W0fZkfiw6p0Ps3JHhgLv0pB4AY8Wso4g5JrD8ODQlA4ABYcDJN8YiU4";
        const passkey = process.env.MPESA_PASS_KEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
        const shortcode = process.env.MPESA_SHORTCODE || "174379";
        const callback_url = process.env.MPESA_CALLBACK_URL || "https://e096-105-29-165-165.ngrok-free.app/api/callback";

        // STEP 1: GET ACCESS TOKEN
        const accessToken = await getAccessToken(consumer_key, consumer_secret);
        if (!accessToken) {
            return { success: false, error: "Failed to get access token" };
        }

        // STEP 2: INITIATE STK PUSH
        const stkResult = await initiateSTKPush({
            accessToken,
            shortcode,
            passkey,
            phone_number: formattedPhone,
            amount: "1", // Consider making this dynamic
            callback_url,
            account_reference: "myTest",
            transaction_desc: "SMS Test Payment"
        });

        if (stkResult.success) {
            return { 
                success: true, 
                message: "STK push sent successfully",
                checkout_request_id: stkResult.CheckoutRequestID,
                merchant_request_id: stkResult.MerchantRequestID
            };
        } else {
            return { 
                success: false, 
                error: stkResult.error || "Failed to initiate STK push" 
            };
        }

    } catch (error) {
        console.error("M-Pesa STK Push Error:", error);
        return { 
            success: false, 
            error: "An unexpected error occurred. Please try again." 
        };
    }
}

// Helper function to get access token
async function getAccessToken(consumer_key, consumer_secret) {
    try {
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const auth = "Basic " + Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

        const response = await Axios.get(url, {
            headers: {
                Authorization: auth,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log("Access Token retrieved successfully");
        return response.data.access_token;
    } catch (error) {
        console.error("Access Token Error:", error.response?.data || error.message);
        return null;
    }
}

// Helper function to initiate STK push
async function initiateSTKPush({
    accessToken,
    shortcode,
    passkey,
    phone_number,
    amount,
    callback_url,
    account_reference,
    transaction_desc
}) {
    try {
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const timestamp = generateTimestamp();
        const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone_number,
            PartyB: shortcode,
            PhoneNumber: phone_number,
            CallBackURL: callback_url,
            AccountReference: account_reference,
            TransactionDesc: transaction_desc
        };

        const response = await Axios.post(url, payload, {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log("STK Push Response:", response.data);
        
        if (response.data.ResponseCode === "0") {
            return {
                success: true,
                CheckoutRequestID: response.data.CheckoutRequestID,
                MerchantRequestID: response.data.MerchantRequestID
            };
        } else {
            return {
                success: false,
                error: response.data.ResponseDescription || "STK push failed"
            };
        }

    } catch (error) {
        console.error("STK Push Error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errorMessage || "Network error occurred"
        };
    }
}

// Helper function to generate timestamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Helper function to format phone number
function formatPhoneNumber(phone) {
    if (typeof phone !== 'string') return null;
    
    // Remove any spaces, dashes, or other non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
        // Convert 0712345678 to +254712345678
        cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
        // Already in correct format
    } else if (cleaned.startsWith('7') && cleaned.length === 9) {
        // Convert 712345678 to 254712345678
        cleaned = '254' + cleaned;
    } else {
        return null; // Invalid format
    }
    
    // Validate Kenyan mobile number format
    if (cleaned.length === 12 && cleaned.startsWith('254')) {
        return cleaned;
    }
    
    return null;
}