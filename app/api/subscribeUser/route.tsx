import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const body = await req.json();

    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const DATACENTER = process.env.MAILCHIMP_API_SERVER;

    const data = {
      email_address: body.email,
      status: 'subscribed', // Adjust the status according to your needs
      merge_fields: {
        FNAME: body.firstName || "",
        LNAME: body.lastName || "",
      },
    };

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json(); // Assuming Mailchimp API returns JSON
    if (response.ok) {
      return NextResponse.json({ status: '200', data: result });
    } else {
      console.error('Mailchimp API Error:', result);
      return NextResponse.json({ status: '400', error: result }, { status: response.status });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ status: 'error', error: 'Internal Server Error' }, { status: 500 });
  }
}
