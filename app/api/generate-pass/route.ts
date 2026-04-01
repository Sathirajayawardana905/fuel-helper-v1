import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vehicleNumber = searchParams.get('v');

  if (!vehicleNumber) return new Response("Missing Vehicle Number", { status: 400 });

  try {
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
      return new Response("PassSlot API Error. Check your Template ID or Field Tags.", { status: 500 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="FuelPass_${vehicleNumber}.pkpass"`,
      },
    });
  } catch (e) {
    return new Response("Server Crash", { status: 500 });
  }
}