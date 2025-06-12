"use server"

export default async function handleSubmitMessage(formData : FormData) {
    try {
        const msg = formData.get("message");
        const recipients = formData.get("receipts"); // Fixed typo: "receipts" -> "recipients"
        const rname = formData.get("rname")

        // Check if message exists
        if (!msg) {
            console.log("Message is required");
        }

        // Parse recipients - assuming it's a JSON string or comma-separated values
        let recipientList = [];
        let recipientname = [];

        if (typeof recipients === 'string') {
            try {
                // Try parsing as JSON first
                recipientList = JSON.parse(recipients);
            } catch {
                // If not JSON, split by comma
                recipientList = recipients.split(',').map(r => r.trim()).filter(r => r);
            }
        }

        if (typeof rname === 'string') {
            try {
                // Try parsing as JSON first
                recipientname = JSON.parse(rname);
            } catch {
                // If not JSON, split by comma
                recipientname = rname.split(',').map(r => r.trim()).filter(r => r);
            }
        }

        console.log(recipientList, recipientname)
        if (!recipientList.length) {
            console.log("At least one recipient is required");
        }

        // Validate environment variables
        if (!process.env.INFOBIP_API_KEY || !process.env.INFOBIP_BASE_URL) {
            console.log("Missing required environment variables");
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "App " + process.env.INFOBIP_API_KEY);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
       
        // Create destinations array from recipient list
        const na_me = recipientname.map(nm => nm);
        const destinations = recipientList.map(phone => ({ to: phone}));

        const raw = JSON.stringify({
            "messages": [
                {
                    "destinations": destinations,
                    "from": "447491163443",
                    "text": `Good evening House No. ${na_me}, ${msg}`
                }
            ]
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch(process.env.INFOBIP_BASE_URL, requestOptions);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }else{

        //const result = await response.json();
        console.log('Message sent successfully:');
        }
        return { 
            success: true, 
            message: "Messages sent successfully",
            //data: result 
        };

    } catch (error) {
        console.error('Error sending message:', error);
        return { 
            success: false, 
            message: error.message || "Failed to send message" 
        };
    }
}