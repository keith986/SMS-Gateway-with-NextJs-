import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Log the incoming data for debugging
    console.log("M-Pesa callback received:", JSON.stringify(data, null, 2));

    // Check if callback has metadata (successful transaction)
    if (!data?.Body?.stkCallback?.CallbackMetadata) {
      // Handle failed transactions
      const resultDesc = data?.Body?.stkCallback?.ResultDesc || "Transaction failed";
      console.log("Transaction failed:", resultDesc);
      
      // Always return 200 OK to M-Pesa to acknowledge receipt
      return NextResponse.json(
        { ResultCode: 0, ResultDesc: "Success" }, 
        { status: 200 }
      );
    }

    // Extract values from callback metadata
    const callbackMetadata = data.Body.stkCallback.CallbackMetadata;
    const items = callbackMetadata.Item || [];

    // Safely extract values
    const amountObj = items.find((obj: any) => obj.Name === "Amount");
    const mpesaCodeObj = items.find((obj: any) => obj.Name === "MpesaReceiptNumber");
    const phoneNumberObj = items.find((obj: any) => obj.Name === "PhoneNumber");

    // Validate required fields exist
    if (!amountObj || !mpesaCodeObj || !phoneNumberObj) {
      console.error("Missing required callback data");
      return NextResponse.json(
        { ResultCode: 0, ResultDesc: "Success" }, 
        { status: 200 }
      );
    }

    const amount = amountObj.Value;
    const mpesaCode = mpesaCodeObj.Value;
    const phoneNumber = phoneNumberObj.Value.toString();

    console.log("Transaction details:", { amount, mpesaCode, phoneNumber });

    // TODO: Save transaction to database
    // await saveTransaction({ amount, mpesaCode, phoneNumber });

    // Always return success response to M-Pesa
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Callback processing error:", error);
    
    // Still return success to M-Pesa to avoid retries
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" }, 
      { status: 200 }
    );
  }
}

// Add GET method for testing
export async function GET() {
  return NextResponse.json({ message: "M-Pesa callback endpoint is working" });
}