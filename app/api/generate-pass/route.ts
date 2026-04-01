import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vNo = searchParams.get('v');

  if (!vNo) return new Response("Error: No vehicle number provided in URL", { status: 400 });

  try {
    // HARDCODED KEYS FOR EMERGENCY DEPLOY
    const API_KEY = 'ATNBjtgYLALbttpXYfdJGCPofTihtTBCvupaibsfCMEuFZcPGUdLTzkujozKLLbA';
    const TEMPLATE_ID = '5556934326484992';
    const auth = Buffer.from(`${API_KEY}:`).toString('base64');

    const response = await fetch(`https://api.passslot.com/v1/templates/${TEMPLATE_ID}/pass`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      // Sending the vehicle number to BOTH fields just in case your template needs both
      body: JSON.stringify({
        values: {
          "vehicleNumber": vNo,
          "fuelCode": vNo 
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`PassSlot Rejected: ${errorText}`, { status: 500 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="FuelPass_${vNo}.pkpass"`,
      },
    });
  } catch (e: any) {
    return new Response(`Server Error: ${e.message}`, { status: 500 });
  }
}