import { NextResponse } from 'next/server';
import {
  getAllPartnerApplications,
  createPartnerApplicationInDb,
  updatePartnerApplicationInDb,
  deletePartnerApplicationInDb,
} from '@/lib/db';

export async function GET() {
  try {
    const applications = await getAllPartnerApplications();
    return NextResponse.json({ success: true, applications });
  } catch (err: any) {
    console.error('Error reading partner applications from PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      whatsapp,
      companyName,
      businessType,
      address,
      state,
      city,
      pincode,
      yearsInBusiness,
      gstin,
      pan,
      categoriesOfInterest,
      existingBrands,
      message,
    } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ success: false, error: 'Full Name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ success: false, error: 'A valid 10-digit mobile number is required.' }, { status: 400 });
    }
    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ success: false, error: 'Business / Company Name is required.' }, { status: 400 });
    }
    if (!city || !city.trim()) {
      return NextResponse.json({ success: false, error: 'City is required.' }, { status: 400 });
    }
    if (!state || !state.trim()) {
      return NextResponse.json({ success: false, error: 'State is required.' }, { status: 400 });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `AGR-DLR-${dateStr}-${randomSuffix}`;

    const created = await createPartnerApplicationInDb({
      id: applicationId,
      createdAt: new Date().toISOString(),
      status: 'NEW',
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      companyName: companyName.trim(),
      businessType: businessType || 'Proprietorship',
      address: (address || '').trim(),
      state: state.trim(),
      city: city.trim(),
      pincode: (pincode || '').trim(),
      yearsInBusiness: yearsInBusiness || '1-3 Years',
      gstin: (gstin || '').trim().toUpperCase(),
      pan: (pan || '').trim().toUpperCase(),
      categoriesOfInterest: Array.isArray(categoriesOfInterest) ? categoriesOfInterest : [],
      existingBrands: (existingBrands || '').trim(),
      message: (message || '').trim(),
      adminNotes: '',
    });

    return NextResponse.json({
      success: true,
      applicationId: created.id,
      message: 'Your dealership application has been submitted successfully.',
      application: created,
    });
  } catch (err: any) {
    console.error('Error creating partner application in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required.' }, { status: 400 });
    }

    const updated = await updatePartnerApplicationInDb(id, { status, adminNotes });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error('Error updating partner application in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required.' }, { status: 400 });
    }

    const deleted = await deletePartnerApplicationInDb(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting partner application in PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
