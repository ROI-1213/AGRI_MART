import { NextResponse } from 'next/server';
import {
  getAllEnquiries,
  createEnquiryInDb,
  updateEnquiryInDb,
  deleteEnquiryInDb,
} from '@/lib/db';

function deriveEnquiryTypeLabel(body: any): string {
  if (body.type) return body.type;
  if (body.enquiryType === 'SUBSIDY_APPLICATION') return 'Subsidy Guidance';
  if (body.enquiryType === 'QUOTE_REQUEST') {
    return body.userType === 'DEALER' ? 'Dealer Quote Request' : 'Product Quote Request';
  }
  return body.contactType || 'Product Enquiry';
}

function deriveSubject(body: any): string {
  if (body.subject && String(body.subject).trim()) return String(body.subject).trim();
  if (body.productName) {
    const prefix = body.enquiryType === 'SUBSIDY_APPLICATION' ? 'Subsidy Application: ' : 'Quote Request: ';
    const code = body.riplCode ? ` (${body.riplCode})` : '';
    const qty = body.quantity ? ` × ${body.quantity}` : '';
    return `${prefix}${body.productName}${code}${qty}`;
  }
  if (body.message && String(body.message).trim()) {
    return String(body.message).trim().slice(0, 200);
  }
  return 'Website Enquiry';
}

export async function GET() {
  try {
    const enquiries = await getAllEnquiries();
    return NextResponse.json({ success: true, count: enquiries.length, enquiries });
  } catch (err: any) {
    console.error('Error fetching enquiries from PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = (body.name || body.username || '').trim();
    const mobile = (body.mobile || '').trim();

    if (!customerName) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!mobile) {
      return NextResponse.json({ success: false, error: 'Mobile number is required' }, { status: 400 });
    }

    const now = new Date();
    const id = body.id || `enq_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const dateLabel =
      body.date || now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const created = await createEnquiryInDb({
      id,
      name: customerName,
      mobile,
      email: (body.email || '').trim(),
      whatsappNo: (body.whatsapp_no || body.whatsappNo || '').trim(),
      type: deriveEnquiryTypeLabel(body),
      enquiryType: body.enquiryType || 'PRODUCT_ENQUIRY',
      subject: deriveSubject(body),
      message: (body.message || '').trim(),
      userType: body.userType || body.feedbackType || 'CUSTOMER',
      gstNumber: (body.gstNumber || '').trim(),
      productId: body.productId || '',
      productName: body.productName || '',
      riplCode: body.riplCode || '',
      brand: body.brand || '',
      country: body.country || 'India',
      state: body.state || '',
      city: body.city || '',
      address: body.address || '',
      townTaluk: body.town_taluk || body.townTaluk || '',
      pincode: body.pincode || '',
      quantity: Number(body.quantity) || 1,
      landSize: body.land_size || body.landSize || '',
      cropName: body.crop_name || body.cropName || '',
      date: dateLabel,
      status: body.status || 'NEW',
      notes: (body.notes || '').trim(),
      createdAt: now.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry recorded successfully. Agrimart team will contact you.',
      submissionId: created.id,
      enquiry: created,
    });
  } catch (err: any) {
    console.error('Error recording enquiry in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Enquiry ID is required' }, { status: 400 });
    }

    const updated = await updateEnquiryInDb(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (err: any) {
    console.error('Error updating enquiry in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Enquiry ID is required' }, { status: 400 });
    }

    const deleted = await deleteEnquiryInDb(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting enquiry in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
