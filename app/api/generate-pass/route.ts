import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vehicleNumber } = await req.json();

    // HARDCODED FOR THE 12:00 AM DEADLINE (Bypass Vercel Variable Delays)
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
          "vehicleNumber": vehicleNumber 
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PassSlot Error:", errorText);
      return NextResponse.json({ error: "PassSlot Failed" }, { status: 500 });
    }

    const passBuffer = await response.arrayBuffer();

    // Use a standard Response for binary data
    return new Response(passBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="FuelPass.pkpass"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Crash" }, { status: 500 });
  }
}