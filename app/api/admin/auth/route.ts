import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCmsSetting, upsertCmsSetting } from '@/lib/db';

interface AdminAuthRecord {
  email: string;
  password?: string;
  passwordHash?: string;
  updatedAt?: string;
}

const DEFAULT_ADMIN_EMAIL = 'admin@agrimart.in';
const DEFAULT_ADMIN_PASS = 'admin123';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPasswordMatch(candidate: string, record?: AdminAuthRecord | null): boolean {
  if (!record || (!record.password && !record.passwordHash)) {
    return candidate === DEFAULT_ADMIN_PASS;
  }
  if (record.password && candidate === record.password) {
    return true;
  }
  if (record.passwordHash && hashPassword(candidate) === record.passwordHash) {
    return true;
  }
  return false;
}

export async function GET() {
  try {
    const authRecord = await getCmsSetting<AdminAuthRecord>('admin_auth');
    return NextResponse.json({
      success: true,
      email: authRecord?.email || DEFAULT_ADMIN_EMAIL,
      hasCustomPassword: Boolean(authRecord?.password || authRecord?.passwordHash),
      lastUpdated: authRecord?.updatedAt || null,
    });
  } catch (error) {
    console.error('Error fetching admin auth info:', error);
    return NextResponse.json({
      success: true,
      email: DEFAULT_ADMIN_EMAIL,
      hasCustomPassword: false,
      lastUpdated: null,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const authRecord = await getCmsSetting<AdminAuthRecord>('admin_auth');

    // 1. VERIFY CREDENTIALS (USED BY AUTHMODAL / LOGIN SCREEN)
    if (action === 'verify') {
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';
      const targetEmail = (authRecord?.email || DEFAULT_ADMIN_EMAIL).toLowerCase();

      if (email === targetEmail && verifyPasswordMatch(password, authRecord)) {
        return NextResponse.json({
          success: true,
          message: 'Authentication successful',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid email address or password. Please try again.',
          },
          { status: 401 }
        );
      }
    }

    // 2. CHANGE PASSWORD (USED IN ADMIN SETTINGS)
    if (action === 'change-password') {
      const currentPassword = (body.currentPassword || '').trim();
      const newPassword = (body.newPassword || '').trim();
      const confirmPassword = (body.confirmPassword || '').trim();

      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Please enter your current password.' },
          { status: 400 }
        );
      }

      if (!newPassword) {
        return NextResponse.json(
          { success: false, message: 'Please enter a new password.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return NextResponse.json(
          { success: false, message: 'New password and confirmation password do not match.' },
          { status: 400 }
        );
      }

      // Verify current password matches existing record
      if (!verifyPasswordMatch(currentPassword, authRecord)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Current password is incorrect. Please check and re-enter your current password.',
          },
          { status: 400 }
        );
      }

      if (currentPassword === newPassword) {
        return NextResponse.json(
          {
            success: false,
            message: 'New password cannot be the same as your current password.',
          },
          { status: 400 }
        );
      }

      // Save new credentials to PostgreSQL cms_settings
      const updatedRecord: AdminAuthRecord = {
        email: authRecord?.email || DEFAULT_ADMIN_EMAIL,
        password: newPassword, // Plaintext fallback for easy debug/support
        passwordHash: hashPassword(newPassword), // SHA-256 secure hash
        updatedAt: new Date().toISOString(),
      };

      await upsertCmsSetting('admin_auth', updatedRecord);

      return NextResponse.json({
        success: true,
        message: 'Admin password changed successfully! Your new password has been saved to the database.',
        lastUpdated: updatedRecord.updatedAt,
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown action specified.' }, { status: 400 });
  } catch (error) {
    console.error('Error handling admin auth request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing authentication request.' },
      { status: 500 }
    );
  }
}
