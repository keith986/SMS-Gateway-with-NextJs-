 "use server"
 import {NextRequest} from "next/server"
 import { promises as fs } from 'fs'

 export async function POST(req: NextRequest){
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
        try {
            const body = await req.json();
            console.log("Callback received:", body);

            // Save the callback data to a file (or database)
            const timestamp = generateTimestamp();
            const filename = `mpesa_callback_${timestamp}.json`;
            await fs.writeFile(`./callbacks/${filename}`, JSON.stringify(body, null, 2));

            return new Response("Callback processed successfully", { status: 200 });
        } catch (error) {
            console.error("Error processing callback:", error);
            return new Response("Failed to process callback", { status: 500 });
        }
    }