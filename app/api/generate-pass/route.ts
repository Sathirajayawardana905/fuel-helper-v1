import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vehicleNumber } = await req.json();
    console.log("API received request for:", vehicleNumber);

    const API_KEY = 'ATNBjtgYLALbttpXYfdJGCPofTihtTBCvupaibsfCMEuFZcPGUdLTzkujozKLLbA';
    const TEMPLATE_ID = '5556934326484992';

    const auth = Buffer.from(`${API_KEY}:`).toString('base64');

    const response = await fetch(`https://api.passslot.com/v1/templates/${TEMPLATE_ID}/pass`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: {
          "vehicleNumber": vehicleNumber // <-- This MUST match your PassSlot field name
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(`PassSlot Error: ${errorText}`, { status: 500 });
    }

    const passBuffer = await response.arrayBuffer();

    return new NextResponse(passBuffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="fuel-pass.pkpass"`,
      },
    });
  } catch (error: any) {
    return new NextResponse(`Internal System Error: ${error.message}`, { status: 500 });
  }
}