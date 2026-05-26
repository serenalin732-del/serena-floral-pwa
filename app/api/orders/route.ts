import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function headers(){
  if(!SUPABASE_ANON_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function supabaseInsert(table:string, payload:Record<string,unknown>):Promise<void>{
  if(!SUPABASE_URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method:'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(`${table} insert failed: ${res.status} ${text}`);
  }
}

function dollarsToCents(value:string|undefined):number|null{
  if(!value) return null;
  const cleaned = value.replace(/[^0-9.]/g,'');
  if(!cleaned) return null;
  return Math.round(Number(cleaned) * 100);
}

function splitContact(contact:string|undefined):{email:string|null; phone:string|null}{
  const value = (contact || '').trim();
  if(!value) return {email:null, phone:null};
  return value.includes('@') ? {email:value, phone:null} : {email:null, phone:value};
}

export async function POST(req:Request){
  try{
    const body = await req.json().catch(()=>({}));
    const contact = splitContact(body.contact);
    const fullName = (body.name || '').trim() || null;

    const customerId = randomUUID();
    const orderId = randomUUID();

    await supabaseInsert('customers', {
      id: customerId,
      full_name: fullName,
      email: contact.email,
      phone: contact.phone,
      source: 'website',
      notes: body.notes || null,
    });

    await supabaseInsert('orders', {
      id: orderId,
      customer_id: customerId,
      source: 'ai_builder',
      order_type: (
        String(body.occasion || '').toLowerCase().includes('funeral') ||
        String(body.occasion || '').toLowerCase().includes('sympathy')
      ) ? 'funeral' : 'residential',
      status: 'new',
      occasion: body.occasion || null,
      recipient_type: body.recipient || null,
      color_palette: body.paletteLabel || body.palette || null,
      preferred_flowers: body.flowers || null,
      budget_cents: dollarsToCents(body.budget),
      special_requests: body.notes || null,
      delivery_zip: body.zip || null,
      sender_name: fullName,
    });

    await supabaseInsert('lead_events', {
      customer_id: customerId,
      order_id: orderId,
      event_type: 'submit_order',
      metadata: body,
    });

    return NextResponse.json({ok:true, orderId});
  }catch(error){
    console.error(error);
    return NextResponse.json({
      ok:false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {status:500});
  }
}

export async function GET(){
  return NextResponse.json({
    ok:true,
    message:'Orders API is connected. POST to create Supabase customer/order records.'
  });
}