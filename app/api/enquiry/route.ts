import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Inbound Agrimart Enquiry/Subsidy]:', body);

    // Validate required fields
    if (!body.name && !body.username) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const submission = {
      id: `sub_${Date.now()}`,
      receivedAt: new Date().toISOString(),
      status: 'RECEIVED',
      data: body
    };

    return NextResponse.json({
      success: true,
      message: 'Enquiry recorded successfully. Agrimart team will contact you.',
      submissionId: submission.id
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
