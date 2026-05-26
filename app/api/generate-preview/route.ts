import {NextResponse} from 'next/server';
export async function POST(req:Request){const body=await req.json().catch(()=>({}));return NextResponse.json({ok:true,mode:'mock',note:'Production route: verify CAPTCHA/session quota, call selected image API, store prompt/image, decrement credits.',prompt:body});}
