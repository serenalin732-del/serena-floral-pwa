"use client";
import {useState} from 'react';

const paletteMap:any={
  blush:['#f2c7bd','#fff0ca','#d98973','#f0b7aa','#58765b'],
  bright:['#f18a55','#ffd166','#e65f5c','#7fb069','#9b5de5'],
  white:['#fffaf0','#e8eadf','#c8d6c0','#f7f7f0','#4f6f55'],
  purple:['#d8c2e8','#a782c3','#f0d8ef','#fff0ca','#526f55'],
  sunny:['#ffd166','#f5a06f','#fff0ca','#e9c46a','#526f55']
};

const paletteLabels:any={
  blush:'Soft blush, cream, and greenery',
  bright:'Bright mixed seasonal',
  white:'White, green, and peaceful',
  purple:'Lavender and purple',
  sunny:'Yellow and warm peach'
};

export function BouquetBuilder(){
  const [form,setForm]=useState({occasion:'Birthday',recipient:'Friend',palette:'blush',flowers:'Designer’s choice seasonal mix',budget:'$75',zip:'',notes:''});
  const [generations,setGenerations]=useState(0);
  const [gate,setGate]=useState(false);
  const [unlocked,setUnlocked]=useState(false);
  const [lead,setLead]=useState({name:'',contact:''});
  const [submitting,setSubmitting]=useState(false);
  const [message,setMessage]=useState('');
  const colors=paletteMap[form.palette];
  const bg=`radial-gradient(circle at ${34+generations*3}% 25%,${colors[0]} 0 10%,transparent 11%),radial-gradient(circle at 55% 18%,${colors[1]} 0 12%,transparent 13%),radial-gradient(circle at 70% 38%,${colors[2]} 0 11%,transparent 12%),radial-gradient(circle at 39% 53%,${colors[3]} 0 16%,transparent 17%),radial-gradient(ellipse at 50% 78%,${colors[4]} 0 28%,transparent 29%)`;

  function set(k:string,v:string){setForm({...form,[k]:v})}
  function gen(){if(generations>=1&&!unlocked){setGate(true);return}setGenerations(g=>g+1)}

  async function submit(){
    if(!unlocked){setGate(true);return}
    setSubmitting(true);
    setMessage('');
    try{
      const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,paletteLabel:paletteLabels[form.palette],name:lead.name,contact:lead.contact})});
      const data=await res.json();
      if(!res.ok||!data.ok) throw new Error(data.error||'Order submission failed');
      setMessage(`Saved to Supabase. Order ${data.orderId} is ready for staff follow-up.`);
    }catch(error){
      setMessage(error instanceof Error?error.message:'Could not submit order.');
    }finally{
      setSubmitting(false);
    }
  }

  return <div className="grid2"><div className="panel"><div className="formgrid"><div><label>Occasion</label><select value={form.occasion} onChange={e=>set('occasion',e.target.value)}><option>Birthday</option><option>Sympathy / Condolence</option><option>Funeral service</option><option>Anniversary</option><option>Get well</option><option>Just because</option></select></div><div><label>Recipient</label><select value={form.recipient} onChange={e=>set('recipient',e.target.value)}><option>Friend</option><option>Family member</option><option>Spouse / partner</option><option>Parent</option><option>Funeral home</option><option>Professional contact</option></select></div><div><label>Color palette</label><select value={form.palette} onChange={e=>set('palette',e.target.value)}><option value="blush">Soft blush, cream, and greenery</option><option value="bright">Bright mixed seasonal</option><option value="white">White, green, and peaceful</option><option value="purple">Lavender and purple</option><option value="sunny">Yellow and warm peach</option></select></div><div><label>Preferred flowers</label><select value={form.flowers} onChange={e=>set('flowers',e.target.value)}><option>Designer’s choice seasonal mix</option><option>Roses</option><option>Hydrangeas</option><option>Lilies</option><option>Tulips</option><option>No strong fragrance</option></select></div><div><label>Budget</label><select value={form.budget} onChange={e=>set('budget',e.target.value)}><option>$75</option><option>$100</option><option>$125</option><option>$150</option><option>$200+</option></select></div><div><label>Delivery ZIP</label><input value={form.zip} onChange={e=>set('zip',e.target.value)} placeholder="15144" /></div><div className="full"><label>Special requests</label><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Example: soft, not too tall, include pink flowers if fresh..." /></div><div className="full" style={{display:'flex',gap:10,flexWrap:'wrap'}}><button className="btn" onClick={gen}>Generate {generations?'another':'free'} AI preview</button><button className="btn secondary" onClick={submit} disabled={submitting}>{submitting?'Sending...':'Send to florist'}</button></div></div>{message&&<p className="notice">{message}</p>}<p className="notice">Production: connect this to a low-cost image API, save the prompt/image, create an order record, then email a clean order template to staff.</p></div><div className="panel"><div className="preview-art"><div className="art" style={{'--art-bg':bg} as any}/>{gate&&<div className="gate"><div className="gate-card"><h3>Save or generate again</h3><p className="muted">One AI preview is free. Enter contact details to save, regenerate, or send this idea.</p><input placeholder="Name" value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})}/><br/><br/><input placeholder="Email or phone" value={lead.contact} onChange={e=>setLead({...lead,contact:e.target.value})}/><br/><br/><button className="btn" onClick={()=>{if(lead.contact){setUnlocked(true);setGate(false);gen()}}}>Continue</button></div></div>}</div><h3>{form.palette==='white'?'White and green':form.palette==='bright'?'Bright mixed':'Soft'} {form.occasion.toLowerCase()} bouquet</h3><p className="muted">{form.flowers} • {form.budget} • {form.zip||'local delivery'}</p><p className="muted"><small>AI preview is for inspiration only. Final arrangements may vary based on fresh flower availability, seasonality, container options, and designer judgment.</small></p></div></div>
}
