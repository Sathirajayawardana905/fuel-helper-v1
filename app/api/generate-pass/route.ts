import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vehicleNumber, fuelCode } = await req.json();

    const PASSLOT_API_KEY = 'ATNBjtgYLALbttpXYfdJGCPofTihtTBCvupaibsfCMEuFZcPGUdLTzkujozKLLbA'; 
    const TEMPLATE_ID = '5556934326484992';

    const auth = Buffer.from(`${PASSLOT_API_KEY}:`).toString('base64');

    const response = await fetch(`https://api.passslot.com/v1/templates/${TEMPLATE_ID}/pass`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      // IMPORTANT: PassSlot usually expects values inside a "values" object
      body: JSON.stringify({
        values: {
          "vehicleNumber": vehicleNumber,
          "fuelCode": fuelCode 
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PassSlot Error:", errorText);
      throw new Error('PassSlot API failed');
    }

    const passBuffer = await response.arrayBuffer();

    return new NextResponse(passBuffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="fuel-pass.pkpass"`,
      },
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json({ error: "Wallet generation failed" }, { status: 500 });
  }
}