import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vehicleNumber } = await req.json();
    
    // PRODUCTION KEYS - HARDCODED FOR MIDNIGHT DEPLOY
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
      const errRes = await response.text();
      return NextResponse.json({ error: errRes }, { status: 500 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': 'attachment; filename="fuelpass.pkpass"',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}