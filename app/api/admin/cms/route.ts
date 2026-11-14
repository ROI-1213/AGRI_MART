import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCmsSetting, upsertCmsSetting } from '@/lib/db';
import { DEFAULT_HOMEPAGE_CMS, DEFAULT_ABOUTUS_CMS, DEFAULT_CONTACTUS_CMS, DEFAULT_FOOTER_CMS } from '@/lib/cmsDefaults';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const data = await getCmsSetting(key);
      const fallback = key === 'homepage' 
        ? DEFAULT_HOMEPAGE_CMS 
        : key === 'aboutus' 
        ? DEFAULT_ABOUTUS_CMS 
        : key === 'contactus'
        ? DEFAULT_CONTACTUS_CMS
        : key === 'footer'
        ? DEFAULT_FOOTER_CMS
        : null;
      const merged = (data && fallback) ? { ...fallback, ...data } : (data || fallback);
      return NextResponse.json({ success: true, key, data: merged });
    }

    const [homepage, aboutus, contactus, footer] = await Promise.all([
      getCmsSetting('homepage'),
      getCmsSetting('aboutus'),
      getCmsSetting('contactus'),
      getCmsSetting('footer'),
    ]);

    return NextResponse.json({
      success: true,
      homepage: homepage ? { ...DEFAULT_HOMEPAGE_CMS, ...homepage } : DEFAULT_HOMEPAGE_CMS,
      aboutus: aboutus ? { ...DEFAULT_ABOUTUS_CMS, ...aboutus } : DEFAULT_ABOUTUS_CMS,
      contactus: contactus ? { ...DEFAULT_CONTACTUS_CMS, ...contactus } : DEFAULT_CONTACTUS_CMS,
      footer: footer ? { ...DEFAULT_FOOTER_CMS, ...footer } : DEFAULT_FOOTER_CMS,
    });
  } catch (err: any) {
    console.error('Error loading CMS settings from PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, data } = body;

    if (!key || !data) {
      return NextResponse.json({ success: false, error: 'key and data are required' }, { status: 400 });
    }

    const saved = await upsertCmsSetting(key, data);

    try {
      if (key === 'homepage') revalidatePath('/');
      if (key === 'aboutus') revalidatePath('/about');
      if (key === 'contactus') revalidatePath('/contact');
      if (key === 'footer') {
        revalidatePath('/', 'layout');
      }
    } catch {
      // Ignore outside request context
    }

    return NextResponse.json({
      success: true,
      message: `${key} CMS settings saved to PostgreSQL`,
      key,
      data: saved,
    });
  } catch (err: any) {
    console.error('Error saving CMS settings to PostgreSQL:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
