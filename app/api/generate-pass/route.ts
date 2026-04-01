import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vehicleNumber } = await req.json();

    // Use Environment Variables for Security
    const API_KEY = process.env.PASSSLOT_API_KEY || 'ATNBjtgYLALbttpXYfdJGCPofTihtTBCvupaibsfCMEuFZcPGUdLTzkujozKLLbA';
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
          "vehicleNumber": vehicleNumber // <-- This MUST match your PassSlot field name exactly
        }
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("PassSlot Error Log:", errorDetail);
      return NextResponse.json({ 
        error: `PassSlot rejected the request. Check your Template field names.` 
      }, { status: 500 });
    }

    const passBuffer = await response.arrayBuffer();

    return new NextResponse(passBuffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="fuel-pass.pkpass"`,
      },
    });
  } catch (error: any) {
    console.error("Internal API Error:", error.message);
    return NextResponse.json({ error: "System failure. Check connection." }, { status: 500 });
  }
}