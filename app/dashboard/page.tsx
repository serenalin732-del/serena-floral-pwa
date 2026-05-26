import {Nav,MobileBar} from '@/components/Nav';import {sampleOrders} from '@/lib/data';
export default function Dashboard(){return <><Nav/><section><div className="section-head"><h2>Order dashboard</h2><p className="muted">A lightweight bridge before POS: all website/custom orders are saved, emailed, printable, and visible to Serena remotely.</p></div><div className="grid2"><div className="panel"><h3>New orders</h3>{sampleOrders.map(o=><div className="order" key={o.id}><div><b>{o.title}</b><div className="muted">{o.id} • {o.meta}</div></div><span className={'tag '+(o.tag==='Funeral'?'funeral':'')}>{o.tag}</span></div>)}</div><div className="panel"><h3>Printable order</h3><div className="print-row"><span>Source</span><b>Website / AI Custom</b></div><div className="print-row"><span>Occasion</span><b>Birthday</b></div><div className="print-row"><span>Budget</span><b>$100</b></div><div className="print-row"><span>Palette</span><b>Soft blush</b></div><div className="print-row"><span>Status</span><b>New</b></div><p className="muted">This sheet is the bridge between digital intake and current staff print/handwrite workflow.</p></div></div></section><section><div className="panel"><h3>Email order template preview</h3><pre style={{whiteSpace:'pre-wrap',background:'#fffaf6',padding:18,borderRadius:16,border:'1px solid var(--line)'}}>{`Subject: New Website Custom Order — Birthday — $100 — Springdale delivery

NEW CUSTOM ORDER
Source: Website / AI Bouquet Builder
Customer: {{customer_name}}
Contact: {{email}} / {{phone}}
Occasion: Birthday
Recipient: Friend
Budget: $100
Palette: Soft blush, cream, and greenery
Flowers: Designer's choice seasonal mix
Delivery ZIP: 15144
Preferred delivery date: {{date}}
Card message: {{card_message}}
Special requests: {{special_requests}}
AI preview: {{image_url}}

Staff note: AI preview is inspiration only. Confirm availability/substitutions before fulfillment.`}</pre></div></section><MobileBar/></>}
