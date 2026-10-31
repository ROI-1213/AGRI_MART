import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'import', 'partner_applications.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function getApplications() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading partner applications:', err);
    return [];
  }
}

function saveApplications(apps: any[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf8');
}

export async function GET() {
  try {
    const apps = getApplications();
    return NextResponse.json({ success: true, applications: apps });
  } catch (err: any) {
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
      message
    } = body;

    // Validation
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

    const apps = getApplications();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `AGR-DLR-${dateStr}-${randomSuffix}`;

    const newApp = {
      id: applicationId,
      createdAt: new Date().toISOString(),
      status: 'NEW', // NEW, UNDER_REVIEW, CONTACTED, APPROVED, REJECTED
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
      adminNotes: ''
    };

    apps.unshift(newApp);
    saveApplications(apps);

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      message: 'Your dealership application has been submitted successfully.',
      application: newApp
    });
  } catch (err: any) {
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

    const apps = getApplications();
    const index = apps.findIndex((a: any) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
    }

    if (status) {
      apps[index].status = status;
    }
    if (typeof adminNotes === 'string') {
      apps[index].adminNotes = adminNotes;
    }
    apps[index].updatedAt = new Date().toISOString();

    saveApplications(apps);

    return NextResponse.json({ success: true, application: apps[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
