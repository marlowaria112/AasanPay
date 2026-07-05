import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc,
  getDocs, doc, updateDoc, query, orderBy
} from "firebase/firestore";
import {
  Wallet, Users, Clock, ArrowRight, CheckCircle2, XCircle,
  LogOut, Eye, X, Lock, User, Phone, MapPin, Landmark,
  CreditCard, Calendar, BadgeCheck, Star, TrendingUp,
  Shield, Heart, Sparkles, Gift, HandHeart, FileText,
  AlertTriangle, Scale, RefreshCw,
} from "lucide-react";

// ====================================================
// 🔥 FIREBASE CONFIG
// ====================================================
const firebaseConfig = {
  apiKey: "AIzaSyCwt-pj6QUItIOM0KbS-CejZH8kRdzlEus",
  authDomain: "aasanpay-9c3a0.firebaseapp.com",
  projectId: "aasanpay-9c3a0",
  storageBucket: "aasanpay-9c3a0.firebasestorage.app",
  messagingSenderId: "925086196881",
  appId: "1:925086196881:web:c1c4ec954868109e52cb30",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// ====================================================

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`;

const STATUS = {
  Pending:   { bg:"#FFF7ED", fg:"#EA580C", bd:"#FDBA74" },
  Approved:  { bg:"#F0FDF4", fg:"#16A34A", bd:"#86EFAC" },
  Rejected:  { bg:"#FEF2F2", fg:"#DC2626", bd:"#FCA5A5" },
  Disbursed: { bg:"#EFF6FF", fg:"#2563EB", bd:"#93C5FD" },
};

const FEED = [
  { name:"Ayesha B.",  city:"Lahore",     amount:"15,000", ago:"3 min" },
  { name:"Usman T.",   city:"Karachi",    amount:"10,000", ago:"7 min" },
  { name:"Bilal A.",   city:"Islamabad",  amount:"20,000", ago:"12 min" },
  { name:"Sana M.",    city:"Faisalabad", amount:"8,000",  ago:"18 min" },
  { name:"Hamza R.",   city:"Rawalpindi", amount:"12,000", ago:"24 min" },
  { name:"Fatima K.",  city:"Multan",     amount:"5,000",  ago:"31 min" },
  { name:"Ahmed S.",   city:"Peshawar",   amount:"18,000", ago:"38 min" },
  { name:"Zainab F.",  city:"Sialkot",    amount:"7,000",  ago:"45 min" },
  { name:"Kamran H.",  city:"Gujranwala", amount:"14,000", ago:"52 min" },
  { name:"Hira N.",    city:"Hyderabad",  amount:"9,000",  ago:"1 hr"   },
  { name:"Farhan J.",  city:"Quetta",     amount:"11,000", ago:"1 hr"   },
  { name:"Maryam W.",  city:"Sukkur",     amount:"16,000", ago:"2 hr"   },
];

const REVIEWS = [
  { name:"Ayesha Fatima", city:"Lahore",    text:"University ki fees ke liye loan liya. Halaal hai, koi interest nahi! Best experience! 💚", amount:"15,000", stars:5, tag:"Student" },
  { name:"Kamran Ali",    city:"Karachi",   text:"Business ke liye capital chahiye tha. 5 ghante mein approve ho gaya. Shukriya AasanPay!", amount:"20,000", stars:5, tag:"Business" },
  { name:"Sana Sheikh",   city:"Islamabad", text:"Online shop ke liye paisa chahiye tha. Bilkul halaal loan mila, no interest. 🤲",          amount:"10,000", stars:5, tag:"Entrepreneur" },
];

const JAZZCASH = "0300-XXXXXXX"; // ← APNA NUMBER YAHAN DAALO

// ── helpers ──────────────────────────────────────────────────────────
function CountUp({ target, suffix="" }){
  const [n,setN]=React.useState(0);
  React.useEffect(()=>{
    let v=0; const inc=target/125;
    const t=setInterval(()=>{ v+=inc; if(v>=target){setN(target);clearInterval(t);}else setN(Math.floor(v)); },16);
    return ()=>clearInterval(t);
  },[target]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

function Ticker(){
  const [i,setI]=React.useState(0);
  const [show,setShow]=React.useState(true);
  React.useEffect(()=>{
    const t=setInterval(()=>{
      setShow(false);
      setTimeout(()=>{ setI(x=>(x+1)%FEED.length); setShow(true); },400);
    },4500);
    return ()=>clearInterval(t);
  },[]);
  const p=FEED[i];
  return(
    <div style={{ maxWidth:460,margin:"0 auto",opacity:show?1:0,transform:show?"translateY(0)":"translateY(-6px)",transition:"all .4s ease" }}>
      <div style={{ background:"#FFF",border:"1px solid #E5E7EB",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
        <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#0D9488,#14B8A6)",color:"#FFF",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0 }}>
          {p.name.split(" ").map(w=>w[0]).join("").replace(".","")}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13,fontWeight:500 }}><strong>{p.name}</strong> ne Rs. {p.amount} liya</div>
          <div style={{ fontSize:11,color:"#9CA3AF" }}>{p.city} • {p.ago} pehle</div>
        </div>
        <div style={{ background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:6,padding:"3px 8px",fontSize:10,color:"#16A34A",fontWeight:600,display:"flex",alignItems:"center",gap:3 }}>
          <CheckCircle2 size={10}/> Verified
        </div>
      </div>
    </div>
  );
}

function Field({ icon:Icon, label, children }){
  return(
    <label style={{ display:"block",marginBottom:18 }}>
      <span style={{ display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#6B7280",marginBottom:6,fontWeight:500 }}>
        <Icon size={14} color="#0D9488"/> {label}
      </span>
      {children}
    </label>
  );
}

const inp={ width:"100%",background:"#FFF",border:"2px solid #E5E7EB",borderRadius:10,padding:"13px 14px",color:"#111827",fontSize:15,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box" };
const B=(x={})=>({ border:"none",borderRadius:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",...x });

// ══════════════════════════════════════════════════════════════════════
export default function AasanPay(){
  const [view,setView]     = useState("landing");
  const [pass,setPass]     = useState("");
  const [passErr,setPassErr]= useState("");
  const [apps,setApps]     = useState([]);
  const [sel,setSel]       = useState(null);
  const [slider,setSlider] = useState(10000);
  const [tid,setTid]       = useState("");
  const [copied,setCopied] = useState(false);
  const [agreed,setAgreed] = useState(false);
  const [loading,setLoading]     = useState(false);
  const [submitting,setSubmitting]= useState(false);
  const [lastDocId,setLastDocId] = useState(null);
  const [form,setForm] = useState({
    fullName:"",cnic:"",phone:"",city:"",category:"",
    purpose:"",loanAmount:"",tenure:"6",easypaisa:""
  });

  // ── Firebase: load all applications ──────────────────────────────
  async function load(){
    setLoading(true);
    try{
      const q    = query(collection(db,"applications"),orderBy("submittedAt","desc"));
      const snap = await getDocs(q);
      setApps(snap.docs.map(d=>({ id:d.id,...d.data() })));
    }catch(e){ console.error(e); setApps([]); }
    setLoading(false);
  }
  useEffect(()=>{ if(view==="admin") load(); },[view]);

  // ── Firebase: submit new application ─────────────────────────────
  async function submit(e){
    e.preventDefault();
    if(!agreed){ alert("Terms & Conditions accept karein!"); return; }
    setSubmitting(true);
    try{
      const ref = await addDoc(collection(db,"applications"),{
        ...form, status:"Pending", tid:"", agreedToTerms:true, submittedAt:Date.now()
      });
      setLastDocId(ref.id);
      setView("payment");
    }catch(e){ alert("Submit error: "+e.message); }
    setSubmitting(false);
  }

  // ── Firebase: save TID after payment ─────────────────────────────
  async function confirmPayment(){
    if(!tid.trim()){ alert("Transaction ID likhein!"); return; }
    try{
      if(lastDocId) await updateDoc(doc(db,"applications",lastDocId),{ tid });
      setView("done"); setTid("");
    }catch(e){ alert("TID save error: "+e.message); }
  }

  // ── Firebase: update status ───────────────────────────────────────
  async function updateStatus(id,status){
    try{
      await updateDoc(doc(db,"applications",id),{ status });
      setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a));
      setSel(prev=>prev?{...prev,status}:null);
    }catch(e){ alert("Update error: "+e.message); }
  }

  function checkAdmin(){
    if(pass==="aasanpay2026"){ setPassErr(""); setView("admin"); }
    else setPassErr("Ghalat password.");
  }

  function copyNum(){
    navigator.clipboard.writeText(JAZZCASH.replace(/-/g,""));
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  }

  const monthly=Math.round(slider/12);

  return(
    <div style={{ minHeight:"100vh",background:"#FAFDFB",color:"#111827",fontFamily:"'Inter',sans-serif" }}>
      <style>{FONT+"*{box-sizing:border-box;margin:0}"}</style>

      {/* ── NAV ── */}
      <nav style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 28px",background:"#FFF",borderBottom:"1px solid #F3F4F6",position:"sticky",top:0,zIndex:40 }}>
        <div onClick={()=>setView("landing")} style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:22 }}>
          <div style={{ background:"linear-gradient(135deg,#0D9488,#14B8A6)",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Wallet size={20} color="#FFF"/>
          </div>
          Aasan<span style={{ color:"#0D9488" }}>Pay</span>
          <span style={{ background:"#F0FDF4",color:"#16A34A",fontSize:9,padding:"3px 8px",borderRadius:6,fontWeight:700 }}>☪ HALAAL</span>
        </div>
        <div style={{ display:"flex",gap:12,alignItems:"center" }}>
          <button onClick={()=>setView("terms")} style={{ background:"none",border:"none",color:"#9CA3AF",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:3 }}>
            <FileText size={11}/> Terms
          </button>
          {view!=="admin"&&<button onClick={()=>setView("admin-login")} style={{ background:"none",border:"none",color:"#E5E7EB",fontSize:11,cursor:"pointer" }}><Lock size={11}/></button>}
          {view==="admin"&&<button onClick={()=>{setView("landing");setPass("");}} style={{ background:"none",border:"none",color:"#9CA3AF",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4 }}><LogOut size={12}/> Exit</button>}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          LANDING
      ══════════════════════════════════════════════════════════ */}
      {view==="landing"&&<>
        {/* hero */}
        <section style={{ background:"linear-gradient(180deg,#F0FDFA,#FAFDFB)",padding:"48px 24px 44px",textAlign:"center" }}>
          <Ticker/>
          <div style={{ marginTop:28,display:"inline-flex",alignItems:"center",gap:8,background:"#FFF",border:"1px solid #99F6E4",borderRadius:24,padding:"8px 18px",fontSize:13,color:"#0F766E",fontWeight:600 }}>
            <span style={{ fontSize:18 }}>☪</span> 100% Halaal — Bilkul ZERO Interest
          </div>
          <h1 style={{ fontSize:"clamp(32px,6vw,50px)",fontWeight:900,lineHeight:1.12,margin:"22px 0 14px",letterSpacing:-1.5 }}>
            Zaroorat ke waqt<br/>
            <span style={{ background:"linear-gradient(135deg,#0D9488,#14B8A6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Halaal madad</span><br/>
            <span style={{ fontSize:"clamp(22px,4vw,34px)",color:"#374151" }}>Rs. 5,000 se 20,000 tak</span>
          </h1>
          <p style={{ fontSize:15,color:"#6B7280",maxWidth:480,margin:"0 auto 18px",lineHeight:1.75 }}>
            Students aur khawateen ke liye <strong style={{ color:"#0D9488" }}>bina interest ka qarz-e-hasna</strong>. Sirf <strong>Rs.&nbsp;350</strong> processing fee — baqi sab FREE.
          </p>
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:28,flexWrap:"wrap" }}>
            {["👩‍🎓 Students","👩 Khawateen","☪ Interest-Free","⚡ 4-6 Ghante"].map((t,i)=>(
              <span key={i} style={{ background:"#FFF",border:"1px solid #E5E7EB",borderRadius:20,padding:"6px 14px",fontSize:12,color:"#374151",fontWeight:500 }}>{t}</span>
            ))}
          </div>
          <button onClick={()=>setView("apply")} style={B({ background:"linear-gradient(135deg,#0D9488,#0F766E)",color:"#FFF",padding:"17px 40px",fontSize:17,display:"inline-flex",alignItems:"center",gap:8,boxShadow:"0 4px 24px rgba(13,148,136,.3)" })}>
            Abhi Apply Karein <ArrowRight size={18}/>
          </button>
          <div style={{ marginTop:12,fontSize:12,color:"#9CA3AF" }}>✅ No Interest &nbsp;✅ No Guarantor &nbsp;✅ 4-6hr Approval</div>
        </section>

        {/* halaal banner */}
        <div style={{ maxWidth:800,margin:"0 auto",padding:"0 24px" }}>
          <div style={{ background:"linear-gradient(135deg,#F0FDFA,#ECFDF5)",border:"1px solid #99F6E4",borderRadius:18,padding:"22px 26px",display:"flex",alignItems:"center",gap:18 }}>
            <span style={{ fontSize:38 }}>🕌</span>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:"#0F766E",marginBottom:4 }}>Kyun hai yeh Halaal?</div>
              <div style={{ fontSize:13,color:"#6B7280",lineHeight:1.7 }}>AasanPay <strong>qarz-e-hasna</strong> ki buniyad pe kaam karta hai. Jitna lete hain utna hi wapas — <strong>1 rupee bhi zyada nahi</strong>.</div>
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{ maxWidth:900,margin:"32px auto 0",padding:"0 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14 }}>
          {[
            { icon:Users,     value:<CountUp target={437} suffix="+"/>, label:"Log le chuke hain", color:"#0D9488" },
            { icon:HandHeart, value:"Rs. 0",                            label:"Interest — ZERO",    color:"#16A34A" },
            { icon:Clock,     value:"4-6 Hrs",                          label:"Mein approval",      color:"#2563EB" },
            { icon:Shield,    value:"Rs. 350",                          label:"One-time fee",        color:"#7C3AED" },
          ].map((s,i)=>(
            <div key={i} style={{ background:"#FFF",borderRadius:14,padding:18,textAlign:"center",border:"1px solid #F3F4F6" }}>
              <s.icon size={22} color={s.color} style={{ marginBottom:6 }}/>
              <div style={{ fontSize:22,fontWeight:800,color:s.color,marginBottom:2 }}>{s.value}</div>
              <div style={{ fontSize:11,color:"#9CA3AF" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* who */}
        <div style={{ maxWidth:900,margin:"44px auto 0",padding:"0 24px" }}>
          <h2 style={{ textAlign:"center",fontSize:26,fontWeight:800,marginBottom:26 }}>Yeh kis ke liye hai?</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16 }}>
            {[
              { emoji:"👩‍🎓",title:"Students",    desc:"Fees, books, laptop — padhai ke liye halaal madad.",     color:"#0D9488",bg:"#F0FDFA" },
              { emoji:"👩",   title:"Khawateen",  desc:"Ghar ke kharche ya apna business shuru karein.",         color:"#7C3AED",bg:"#FAF5FF" },
              { emoji:"🤲",   title:"Zarooratmand",desc:"Emergency medical ya unexpected bills ke liye.",         color:"#EA580C",bg:"#FFF7ED" },
            ].map((c,i)=>(
              <div key={i} style={{ background:c.bg,borderRadius:18,padding:24,textAlign:"center" }}>
                <div style={{ fontSize:40,marginBottom:10 }}>{c.emoji}</div>
                <div style={{ fontWeight:700,fontSize:16,color:c.color,marginBottom:6 }}>{c.title}</div>
                <div style={{ fontSize:13,color:"#6B7280",lineHeight:1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* calculator */}
        <div style={{ maxWidth:520,margin:"44px auto 0",padding:"0 24px" }}>
          <div style={{ background:"#FFF",borderRadius:20,padding:28,border:"1px solid #F3F4F6",textAlign:"center" }}>
            <h3 style={{ fontSize:18,fontWeight:700,marginBottom:4 }}>💰 Loan Calculator</h3>
            <p style={{ color:"#9CA3AF",fontSize:13,marginBottom:18 }}>Slide karo — SAME amount wapas!</p>
            <div style={{ fontSize:44,fontWeight:900,color:"#0D9488",marginBottom:8 }}>Rs.&nbsp;{slider.toLocaleString()}</div>
            <input type="range" min={5000} max={20000} step={1000} value={slider} onChange={e=>setSlider(+e.target.value)} style={{ width:"100%",accentColor:"#0D9488",marginBottom:10 }}/>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:"#9CA3AF",marginBottom:18 }}><span>Rs. 5,000</span><span>Rs. 20,000</span></div>
            <div style={{ background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:14,padding:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              <div><div style={{ fontSize:10,color:"#6B7280",marginBottom:4 }}>MONTHLY</div><div style={{ fontSize:18,fontWeight:800,color:"#0D9488" }}>Rs.&nbsp;{monthly.toLocaleString()}</div></div>
              <div><div style={{ fontSize:10,color:"#6B7280",marginBottom:4 }}>INTEREST</div><div style={{ fontSize:18,fontWeight:800,color:"#16A34A" }}>Rs. 0 ☪</div></div>
              <div><div style={{ fontSize:10,color:"#6B7280",marginBottom:4 }}>TENURE</div><div style={{ fontSize:18,fontWeight:800,color:"#0D9488" }}>12 Mo</div></div>
            </div>
          </div>
        </div>

        {/* how it works */}
        <div style={{ maxWidth:900,margin:"44px auto 0",padding:"0 24px" }}>
          <h2 style={{ textAlign:"center",fontSize:26,fontWeight:800,marginBottom:26 }}>Kaise kaam karta hai?</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16 }}>
            {[
              { s:"01",icon:CreditCard,t:"Form Bharein",   d:"CNIC, phone, kitna chahiye." },
              { s:"02",icon:Wallet,    t:"Rs. 350 Fee",    d:"JazzCash se verification fee." },
              { s:"03",icon:Clock,     t:"4-6 Hrs Review", d:"Team verify karegi aur call karegi." },
              { s:"04",icon:Gift,      t:"Paisa Milega!",  d:"Seedha aapke account mein." },
            ].map((x,i)=>(
              <div key={i} style={{ background:"#FFF",borderRadius:16,padding:20,border:"1px solid #F3F4F6",position:"relative" }}>
                <div style={{ position:"absolute",top:14,right:14,fontSize:32,fontWeight:900,color:"#F3F4F6" }}>{x.s}</div>
                <div style={{ background:"linear-gradient(135deg,#F0FDFA,#ECFDF5)",borderRadius:12,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
                  <x.icon size={20} color="#0D9488"/>
                </div>
                <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>{x.t}</div>
                <div style={{ color:"#6B7280",fontSize:13,lineHeight:1.5 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* fee box */}
        <div style={{ maxWidth:600,margin:"36px auto 0",padding:"0 24px" }}>
          <div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:16,padding:"20px 24px" }}>
            <div style={{ fontWeight:700,fontSize:15,color:"#92400E",marginBottom:8,display:"flex",alignItems:"center",gap:8 }}><Shield size={17}/> Rs. 350 Fee Kyun?</div>
            <div style={{ fontSize:13,color:"#78716C",lineHeight:1.75 }}>
              ✅ CNIC Verification<br/>✅ Background Check<br/>✅ Documentation<br/>✅ SMS &amp; Call Updates<br/><br/>
              ⚠️ Loan mein koi interest <strong>NAHI</strong> hai.
            </div>
          </div>
        </div>

        {/* reviews */}
        <div style={{ maxWidth:900,margin:"44px auto 0",padding:"0 24px" }}>
          <h2 style={{ textAlign:"center",fontSize:26,fontWeight:800,marginBottom:26 }}>Logon ka tajurba</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18 }}>
            {REVIEWS.map((t,i)=>(
              <div key={i} style={{ background:"#FFF",borderRadius:16,padding:22,border:"1px solid #F3F4F6" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <div style={{ display:"flex",gap:2 }}>{Array.from({length:t.stars}).map((_,j)=><Star key={j} size={14} color="#F59E0B" fill="#F59E0B"/>)}</div>
                  <span style={{ background:"#F0FDFA",color:"#0D9488",fontSize:10,padding:"3px 8px",borderRadius:8,fontWeight:600 }}>{t.tag}</span>
                </div>
                <p style={{ color:"#374151",fontSize:13,lineHeight:1.6,marginBottom:14 }}>"{t.text}"</p>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#0D9488,#14B8A6)",color:"#FFF",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:600,fontSize:13 }}>{t.name}</div>
                    <div style={{ fontSize:11,color:"#9CA3AF" }}>{t.city} — Rs.&nbsp;{t.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* urgency */}
        <div style={{ maxWidth:600,margin:"44px auto 0",padding:"0 24px" }}>
          <div style={{ background:"linear-gradient(135deg,#0D9488,#0F766E)",borderRadius:22,padding:"34px 28px",textAlign:"center",color:"#FFF" }}>
            <Sparkles size={28} style={{ marginBottom:8 }}/>
            <h3 style={{ fontSize:22,fontWeight:800,marginBottom:6 }}>Sirf <span style={{ background:"rgba(255,255,255,.2)",borderRadius:8,padding:"2px 12px" }}>563</span> seats baqi!</h3>
            <p style={{ fontSize:14,opacity:.9,marginBottom:16 }}>1000 mein se 437 log already le chuke hain!</p>
            <div style={{ background:"rgba(255,255,255,.15)",borderRadius:10,height:12,overflow:"hidden",marginBottom:18 }}>
              <div style={{ width:"43.7%",height:"100%",background:"#FFF",borderRadius:10 }}/>
            </div>
            <button onClick={()=>setView("apply")} style={B({ background:"#FFF",color:"#0D9488",padding:"14px 32px",fontSize:16 })}>
              Apni Seat Reserve Karein →
            </button>
          </div>
        </div>

        {/* faq */}
        <div style={{ maxWidth:600,margin:"44px auto 0",padding:"0 24px" }}>
          <h2 style={{ textAlign:"center",fontSize:22,fontWeight:800,marginBottom:18 }}>Aksar Poochhe Gaye Sawalaat</h2>
          {[
            { q:"Kya sach mein interest-free hai?", a:"Jee haan! Qarz-e-hasna — jitna lete utna wapas." },
            { q:"Rs. 350 fee kyun?",                a:"CNIC verification aur documentation ke liye." },
            { q:"Kitne waqt mein approve hota hai?",a:"4 se 6 ghante mein." },
            { q:"Loan wapas na karein toh?",        a:"Qanooni karwai ho sakti hai. Terms padhein." },
            { q:"Dobara loan mil sakta hai?",        a:"Haan! Pehla waqt pe ada karein toh dubara eligible." },
          ].map((f,i)=>(
            <div key={i} style={{ background:"#FFF",border:"1px solid #F3F4F6",borderRadius:14,padding:"16px 20px",marginBottom:10 }}>
              <div style={{ fontWeight:700,fontSize:14,color:"#0D9488",marginBottom:4 }}>❓ {f.q}</div>
              <div style={{ fontSize:13,color:"#6B7280",lineHeight:1.6 }}>{f.a}</div>
            </div>
          ))}
        </div>

        {/* footer */}
        <footer style={{ borderTop:"1px solid #F3F4F6",padding:"28px 24px",textAlign:"center",marginTop:44 }}>
          <button onClick={()=>setView("terms")} style={{ background:"none",border:"none",color:"#0D9488",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:4,margin:"0 auto 10px" }}>
            <FileText size={13}/> Terms & Conditions
          </button>
          <div style={{ color:"#9CA3AF",fontSize:12 }}>
            <Heart size={12} color="#0D9488" fill="#0D9488" style={{ verticalAlign:"middle" }}/> AasanPay — Pakistan ka halaal micro-loan platform
          </div>
          <div style={{ color:"#D1D5DB",fontSize:11,marginTop:6 }}>© 2025 AasanPay. All rights reserved.</div>
        </footer>
      </>}

      {/* ══════════════════════════════════════════════════════════
          TERMS
      ══════════════════════════════════════════════════════════ */}
      {view==="terms"&&(
        <div style={{ maxWidth:700,margin:"0 auto",padding:"40px 24px 100px" }}>
          <button onClick={()=>setView("landing")} style={B({ background:"#F3F4F6",color:"#374151",padding:"8px 16px",fontSize:13,marginBottom:24,display:"flex",alignItems:"center",gap:6 })}>← Wapas</button>
          <div style={{ background:"#FFF",borderRadius:20,padding:"32px 28px",border:"1px solid #F3F4F6" }}>
            <div style={{ textAlign:"center",marginBottom:28 }}>
              <div style={{ width:56,height:56,borderRadius:14,background:"#F0FDFA",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}>
                <Scale size={28} color="#0D9488"/>
              </div>
              <h1 style={{ fontSize:26,fontWeight:800,marginBottom:4 }}>Terms & Conditions</h1>
              <p style={{ color:"#9CA3AF",fontSize:13 }}>AasanPay Qarz-e-Hasna Agreement — January 2025</p>
            </div>
            {[
              { icon:FileText,    title:"1. Qarz-e-Hasna",           points:["Shariah-compliant interest-free loan.","Rs. 5,000 se Rs. 20,000 tak.","Koi interest (sood) NAHI.","Jitna lete utna hi wapas."] },
              { icon:CreditCard,  title:"2. Processing Fee Rs. 350", points:["Ek baar ki fee.","CNIC verification ke liye.","Non-refundable.","Loan raqam se alag."] },
              { icon:Calendar,    title:"3. Loan Wapsi",             points:["3, 6, ya 12 months mein wapsi.","Monthly installment waqt pe.","Bar waqt ada = dubara eligible."] },
              { icon:AlertTriangle,title:"4. Default",               points:["Reminder → Formal notice → Qanooni karwai.","CNIC record mein default mark.","Future loans ke liye INELIGIBLE.","Recovery agency se wasool."] },
              { icon:RefreshCw,   title:"5. Dubara Loan",            points:["Pehla waqt pe ada karo — dubara apply karo.","Achi history = zyada raqam.","Default = dobara eligible NAHI."] },
              { icon:Shield,      title:"6. Privacy",                points:["Info 100% safe.","Third party share NAHI.","Sirf loan processing ke liye."] },
              { icon:Scale,       title:"7. Jurisdiction",           points:["Pakistan ke qawaneen.","Local courts ka faisla final.","Terms update ho sakti hain."] },
            ].map((s,i)=>(
              <div key={i} style={{ marginBottom:22 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:"#F0FDFA",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <s.icon size={15} color="#0D9488"/>
                  </div>
                  <h3 style={{ fontSize:15,fontWeight:700 }}>{s.title}</h3>
                </div>
                <div style={{ paddingLeft:38 }}>
                  {s.points.map((p,j)=><div key={j} style={{ fontSize:13,color:"#6B7280",lineHeight:1.8 }}>• {p}</div>)}
                </div>
              </div>
            ))}
            <div style={{ background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:14,padding:"18px 20px",marginTop:20 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <AlertTriangle size={18} color="#DC2626"/>
                <div style={{ fontWeight:700,fontSize:15,color:"#DC2626" }}>⚠️ Ahem Notice</div>
              </div>
              <div style={{ fontSize:13,color:"#991B1B",lineHeight:1.7 }}>
                Loan wapas na karna <strong>qanooni jurm</strong> hai. Aapka <strong>CNIC, phone, address</strong> record mein hai. Default pe <strong>qanooni karwai</strong> aur <strong>recovery</strong> hogi.
              </div>
            </div>
            <div style={{ background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:14,padding:"18px 20px",marginTop:14 }}>
              <div style={{ fontWeight:700,fontSize:15,color:"#16A34A",marginBottom:8,display:"flex",alignItems:"center",gap:8 }}><RefreshCw size={16}/> Dubara Loan?</div>
              <div style={{ fontSize:13,color:"#166534",lineHeight:1.8 }}>✅ Pehla loan waqt pe ada karein<br/>✅ Installments time pe bhejein<br/>✅ Dubara apply — zyada raqam!</div>
            </div>
            <div style={{ textAlign:"center",marginTop:24 }}>
              <button onClick={()=>setView("apply")} style={B({ background:"linear-gradient(135deg,#0D9488,#0F766E)",color:"#FFF",padding:"14px 32px",fontSize:15 })}>
                Terms Accept Karein — Apply →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          APPLY FORM
      ══════════════════════════════════════════════════════════ */}
      {view==="apply"&&(
        <div style={{ maxWidth:520,margin:"0 auto",padding:"44px 24px 100px" }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"#0D9488",background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:20,padding:"5px 14px",marginBottom:10,fontWeight:600 }}>
              <Clock size={12}/> Sirf 2 minute lagein ge
            </div>
            <h2 style={{ fontSize:26,fontWeight:800,marginBottom:4 }}>Halaal Loan ke liye Apply</h2>
            <p style={{ color:"#9CA3AF",fontSize:14 }}>☪ Zero interest — Qarz-e-Hasna</p>
          </div>
          <div style={{ background:"#FFF",borderRadius:20,padding:28,border:"1px solid #F3F4F6" }}>
            <form onSubmit={submit}>
              <Field icon={User}       label="Poora Naam"><input required style={inp} value={form.fullName}  onChange={e=>setForm({...form,fullName:e.target.value})}  placeholder="CNIC ke mutabiq"/></Field>
              <Field icon={CreditCard} label="CNIC Number"><input required style={inp} value={form.cnic}      onChange={e=>setForm({...form,cnic:e.target.value})}      placeholder="XXXXX-XXXXXXX-X"/></Field>
              <Field icon={Phone}      label="WhatsApp Number"><input required style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}     placeholder="03XX-XXXXXXX"/></Field>
              <Field icon={MapPin}     label="Sheher"><input required style={inp} value={form.city}           onChange={e=>setForm({...form,city:e.target.value})}      placeholder="e.g. Lahore"/></Field>
              <Field icon={Users}      label="Aap kaun hain?">
                <select required style={{...inp,cursor:"pointer"}} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="">Select karein</option>
                  <option>Female Student</option><option>Male Student</option>
                  <option>Housewife</option><option>Working Woman</option>
                  <option>Self Employed</option><option>Other</option>
                </select>
              </Field>
              <Field icon={Wallet}     label="Kitna loan chahiye?">
                <select required style={{...inp,cursor:"pointer"}} value={form.loanAmount} onChange={e=>setForm({...form,loanAmount:e.target.value})}>
                  <option value="">Select karein</option>
                  {[5000,7000,10000,12000,15000,18000,20000].map(v=><option key={v} value={v}>Rs. {v.toLocaleString()}</option>)}
                </select>
              </Field>
              <Field icon={Calendar}   label="Wapsi ka waqt">
                <select required style={{...inp,cursor:"pointer"}} value={form.tenure} onChange={e=>setForm({...form,tenure:e.target.value})}>
                  <option value="3">3 Months</option><option value="6">6 Months</option><option value="12">12 Months</option>
                </select>
              </Field>
              <Field icon={Landmark}   label="Easypaisa / JazzCash Number"><input required style={inp} value={form.easypaisa} onChange={e=>setForm({...form,easypaisa:e.target.value})} placeholder="Jis number pe paisa chahiye"/></Field>
              <Field icon={TrendingUp} label="Loan kis liye?">
                <select required style={{...inp,cursor:"pointer"}} value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}>
                  <option value="">Select karein</option>
                  <option>Education / Fees</option><option>Medical Emergency</option>
                  <option>Small Business</option><option>Ghar ke Kharche</option><option>Other</option>
                </select>
              </Field>

              {/* terms checkbox */}
              <div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:"14px 16px",marginBottom:16,marginTop:8 }}>
                <label style={{ display:"flex",alignItems:"start",gap:10,cursor:"pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ width:18,height:18,accentColor:"#0D9488",marginTop:2,flexShrink:0 }}/>
                  <span style={{ fontSize:13,color:"#92400E",lineHeight:1.6 }}>
                    Main ne <strong style={{ color:"#0D9488",cursor:"pointer",textDecoration:"underline" }} onClick={(e)=>{e.preventDefault();setView("terms");}}>Terms & Conditions</strong> padh li hain. Loan wapas na karne ki soorat mein <strong>qanooni karwai</strong> ho sakti hai.
                  </span>
                </label>
              </div>

              <button type="submit" disabled={submitting||!agreed} style={B({ width:"100%",background:agreed?"linear-gradient(135deg,#0D9488,#0F766E)":"#D1D5DB",color:"#FFF",padding:"15px",fontSize:16,marginTop:4,opacity:submitting?.7:1 })}>
                {submitting?"⏳ Submit ho raha hai...":"✓ Submit & Pay Rs. 350"}
              </button>
              <div style={{ textAlign:"center",marginTop:10,fontSize:12,color:"#9CA3AF" }}>🔥 Firebase Secured &nbsp;☪ Zero Interest</div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PAYMENT
      ══════════════════════════════════════════════════════════ */}
      {view==="payment"&&(
        <div style={{ maxWidth:480,margin:"0 auto",padding:"50px 24px 100px",textAlign:"center" }}>
          <div style={{ width:64,height:64,borderRadius:"50%",background:"#F0FDFA",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
            <CheckCircle2 size={36} color="#0D9488"/>
          </div>
          <h2 style={{ fontSize:24,fontWeight:800,marginBottom:6 }}>Application Jama Ho Gayi ✅</h2>
          <p style={{ color:"#6B7280",fontSize:14,marginBottom:24 }}>Ab verification fee <strong>Rs. 350</strong> JazzCash se bhejein</p>
          <div style={{ background:"#FFF",border:"2px solid #0D9488",borderRadius:20,padding:28,textAlign:"left" }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13,fontWeight:700,color:"#0F766E",marginBottom:12 }}>📋 Steps:</div>
              <div style={{ fontSize:13,color:"#374151",lineHeight:2.2 }}>
                <strong>1.</strong> JazzCash app kholein<br/>
                <strong>2.</strong> "Send Money" click karein<br/>
                <strong>3.</strong> Number enter karein<br/>
                <strong>4.</strong> Amount Rs. 350 likhein<br/>
                <strong>5.</strong> Send karein<br/>
                <strong>6.</strong> Transaction ID neeche likhein
              </div>
            </div>
            <div style={{ background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:14,padding:18,marginBottom:20,textAlign:"center" }}>
              <div style={{ fontSize:11,color:"#6B7280",marginBottom:6,fontWeight:600 }}>JAZZCASH NUMBER</div>
              <div style={{ fontSize:26,fontWeight:900,letterSpacing:2,marginBottom:10 }}>{JAZZCASH}</div>
              <div style={{ fontSize:12,color:"#0F766E",marginBottom:10 }}>Account: <strong>AasanPay Verification</strong></div>
              <button onClick={copyNum} style={B({ background:copied?"#16A34A":"#0D9488",color:"#FFF",padding:"8px 20px",fontSize:13 })}>
                {copied?"✅ Copied!":"📋 Copy Number"}
              </button>
            </div>
            <div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:14,marginBottom:20,textAlign:"center" }}>
              <div style={{ fontSize:11,color:"#92400E",fontWeight:600 }}>AMOUNT</div>
              <div style={{ fontSize:32,fontWeight:900,color:"#92400E" }}>Rs. 350</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6 }}>Transaction ID (TID)</div>
              <input value={tid} onChange={e=>setTid(e.target.value)} style={{...inp,textAlign:"center",fontSize:18,fontWeight:600,letterSpacing:1}} placeholder="e.g. 1234567890"/>
              <div style={{ fontSize:11,color:"#9CA3AF",marginTop:4 }}>JazzCash app → Transaction Details mein milega</div>
            </div>
            <button onClick={confirmPayment} style={B({ width:"100%",background:"linear-gradient(135deg,#0D9488,#0F766E)",color:"#FFF",padding:"16px",fontSize:16 })}>
              ✓ Payment Confirm Karein
            </button>
          </div>
          <div style={{ marginTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:"#9CA3AF",fontSize:12 }}>
            <Shield size={14}/> 100% Secure — Firebase Protected
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          DONE
      ══════════════════════════════════════════════════════════ */}
      {view==="done"&&(
        <div style={{ maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center" }}>
          <div style={{ width:80,height:80,borderRadius:"50%",background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
            <CheckCircle2 size={44} color="#16A34A"/>
          </div>
          <h2 style={{ fontSize:26,fontWeight:800,marginBottom:8 }}>Sab Ho Gaya! 🎉</h2>
          <p style={{ color:"#6B7280",fontSize:15,lineHeight:1.7,marginBottom:20 }}>
            Application aur payment dono receive ho gayi.<br/><strong>4-6 ghante</strong> mein call aayega.
          </p>
          <div style={{ background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:14,padding:18,marginBottom:16 }}>
            <div style={{ fontSize:14,color:"#0F766E",lineHeight:1.8 }}>
              ✅ Application saved (Firebase)<br/>
              ✅ Rs. 350 fee received<br/>
              ⏳ Verification in progress<br/>
              📞 Call aayega 4-6 ghante mein
            </div>
          </div>
          <div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:14,marginBottom:20,fontSize:13,color:"#92400E" }}>
            ⚠️ Loan bar waqt ada karein — dubara eligible rahein!
          </div>
          <button
            onClick={()=>{
              setForm({fullName:"",cnic:"",phone:"",city:"",category:"",purpose:"",loanAmount:"",tenure:"6",easypaisa:""});
              setAgreed(false);
              setView("landing");
            }}
            style={B({ background:"#F3F4F6",color:"#374151",padding:"12px 24px",fontSize:14 })}>
            ← Wapas Home
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADMIN LOGIN
      ══════════════════════════════════════════════════════════ */}
      {view==="admin-login"&&(
        <div style={{ maxWidth:380,margin:"0 auto",padding:"120px 24px",textAlign:"center" }}>
          <div style={{ width:56,height:56,borderRadius:14,background:"#F0FDFA",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
            <Lock size={24} color="#0D9488"/>
          </div>
          <h2 style={{ fontSize:22,fontWeight:700,marginBottom:20 }}>Admin Login</h2>
          <input type="password" style={{...inp,textAlign:"center",marginBottom:12}} placeholder="Password" value={pass}
            onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&checkAdmin()}/>
          {passErr&&<div style={{ color:"#DC2626",fontSize:13,marginBottom:12 }}>{passErr}</div>}
          <button onClick={checkAdmin} style={B({ width:"100%",background:"linear-gradient(135deg,#0D9488,#0F766E)",color:"#FFF",padding:"13px",fontSize:15 })}>
            Enter Dashboard
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADMIN DASHBOARD
      ══════════════════════════════════════════════════════════ */}
      {view==="admin"&&(
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"40px 24px 100px" }}>

          {/* firebase badge */}
          <div style={{ background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:12,padding:"12px 18px",marginBottom:20,fontSize:13,color:"#0F766E",display:"flex",alignItems:"center",gap:8 }}>
            🔥 <strong>Firebase Connected</strong> — Real-time data, kisi bhi device se accessible ✅
          </div>

          {/* stat cards */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:24 }}>
            {[
              { l:"Total",    v:apps.length,                                 c:"#0D9488",bg:"#F0FDFA" },
              { l:"Pending",  v:apps.filter(a=>a.status==="Pending").length,  c:"#EA580C",bg:"#FFF7ED" },
              { l:"Approved", v:apps.filter(a=>a.status==="Approved").length, c:"#16A34A",bg:"#F0FDF4" },
              { l:"Disbursed",v:apps.filter(a=>a.status==="Disbursed").length,c:"#2563EB",bg:"#EFF6FF" },
            ].map((s,i)=>(
              <div key={i} style={{ background:s.bg,borderRadius:14,padding:18,textAlign:"center" }}>
                <div style={{ fontSize:28,fontWeight:800,color:s.c }}>{s.v}</div>
                <div style={{ fontSize:12,color:"#6B7280",marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <h2 style={{ fontSize:20,fontWeight:700 }}>Applications</h2>
            <button onClick={load} style={B({ background:"#F3F4F6",color:"#374151",padding:"8px 14px",fontSize:13,borderRadius:8 })}>
              {loading?"⏳ Loading...":"↻ Refresh"}
            </button>
          </div>

          {loading?(
            <div style={{ textAlign:"center",padding:60,color:"#9CA3AF",fontSize:15 }}>⏳ Firebase se load ho raha hai...</div>
          ):apps.length===0?(
            <div style={{ color:"#9CA3AF",padding:"60px 0",textAlign:"center",border:"2px dashed #E5E7EB",borderRadius:16 }}>Koi application nahi aayi abhi tak.</div>
          ):(
            <div style={{ background:"#FFF",border:"1px solid #F3F4F6",borderRadius:16,overflow:"hidden" }}>
              {apps.map((a,i)=>{
                const st=STATUS[a.status]||STATUS.Pending;
                return(
                  <div key={a.id} onClick={()=>setSel(a)}
                    style={{ display:"grid",gridTemplateColumns:"1.4fr .7fr .8fr .5fr .5fr 1fr auto",alignItems:"center",padding:"13px 18px",gap:10,cursor:"pointer",borderTop:i===0?"none":"1px solid #F3F4F6",fontSize:13 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ fontWeight:600 }}>{a.fullName}</div>
                    <div style={{ color:"#6B7280" }}>{a.city}</div>
                    <div style={{ fontWeight:600 }}>Rs.&nbsp;{Number(a.loanAmount).toLocaleString()}</div>
                    <div style={{ color:"#6B7280" }}>{a.tenure}mo</div>
                    <div style={{ color:a.tid?"#16A34A":"#DC2626",fontSize:11,fontWeight:600 }}>{a.tid?"TID ✓":"No TID"}</div>
                    <div><span style={{ background:st.bg,color:st.fg,fontSize:11,padding:"3px 10px",borderRadius:20,border:`1px solid ${st.bd}`,fontWeight:600 }}>{a.status}</span></div>
                    <Eye size={14} color="#D1D5DB"/>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          DETAIL MODAL
      ══════════════════════════════════════════════════════════ */}
      {sel&&view==="admin"&&(
        <div onClick={()=>setSel(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:50 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#FFF",borderRadius:20,padding:28,maxWidth:520,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#0D9488,#14B8A6)",color:"#FFF",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18 }}>{sel.fullName?.[0]}</div>
                <div>
                  <div style={{ fontSize:18,fontWeight:700 }}>{sel.fullName}</div>
                  <div style={{ color:"#9CA3AF",fontSize:12 }}>{sel.cnic}</div>
                </div>
              </div>
              <X size={20} color="#9CA3AF" style={{ cursor:"pointer" }} onClick={()=>setSel(null)}/>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,fontSize:14,marginBottom:16,background:"#FAFDFB",borderRadius:14,padding:20 }}>
              {[
                ["📞 Phone",sel.phone],
                ["📍 City",sel.city],
                ["💰 Amount","Rs. "+Number(sel.loanAmount).toLocaleString()],
                ["📅 Tenure",sel.tenure+" months"],
                ["📱 Easypaisa",sel.easypaisa],
                ["📝 Purpose",sel.purpose],
                ["👤 Category",sel.category],
                ["🕐 Date",new Date(sel.submittedAt).toLocaleDateString()],
              ].map(([k,v])=>(
                <div key={k}><div style={{ color:"#9CA3AF",fontSize:11,marginBottom:3 }}>{k}</div><div style={{ fontWeight:600 }}>{v}</div></div>
              ))}
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
              <div style={{ background:sel.tid?"#F0FDF4":"#FEF2F2",border:`1px solid ${sel.tid?"#BBF7D0":"#FCA5A5"}`,borderRadius:12,padding:14,textAlign:"center" }}>
                <div style={{ fontSize:11,color:"#6B7280",marginBottom:4 }}>TRANSACTION ID</div>
                <div style={{ fontSize:16,fontWeight:800,color:sel.tid?"#16A34A":"#DC2626" }}>{sel.tid||"Not Paid"}</div>
              </div>
              <div style={{ background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:14,textAlign:"center" }}>
                <div style={{ fontSize:11,color:"#6B7280",marginBottom:4 }}>TERMS AGREED</div>
                <div style={{ fontSize:16,fontWeight:800,color:"#16A34A" }}>✅ Yes</div>
              </div>
            </div>

            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>updateStatus(sel.id,"Approved")}  style={B({ flex:1,background:"#16A34A",color:"#FFF",padding:"11px",display:"flex",alignItems:"center",justifyContent:"center",gap:6 })}><CheckCircle2 size={16}/> Approve</button>
              <button onClick={()=>updateStatus(sel.id,"Disbursed")} style={B({ flex:1,background:"#2563EB",color:"#FFF",padding:"11px" })}>💸 Disbursed</button>
              <button onClick={()=>updateStatus(sel.id,"Rejected")}  style={B({ flex:1,background:"#DC2626",color:"#FFF",padding:"11px",display:"flex",alignItems:"center",justifyContent:"center",gap:6 })}><XCircle size={16}/> Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
