import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { params: string[] } }
) {
  const [studyInstanceUid, seriesInstanceUid] = params.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Načtení DICOM dat z Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('dicom')
      .download(`${studyInstanceUid}/${seriesInstanceUid}`);

    if (error) {
      throw error;
    }

    // Nastavení správných CORS hlaviček pro Cornerstone
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/dicom',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching DICOM data:', error);
    return new NextResponse(null, { status: 500 });
  }
}
