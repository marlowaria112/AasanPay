```javascript
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  initializeFirestore, collection, setDoc,
  getDocs, getDoc, doc, updateDoc, query, orderBy
} from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  Wallet, Users, Clock, ArrowRight, CheckCircle2, XCircle,
  LogOut, Eye, X, Lock, User, Phone, MapPin, Landmark,
  CreditCard, Calendar, Star, TrendingUp, ChevronDown,
  Shield, Heart, FileText, Search,
  AlertTriangle, Scale, RefreshCw, Mail, Copy, Check,
  BadgeCheck, Award, ThumbsUp, Building2
} from "lucide-react";

const firebaseConfig = {
  apiKey: "AIzaSyBGIr-D9LUy6H3Lu8HPFx2Yw7v0-YaLr6g",
  authDomain: "aasanpay-v2.firebaseapp.com",
  projectId: "aasanpay-v2",
  storageBucket: "aasanpay-v2.firebasestorage.app",
  messagingSenderId: "535933204500",
  appId: "1:535933204500:web:3e9b0a8d840b9de9d4cf01",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = initializeFirestore(firebaseApp, {
  experimentalAutoDetectLongPolling: true,
});
const auth = getAuth(firebaseApp);

const FONT = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');";

const MOBILE_CSS = "*{box-sizing:border-box;margin:0}input:focus,select:focus{border-color:#0D9488!important;outline:none}html,body{overflow-x:hidden;width:100%}img,svg{max-width:100%}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}@media (max-width:640px){.ap-nav{padding:10px 14px!important}.ap-nav-brand{font-size:17px!important;gap:6px!important}.ap-nav-logo{width:30px!important;height:30px!important}.ap-nav-badge{display:none!important}.ap-nav-track-text{display:none!important}.ap-nav-track-btn{padding:8px 10px!important}.ap-hero{padding:36px 16px 32px!important}.ap-hero-badge{font-size:11px!important;padding:6px 12px!important}.ap-hero-sub{font-size:14px!important}.ap-hero-chips{gap:6px!important}.ap-hero-chip{font-size:11px!important;padding:6px 12px!important}.ap-hero-buttons{flex-direction:column!important;width:100%!important}.ap-hero-buttons button{width:100%!important;justify-content:center!important}.ap-section{padding:0 14px!important}.ap-card{padding:20px!important}.ap-stats-bar{grid-template-columns:repeat(2,1fr)!important}.ap-stats-bar>div{border-right:none!important;border-bottom:1px solid #F1F5F9;padding:14px 4px!important}.ap-cta-grid{grid-template-columns:1fr!important}.ap-cta-stats{grid-template-columns:repeat(3,1fr)!important;gap:8px!important}.ap-appid{font-size:22px!important;letter-spacing:1px!important;word-break:break-all}.ap-admin-table-row{grid-template-columns:1fr 1fr!important;row-gap:6px!important;font-size:12px!important}.ap-admin-table-row>*:nth-child(n+5){display:none!important}.ap-admin-header{display:none!important}.ap-modal{padding:18px!important;max-width:94vw!important}.ap-modal-grid{grid-template-columns:1fr!important}.ap-modal-actions{flex-direction:column!important}.ap-status-input-row{flex-direction:column!important}.ap-status-input-row button{width:100%!important}.ap-payment-grid{grid-template-columns:1fr!important}}";

const STATUS = {
  Pending:   { bg:"#FFF7ED", fg:"#EA580C", bd:"#FDBA74", label:"Under Review" },
  Approved:  { bg:"#F0FDF4", fg:"#16A34A", bd:"#86EFAC", label:"Approved" },
  Rejected:  { bg:"#FEF2F2", fg:"#DC2626", bd:"#FCA5A5", label:"Not Approved" },
  Disbursed: { bg:"#EFF6FF", fg:"#2563EB", bd:"#93C5FD", label:"Disbursed" },
};

const FEED = [
  { name:"Ayesha R.",  city:"Lahore",     amount:"25,000", ago:"45 min" },
  { name:"Bilal A.",   city:"Islamabad",  amount:"30,000", ago:"36 min" },
  { name:"Sana R.",    city:"Karachi",    amount:"15,000", ago:"22 min" },
  { name:"Hamza K.",   city:"Rawalpindi", amount:"20,000", ago:"31 min" },
  { name:"Fatima N.",  city:"Multan",     amount:"10,000", ago:"38 min" },
  { name:"Ahmed S.",   city:"Peshawar",   amount:"35,000", ago:"45 min" },
  { name:"Zainab F.",  city:"Sialkot",    amount:"12,000", ago:"52 min" },
  { name:"Kamran H.",  city:"Gujranwala", amount:"18,000", ago:"5 hr" },
  { name:"Hira N.",    city:"Hyderabad",  amount:"22,000", ago:"7 hr" },
  { name:"Farhan J.",  city:"Quetta",     amount:"28,000", ago:"10 hr" },
  { name:"Maryam W.",  city:"Sukkur",     amount:"16,000", ago:"8 hr" },
  { name:"Usman T.",   city:"Faisalabad", amount:"32,000", ago:"3 hr" },
];

const ALL_REVIEWS = [
  { name:"Ayesha Raza",     city:"Lahore",      amount:"25,000", stars:5, tag:"Student",       date:"Jul 2026",   text:"Alhamdulillah, meri university fees ka masla hal ho gaya. Process itna simple tha ke mujhe believe nahi hua. Koi interest nahi, koi hidden charges nahi. Seedha account mein paisa aa gaya Thanks A lot team Aasanpay." },
  { name:"Muhammad Bilal",  city:"Islamabad",   amount:"30,000", stars:5, tag:"Business",      date:"Jun 2026",   text:"Main ne apni dukan ke liye capital chahiye tha. AasanPay ne 5 ghante mein approve kar diya. shukar hai Allah ka ke aisa platform hai Pakistan mein." },
  { name:"Sana Nawaz",      city:"Karachi",     amount:"15,000", stars:5, tag:"Homemaker",     date:"May 2026",   text:"Ghar ke emergency kharche the, kisi se maangna achha nahi lagta. Yahan se liya, waqt pe wapas kar diya. Ab dubara apply kiya hai aur immediately approve hua." },
  { name:"Farhan Sheikh",   city:"Peshawar",    amount:"20,000", stars:4, tag:"Freelancer",    date:"Apr 2026",   text:"Mera client ka payment delay ho gaya tha. AasanPay ne bridge financing ka kaam kiya. Quick, professional aur most importantly halaal." },
  { name:"Hira Mahmood",    city:"Faisalabad",  amount:"10,000", stars:5, tag:"Teacher",       date:"March 2026", text:"Pehle dar lag raha tha ke online loan safe hoga ya nahi. Lekin process itna transparent tha ke sab shak door ho gaye. Ek baar liya, waqt pe diya, ab trusted platform hai mera." },
  { name:"Kamran Ali",      city:"Gujranwala",  amount:"35,000", stars:5, tag:"Shopkeeper",    date:"Feb 2026",   text:"Ramzan se pehle stock lena tha, capital nahi tha. AasanPay se 35,000 liya, maal becha, wapas kar diya. Business smooth raha. Shukriya!" },
  { name:"Zainab Fatima",   city:"Multan",      amount:"18,000", stars:5, tag:"Student",       date:"Jan 2026",   text:"Exam fees + hostel dues ek saath aa gaye. Parents ko batana nahi chahti thi. AasanPay ne meri madad ki. Interest zero, process clear. Highly recommended." },
  { name:"Usman Tariq",     city:"Rawalpindi",  amount:"28,000", stars:4, tag:"Self Employed",  date:"Dec 2025",   text:"Verification thodi time leti hai lekin worth it hai. Paisa seedha Easypaisa mein aaya. Koi chakkar nahi, koi fareb nahi. Genuine platform hai." },
  { name:"Maryam Siddiqui", city:"Hyderabad",   amount:"12,000", stars:5, tag:"Working Woman",  date:"Nov 2025",   text:"Pehle socha ke itna mushkil hoga. Lekin form bhar ke submit kiya, thodi der mein call aayi, aur paisa mil gaya. Allah aaise platforms ko aur zyada kamyab kare." },
  { name:"Imran Hussain",   city:"Quetta",      amount:"22,000", stars:5, tag:"Student",       date:"Oct 2025",   text:"MBBS ki fees ke liye apply kiya. Sochta tha shayad reject ho jaye. Lekin approve ho gaya. Ab final year complete kar raha hoon. AasanPay ka bohot shukriya." },
  { name:"Nadia Khan",      city:"Sialkot",     amount:"16,000", stars:4, tag:"Entrepreneur",   date:"Oct 2025",   text:"Online boutique ke liye fabric lena tha. AasanPay ne support kiya. Halaal business ke liye halaal financing. Perfect combination." },
  { name:"Adnan Malik",     city:"Lahore",      amount:"30,000", stars:5, tag:"Business",      date:"Sep 2025",   text:"3 baar le chuka hoon AasanPay se. Har baar same experience, professional aur fast. Jo kehte hain woh karte hain. Trust hai poora." },
  { name:"Saima Bibi",      city:"Karachi",     amount:"8,000",  stars:5, tag:"Homemaker",     date:"Sep 2025",   text:"Bachon ki school fees ke liye liya. Chota amount tha lekin koi discrimination nahi ki. Same service mili. Bahut achha lagta hai yahan." },
  { name:"Tariq Mehmood",   city:"Islamabad",   amount:"25,000", stars:4, tag:"Govt Employee",  date:"Aug 2025",   text:"Medical emergency mein tha. Bank ka time nahi tha. AasanPay ne 4 ghante mein help ki. Zindagi mein yaad rahega yeh ehsaan." },
  { name:"Faiza Akhtar",    city:"Peshawar",    amount:"20,000", stars:5, tag:"Student",       date:"Aug 2024",   text:"Scholarship late tha, semester fee urgent thi. AasanPay ne bridge kar diya. Ab scholarship aa gayi, amount wapas kar diya. Bohot grateful hoon." },
];

const EASYPAISA_NUMBER = "03433403727";
const ACCOUNT_TITLE = "Waseem";
const PAYMENT_METHOD = "Easypaisa";

function generateAppId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return "AP-" + year + "-" + rand;
}

function CountUp({ target, suffix }) {
  suffix = suffix || "";
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let v = 0;
    const inc = target / 125;
    const t = setInterval(() => {
      v += inc;
      if (v >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return React.createElement("span", null, n.toLocaleString() + suffix);
}

function Ticker() {
  const [i, setI] = React.useState(0);
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => { setI(function(x) { return (x + 1) % FEED.length; }); setShow(true); }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  const p = FEED[i];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-5px)", transition: "all .4s ease" }}>
      <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", flexShrink: 0, animation: "pulse 2s infinite" }} />
        <div style={{ flex: 1, fontSize: 13, color: "#374151" }}>
          <strong>{p.name}</strong> ({p.city}) — Rs. {p.amount} approved
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{p.ago} ago</div>
      </div>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div style={{ background: "#FFF", borderRadius: 16, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: r.stars }).map(function(_, j) { return React.createElement(Star, { key: j, size: 14, color: "#F59E0B", fill: "#F59E0B" }); })}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 600, border: "1px solid #BBF7D0" }}>{r.tag}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{r.date}</span>
        </div>
      </div>
      <p style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{r.text}"</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0D9488,#14B8A6)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{r.name[0]}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.city}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Amount</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488" }}>Rs. {r.amount}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", marginBottom: 6, fontWeight: 500 }}>
        <Icon size={14} color="#0D9488" /> {label}
      </span>
      {children}
    </label>
  );
}

const inp = { width: "100%", background: "#FFF", border: "2px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", color: "#111827", fontSize: 15, fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color .2s" };
const B = function(x) { x = x || {}; return Object.assign({ border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }, x); };

export default function AasanPay() {
  const [view, setView] = useState("landing");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [sel, setSel] = useState(null);
  const [slider, setSlider] = useState(15000);
  const [tenure, setTenure] = useState(12);
  const [tid, setTid] = useState("");
  const [copied, setCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastDocId, setLastDocId] = useState(null);
  const [appId, setAppId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [form, setForm] = useState({
    fullName: "", cnic: "", phone: "", city: "", category: "",
    purpose: "", loanAmount: "", tenure: "12", easypaisa: ""
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, function(user) {
      setAuthUser(user);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
      const snap = await getDocs(q);
      setApps(snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); }));
    } catch (err) { console.error(err); setApps([]); }
    setLoading(false);
  }

  useEffect(() => { if (view === "admin" && authUser) load(); }, [view, authUser]);

  async function submit(e) {
    e.preventDefault();
    if (!agreed) { alert("Terms & Conditions accept karein!"); return; }
    setSubmitting(true);
    const newAppId = generateAppId();
    try {
      const writePromise = setDoc(doc(db, "applications", newAppId), Object.assign({}, form, {
        applicationId: newAppId,
        status: "Pending",
        tid: "",
        agreedToTerms: true,
        submittedAt: Date.now()
      }));
      const timeoutPromise = new Promise(function(_, reject) {
        return setTimeout(function() { reject(new Error("TIMEOUT: Network issue. Please try again.")); }, 15000);
      });
      await Promise.race([writePromise, timeoutPromise]);
      setLastDocId(newAppId);
      setAppId(newAppId);
      setView("payment");
    } catch (err) {
      alert("Submit error: " + err.message);
      console.error("SUBMIT FAILED:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmPayment() {
    if (!tid.trim()) { alert("Transaction ID likhein!"); return; }
    if (!screenshot) { alert("Payment screenshot upload karein!"); return; }
    try {
      if (lastDocId) await updateDoc(doc(db, "applications", lastDocId), { tid: tid });
      setView("done");
      setTid("");
    } catch (err) { alert("TID error: " + err.message); }
  }

  async function checkStatus() {
    if (!statusId.trim()) { setStatusError("Application ID daalen"); return; }
    setStatusLoading(true);
    setStatusError("");
    setStatusResult(null);
    try {
      const code = statusId.trim().toUpperCase();
      const snap = await getDoc(doc(db, "applications", code));
      if (!snap.exists()) { setStatusError("Koi application nahi mili is ID se. Dobara check karein."); }
      else { setStatusResult(Object.assign({ id: snap.id }, snap.data())); }
    } catch (err) { setStatusError("Error: " + err.message); }
    setStatusLoading(false);
  }

  async function updateStatus(id, status) {
    try {
      await updateDoc(doc(db, "applications", id), { status: status });
      setApps(function(prev) { return prev.map(function(a) { return a.id === id ? Object.assign({}, a, { status: status }) : a; }); });
      setSel(function(prev) { return prev ? Object.assign({}, prev, { status: status }) : null; });
    } catch (err) { alert("Update error: " + err.message); }
  }

  async function checkAdmin() {
    if (!adminEmail.trim() || !adminPass.trim()) { setPassErr("Email aur password likhein."); return; }
    setPassErr(""); setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPass);
      setAdminPass(""); setView("admin");
    } catch (err) { setPassErr("Ghalat email ya password."); }
    setLoginLoading(false);
  }

  async function logoutAdmin() {
    try { await signOut(auth); } catch (err) {}
    setView("landing"); setAdminEmail(""); setAdminPass("");
  }

  function copyNum() {
    navigator.clipboard.writeText(EASYPAISA_NUMBER.replace(/-/g, ""));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function copyAppId() {
    navigator.clipboard.writeText(appId);
    setIdCopied(true); setTimeout(() => setIdCopied(false), 2000);
  }

  const monthly = Math.round(slider / tenure);
  const visibleReviews = showAllReviews ? ALL_REVIEWS : ALL_REVIEWS.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#111827", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{FONT + MOBILE_CSS}</style>

      <nav className="ap-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 32px", background: "#FFF", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 3px rgba(0,0,0,.06)", flexWrap: "nowrap", gap: 8 }}>
        <div className="ap-nav-brand" onClick={() => setView("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
          <div className="ap-nav-logo" style={{ background: "linear-gradient(135deg,#0D9488,#0F766E)", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(13,148,136,.3)", flexShrink: 0 }}>
            <Wallet size={20} color="#FFF" />
          </div>
          <span>Aasan<span style={{ color: "#0D9488" }}>Pay</span></span>
          <span className="ap-nav-badge" style={{ background: "#ECFDF5", color: "#059669", fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, border: "1px solid #A7F3D0", letterSpacing: .3 }}>HALAAL</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
          <button className="ap-nav-track-btn" onClick={() => setView("status")} style={B({ background: "#F0FDF4", color: "#0D9488", padding: "8px 16px", fontSize: 13, border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" })}>
            <Search size={13} /> <span className="ap-nav-track-text">Track Application</span>
          </button>
          <button onClick={() => setView("terms")} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Terms</button>
          {view !== "admin" && <button onClick={() => setView("admin-login")} style={{ background: "none", border: "none", color: "#E2E8F0", fontSize: 11, cursor: "pointer" }}><Lock size={11} /></button>}
          {view === "admin" && <button onClick={logoutAdmin} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><LogOut size={12} /> Exit</button>}
        </div>
      </nav>

      {view === "landing" && <>
        <section className="ap-hero" style={{ background: "linear-gradient(135deg,#F0FDFA 0%,#ECFDF5 50%,#F8FAFC 100%)", padding: "56px 24px 52px", textAlign: "center", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ marginBottom: 20 }}><Ticker /></div>
          <div className="ap-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF", border: "1px solid #A7F3D0", borderRadius: 24, padding: "8px 20px", fontSize: 13, color: "#065F46", fontWeight: 600, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <BadgeCheck size={15} color="#059669" /> Pakistan ka #1 Halaal Micro-Finance Platform
          </div>
          <h1 style={{ fontSize: "clamp(28px,7vw,52px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: -1.5, color: "#0F172A" }}>
            Interest-Free Financing<br />
            <span style={{ background: "linear-gradient(135deg,#0D9488,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>for Every Pakistani</span>
          </h1>
          <p className="ap-hero-sub" style={{ fontSize: 16, color: "#475569", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.75 }}>
            Qarz-e-hasna up to <strong style={{ color: "#0D9488" }}>Rs. 35,000</strong> — zero interest, zero hidden charges. Verified, trusted and Shariah-compliant.
          </p>
          <div className="ap-hero-chips" style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {[{ icon: "✓", text: "Zero Interest" }, { icon: "✓", text: "No Hidden Fees" }, { icon: "✓", text: "Shariah Compliant" }, { icon: "✓", text: "4-6 Hour Approval" }].map(function(b, i) {
              return (
                <span key={i} className="ap-hero-chip" style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 20, padding: "7px 16px", fontSize: 12.5, color: "#374151", fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>{b.icon}</span> {b.text}
                </span>
              );
            })}
          </div>
          <div className="ap-hero-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setView("apply")} style={B({ background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "16px 36px", fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(13,148,136,.35)", borderRadius: 12 })}>
              Apply Now — Free <ArrowRight size={18} />
            </button>
            <button onClick={() => setView("status")} style={B({ background: "#FFF", color: "#0D9488", padding: "16px 28px", fontSize: 15, border: "2px solid #0D9488", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 })}>
              <Search size={16} /> Track Application
            </button>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#94A3B8" }}>No guarantor required · Rs. 5,000 to Rs. 35,000 · Students & Women priority</div>
        </section>

        <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0" }}>
          <div className="ap-stats-bar" style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 0 }}>
            {[
              { icon: Users,  value: React.createElement(CountUp, { target: 1500, suffix: "+" }), label: "Verified Borrowers", sub: "Since 2023",       color: "#0D9488" },
              { icon: Shield, value: "100%",                                                       label: "Shariah Compliant",  sub: "Certified Halaal", color: "#059669" },
              { icon: Clock,  value: "4-6 hrs",                                                    label: "Average Approval",   sub: "Business hours",   color: "#2563EB" },
              { icon: Award,  value: "4.8/5",                                                      label: "Customer Rating",    sub: "1,200+ reviews",   color: "#D97706" },
              { icon: Heart,  value: "Rs. 0",                                                      label: "Interest Charged",   sub: "Ever. Always.",    color: "#DC2626" },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 4 ? "1px solid #F1F5F9" : "none", minWidth: 0 }}>
                  <s.icon size={20} color={s.color} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{s.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 640, margin: "44px auto 0", padding: "0 24px" }}>
          <div className="ap-card" style={{ background: "#FFF", borderRadius: 20, padding: 32, border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#0D9488,#14B8A6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TrendingUp size={18} color="#FFF" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Loan Calculator</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>See exactly what you will pay back</div>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>Loan Amount</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#0D9488" }}>Rs. {slider.toLocaleString()}</span>
              </div>
              <input type="range" min={5000} max={35000} step={1000} value={slider} onChange={function(e) { setSlider(+e.target.value); }} style={{ width: "100%", accentColor: "#0D9488", marginBottom: 6, height: 6 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginBottom: 20 }}>
                <span>Rs. 5,000</span><span>Rs. 35,000</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 8 }}>Repayment Tenure</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
                {[3, 6, 12].map(function(m) {
                  return (
                    <button key={m} onClick={() => setTenure(m)} style={B({ padding: "10px 4px", fontSize: 13, fontWeight: tenure === m ? 700 : 500, background: tenure === m ? "linear-gradient(135deg,#0D9488,#0F766E)" : "#F8FAFC", color: tenure === m ? "#FFF" : "#374151", border: tenure === m ? "none" : "1px solid #E2E8F0", borderRadius: 10 })}>
                      {m} Months
                    </button>
                  );
                })}
              </div>
              <div style={{ background: "linear-gradient(135deg,#F0FDFA,#ECFDF5)", border: "1px solid #A7F3D0", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontWeight: 500 }}>MONTHLY</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0D9488", wordBreak: "break-word" }}>Rs. {monthly.toLocaleString()}</div>
                  </div>
                  <div style={{ borderLeft: "1px solid #A7F3D0", borderRight: "1px solid #A7F3D0", minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontWeight: 500 }}>TOTAL PAYBACK</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0D9488", wordBreak: "break-word" }}>Rs. {slider.toLocaleString()}</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontWeight: 500 }}>INTEREST</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#059669" }}>Rs. 0</div>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#065F46", fontWeight: 500 }}>
                  You borrow Rs. {slider.toLocaleString()} — you pay back exactly Rs. {slider.toLocaleString()}
                </div>
              </div>
            </div>
            <button onClick={() => setView("apply")} style={B({ width: "100%", background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "14px", fontSize: 15, marginTop: 20, borderRadius: 12, boxShadow: "0 4px 15px rgba(13,148,136,.3)" })}>
              Apply for Rs. {slider.toLocaleString()} Now
            </button>
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 900, margin: "44px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0D9488", marginBottom: 6, letterSpacing: .5 }}>WHO WE SERVE</div>
            <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: "#0F172A" }}>Built for those who need it most</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { icon: Award,     title: "Students",       desc: "Tuition, books, hostel — zero-interest education financing.",        color: "#0D9488", bg: "#F0FDFA", bd: "#A7F3D0" },
              { icon: Users,     title: "Homemakers",     desc: "Household expenses, children's needs — dignified financial support.", color: "#7C3AED", bg: "#FAF5FF", bd: "#DDD6FE" },
              { icon: Building2, title: "Small Business", desc: "Stock, equipment, working capital — grow your business halaal.",      color: "#EA580C", bg: "#FFF7ED", bd: "#FDBA74" },
              { icon: ThumbsUp,  title: "Professionals",  desc: "Bridge financing, emergency needs — for working Pakistanis.",         color: "#2563EB", bg: "#EFF6FF", bd: "#BFDBFE" },
            ].map(function(c, i) {
              return (
                <div key={i} className="ap-card" style={{ background: c.bg, borderRadius: 16, padding: 22, border: "1px solid " + c.bd }}>
                  <div style={{ width: 40, height: 40, background: "#FFF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                    <c.icon size={20} color={c.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 900, margin: "44px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0D9488", marginBottom: 6, letterSpacing: .5 }}>PROCESS</div>
            <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: "#0F172A" }}>Simple. Fast. Transparent.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { s: "01", icon: CreditCard, t: "Apply Online",    d: "Fill the form in 2 minutes. Basic details only.",            color: "#0D9488" },
              { s: "02", icon: Shield,     t: "Pay Rs. 350 Fee", d: "One-time verification fee. Transparent & non-refundable.",    color: "#7C3AED" },
              { s: "03", icon: Clock,      t: "Get Reviewed",    d: "Our team verifies within 4-6 business hours.",                color: "#EA580C" },
              { s: "04", icon: Wallet,     t: "Receive Funds",   d: "Approved amount transferred directly to your account.",       color: "#2563EB" },
            ].map(function(x, i) {
              return (
                <div key={i} className="ap-card" style={{ background: "#FFF", borderRadius: 16, padding: 22, border: "1px solid #E2E8F0", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,.03)" }}>
                  <div style={{ position: "absolute", top: 16, right: 16, fontSize: 28, fontWeight: 900, color: "#F1F5F9" }}>{x.s}</div>
                  <div style={{ width: 42, height: 42, background: "#F0FDFA", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <x.icon size={20} color={x.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 6 }}>{x.t}</div>
                  <div style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6 }}>{x.d}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 680, margin: "44px auto 0", padding: "0 24px" }}>
          <div className="ap-card" style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, background: "#FFFBEB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={22} color="#D97706" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 8 }}>Why is there a Rs. 350 fee?</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8 }}>
                  This one-time processing fee covers:<br />
                  <span style={{ color: "#0D9488", fontWeight: 500 }}>• CNIC Verification</span> — Identity authentication<br />
                  <span style={{ color: "#0D9488", fontWeight: 500 }}>• Background Check</span> — Fraud prevention<br />
                  <span style={{ color: "#0D9488", fontWeight: 500 }}>• Documentation</span> — Your loan agreement<br />
                  <span style={{ color: "#0D9488", fontWeight: 500 }}>• Support Setup</span> — SMS & call updates<br /><br />
                  <span style={{ color: "#DC2626", fontWeight: 600 }}>This fee is non-refundable.</span> Your loan carries <strong>zero interest</strong> — we only charge this verification fee, nothing else.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 1000, margin: "44px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0D9488", marginBottom: 6, letterSpacing: .5 }}>CUSTOMER REVIEWS</div>
            <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: "#0F172A" }}>What our borrowers say</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map(function(_, j) { return React.createElement(Star, { key: j, size: 16, color: "#F59E0B", fill: "#F59E0B" }); })}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>4.8 out of 5</span>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>based on 1,200+ reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {visibleReviews.map(function(r, i) { return React.createElement(ReviewCard, { key: i, r: r }); })}
          </div>
          {!showAllReviews && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => setShowAllReviews(true)} style={B({ background: "#FFF", color: "#0D9488", padding: "12px 28px", fontSize: 14, border: "2px solid #0D9488", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 10 })}>
                <ChevronDown size={16} /> See All {ALL_REVIEWS.length} Reviews
              </button>
            </div>
          )}
        </div>

        <div className="ap-section" style={{ maxWidth: 720, margin: "44px auto 0", padding: "0 24px" }}>
          <div className="ap-card" style={{ background: "linear-gradient(135deg,#0D9488,#065F46)", borderRadius: 20, padding: "36px 32px", color: "#FFF" }}>
            <div className="ap-cta-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#6EE7B7", marginBottom: 6, letterSpacing: .5 }}>HALAAL FINANCING</div>
                <h3 style={{ fontSize: "clamp(20px,5vw,24px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Ready to get started?</h3>
                <p style={{ fontSize: 14, opacity: .85, lineHeight: 1.6, marginBottom: 20 }}>
                  Join 1,500+ Pakistanis who have already benefited from interest-free financing. Apply in 2 minutes.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={() => setView("apply")} style={B({ background: "#FFF", color: "#0D9488", padding: "13px 28px", fontSize: 14, borderRadius: 10, fontWeight: 700 })}>Apply Now — Free</button>
                  <button onClick={() => setView("status")} style={B({ background: "rgba(255,255,255,.15)", color: "#FFF", padding: "13px 24px", fontSize: 14, border: "1px solid rgba(255,255,255,.3)", borderRadius: 10 })}>Track Application</button>
                </div>
              </div>
              <div className="ap-cta-stats" style={{ textAlign: "center", display: "grid", gap: 12 }}>
                {[{ v: "1,500+", l: "Borrowers" }, { v: "Rs. 0", l: "Interest" }, { v: "4.8★", l: "Rating" }].map(function(s, i) {
                  return (
                    <div key={i} style={{ background: "rgba(255,255,255,.1)", borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{s.v}</div>
                      <div style={{ fontSize: 11, opacity: .8 }}>{s.l}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="ap-section" style={{ maxWidth: 640, margin: "44px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: "clamp(20px,5vw,24px)", fontWeight: 800, color: "#0F172A" }}>Frequently Asked Questions</h2>
          </div>
          {[
            { q: "Is this really interest-free?",           a: "Yes. This is qarz-e-hasna — you borrow X, you repay exactly X. No interest, ever." },
            { q: "Why is there a Rs. 350 fee?",             a: "It covers CNIC verification, background check, documentation and support setup. The loan itself has no charges." },
            { q: "How long does approval take?",            a: "4-6 business hours. You will receive a call from our team." },
            { q: "Can I apply more than once?",             a: "Yes! Repay your first loan on time and you become eligible for a higher amount." },
            { q: "How do I track my application?",          a: "Use the Track Application button. Enter your Application ID received after submission." },
            { q: "What happens if I cannot repay on time?", a: "Contact us immediately. Deliberate non-payment may result in legal proceedings under Pakistani law." },
          ].map(function(f, i) {
            return (
              <div key={i} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,.03)" }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", marginBottom: 4 }}>{f.q}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.a}</div>
              </div>
            );
          })}
        </div>

        <footer style={{ borderTop: "1px solid #E2E8F0", padding: "32px 24px", textAlign: "center", marginTop: 44, background: "#FFF" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ background: "linear-gradient(135deg,#0D9488,#0F766E)", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={14} color="#FFF" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Aasan<span style={{ color: "#0D9488" }}>Pay</span></span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
            <button onClick={() => setView("terms")} style={{ background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer" }}>Terms & Conditions</button>
            <button onClick={() => setView("status")} style={{ background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer" }}>Track Application</button>
          </div>
          <div style={{ color: "#9CA3AF", fontSize: 12 }}>2025 AasanPay. Pakistan's Halaal Micro-Finance Platform.</div>
        </footer>
      </>}

      {view === "status" && (
        <div className="ap-section" style={{ maxWidth: 560, margin: "0 auto", padding: "50px 24px 100px" }}>
          <button onClick={() => setView("landing")} style={B({ background: "#F1F5F9", color: "#374151", padding: "8px 16px", fontSize: 13, marginBottom: 28, display: "flex", alignItems: "center", gap: 6 })}>Back</button>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "#F0FDFA", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", border: "1px solid #A7F3D0" }}>
              <Search size={26} color="#0D9488" />
            </div>
            <h2 style={{ fontSize: "clamp(22px,5vw,26px)", fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>Track Your Application</h2>
            <p style={{ color: "#64748B", fontSize: 14 }}>Enter your Application ID to check real-time status</p>
          </div>
          <div className="ap-card" style={{ background: "#FFF", borderRadius: 18, padding: 28, border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Application ID</div>
              <div className="ap-status-input-row" style={{ display: "flex", gap: 10 }}>
                <input value={statusId} onChange={function(e) { setStatusId(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") checkStatus(); }} style={Object.assign({}, inp, { flex: 1, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, minWidth: 0 })} placeholder="AP-2025-XXXX" />
                <button onClick={checkStatus} disabled={statusLoading} style={B({ background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "13px 20px", fontSize: 14, borderRadius: 10, opacity: statusLoading ? 0.7 : 1, flexShrink: 0 })}>
                  {statusLoading ? "..." : "Check"}
                </button>
              </div>
            </div>
            {statusError && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#DC2626" }}>{statusError}</div>
            )}
            {statusResult && (function() {
              const st = STATUS[statusResult.status] || STATUS.Pending;
              return (
                <div style={{ marginTop: 8 }}>
                  <div style={{ background: st.bg, border: "1px solid " + st.bd, borderRadius: 14, padding: 20, marginBottom: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 6, letterSpacing: .5 }}>APPLICATION STATUS</div>
                    <div style={{ fontSize: "clamp(20px,5vw,26px)", fontWeight: 800, color: st.fg, marginBottom: 4 }}>{st.label}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", wordBreak: "break-all" }}>ID: {statusResult.applicationId}</div>
                  </div>
                  <div className="ap-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      ["Applicant",  statusResult.fullName],
                      ["City",       statusResult.city],
                      ["Amount",     "Rs. " + Number(statusResult.loanAmount).toLocaleString()],
                      ["Tenure",     statusResult.tenure + " months"],
                      ["Purpose",    statusResult.purpose],
                      ["Applied On", new Date(statusResult.submittedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })],
                    ].map(function(kv) {
                      return (
                        <div key={kv[0]} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", minWidth: 0 }}>
                          <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, marginBottom: 3 }}>{kv[0].toUpperCase()}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", wordBreak: "break-word" }}>{kv[1]}</div>
                        </div>
                      );
                    })}
                  </div>
                  {statusResult.status === "Pending" && <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#92400E" }}>Your application is under review. Our team will contact you within 4-6 hours.</div>}
                  {statusResult.status === "Approved" && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#166534" }}>Congratulations! Your application is approved. Our team will contact you for disbursement.</div>}
                  {statusResult.status === "Disbursed" && <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#1E40AF" }}>Funds have been transferred to your account. Please repay on time to stay eligible.</div>}
                  {statusResult.status === "Rejected" && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#991B1B" }}>Unfortunately your application was not approved this time. You may reapply after 30 days.</div>}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {view === "terms" && (
        <div className="ap-section" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 100px" }}>
          <button onClick={() => setView("landing")} style={B({ background: "#F1F5F9", color: "#374151", padding: "8px 16px", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 })}>Back</button>
          <div className="ap-card" style={{ background: "#FFF", borderRadius: 20, padding: "32px 28px", border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid #A7F3D0" }}>
                <Scale size={28} color="#0D9488" />
              </div>
              <h1 style={{ fontSize: "clamp(20px,5vw,24px)", fontWeight: 800, marginBottom: 4, color: "#0F172A" }}>Terms and Conditions</h1>
              <p style={{ color: "#9CA3AF", fontSize: 13 }}>AasanPay Qarz-e-Hasna Agreement — January 2025</p>
            </div>
            {[
              { icon: FileText,      title: "1. Qarz-e-Hasna (Interest-Free Loan)", points: ["Shariah-compliant financing — no interest charged.", "Loan range: Rs. 5,000 to Rs. 35,000.", "You repay exactly what you borrow — nothing more.", "Certified halaal model."] },
              { icon: CreditCard,    title: "2. Processing Fee (Rs. 350)",           points: ["One-time non-refundable verification fee.", "Covers CNIC verification, background check, documentation.", "Separate from loan amount.", "Paid before disbursement."] },
              { icon: Calendar,      title: "3. Repayment",                          points: ["Tenure options: 3, 6 or 12 months.", "Monthly installments must be paid on time.", "On-time repayment qualifies you for future loans."] },
              { icon: AlertTriangle, title: "4. Default Policy",                     points: ["Reminder call/SMS will be sent first.", "Formal legal notice if no response.", "Legal proceedings may be initiated under Pakistani law.", "CNIC flagged in our system — future applications blocked."] },
              { icon: RefreshCw,     title: "5. Re-eligibility",                     points: ["Full on-time repayment = eligible for higher amount.", "Multiple late payments = account suspension.", "Default = permanently blacklisted."] },
              { icon: Shield,        title: "6. Data & Privacy",                     points: ["Your data is encrypted and secure.", "Never shared with third parties.", "Used solely for loan processing."] },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #A7F3D0", flexShrink: 0 }}>
                      <s.icon size={15} color="#0D9488" />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{s.title}</h3>
                  </div>
                  <div style={{ paddingLeft: 42 }}>
                    {s.points.map(function(p, j) {
                      return (
                        <div key={j} style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8, display: "flex", gap: 8, alignItems: "start" }}>
                          <span style={{ color: "#0D9488", marginTop: 2, flexShrink: 0 }}>—</span> {p}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "18px 20px", marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={17} color="#DC2626" />
                <div style={{ fontWeight: 700, fontSize: 14, color: "#DC2626" }}>Legal Notice</div>
              </div>
              <div style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.7 }}>
                Failure to repay is a legal matter. AasanPay retains your <strong>CNIC, address, and contact details</strong> for recovery purposes. Non-payment will result in <strong>legal action</strong> under applicable Pakistani law.
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => setView("apply")} style={B({ background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "14px 32px", fontSize: 15, borderRadius: 12 })}>
                I Accept — Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "apply" && (
        <div className="ap-section" style={{ maxWidth: 540, margin: "0 auto", padding: "44px 24px 100px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#0D9488", background: "#F0FDFA", border: "1px solid #A7F3D0", borderRadius: 20, padding: "6px 14px", marginBottom: 12, fontWeight: 600 }}>
              <Clock size={12} /> 2 minutes to complete
            </div>
            <h2 style={{ fontSize: "clamp(22px,5vw,26px)", fontWeight: 800, marginBottom: 4, color: "#0F172A" }}>Apply for Halaal Financing</h2>
            <p style={{ color: "#64748B", fontSize: 14 }}>Zero interest · Qarz-e-Hasna · Rs. 5,000 to Rs. 35,000</p>
          </div>
          <div className="ap-card" style={{ background: "#FFF", borderRadius: 20, padding: 28, border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <form onSubmit={submit}>
              <Field icon={User} label="Full Name (as per CNIC)"><input required style={inp} value={form.fullName} onChange={function(e) { setForm(Object.assign({}, form, { fullName: e.target.value })); }} placeholder="e.g. Muhammad Ali" /></Field>
              <Field icon={CreditCard} label="CNIC Number"><input required style={inp} value={form.cnic} onChange={function(e) { setForm(Object.assign({}, form, { cnic: e.target.value })); }} placeholder="XXXXX-XXXXXXX-X" /></Field>
              <Field icon={Phone} label="WhatsApp Number"><input required style={inp} value={form.phone} onChange={function(e) { setForm(Object.assign({}, form, { phone: e.target.value })); }} placeholder="03XX-XXXXXXX" /></Field>
              <Field icon={MapPin} label="City"><input required style={inp} value={form.city} onChange={function(e) { setForm(Object.assign({}, form, { city: e.target.value })); }} placeholder="e.g. Lahore" /></Field>
              <Field icon={Users} label="Category">
                <select required style={Object.assign({}, inp, { cursor: "pointer" })} value={form.category} onChange={function(e) { setForm(Object.assign({}, form, { category: e.target.value })); }}>
                  <option value="">Select your category</option>
                  <option>Female Student</option><option>Male Student</option>
                  <option>Housewife / Homemaker</option><option>Working Woman</option>
                  <option>Self Employed</option><option>Salaried Employee</option><option>Other</option>
                </select>
              </Field>
              <Field icon={Wallet} label="Loan Amount Required">
                <select required style={Object.assign({}, inp, { cursor: "pointer" })} value={form.loanAmount} onChange={function(e) { setForm(Object.assign({}, form, { loanAmount: e.target.value })); }}>
                  <option value="">Select amount</option>
                  {[5000, 7000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000].map(function(v) { return React.createElement("option", { key: v, value: v }, "Rs. " + v.toLocaleString()); })}
                </select>
              </Field>
              <Field icon={Calendar} label="Repayment Tenure">
                <select required style={Object.assign({}, inp, { cursor: "pointer" })} value={form.tenure} onChange={function(e) { setForm(Object.assign({}, form, { tenure: e.target.value })); }}>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </Field>
              <Field icon={Landmark} label="Easypaisa Number (for disbursement)"><input required style={inp} value={form.easypaisa} onChange={function(e) { setForm(Object.assign({}, form, { easypaisa: e.target.value })); }} placeholder="03XX-XXXXXXX" /></Field>
              <Field icon={TrendingUp} label="Purpose of Loan">
                <select required style={Object.assign({}, inp, { cursor: "pointer" })} value={form.purpose} onChange={function(e) { setForm(Object.assign({}, form, { purpose: e.target.value })); }}>
                  <option value="">Select purpose</option>
                  <option>Education / Tuition Fees</option>
                  <option>Medical Emergency</option>
                  <option>Small Business / Stock</option>
                  <option>Household Expenses</option>
                  <option>Rent / Utilities</option>
                  <option>Other</option>
                </select>
              </Field>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 16px", marginBottom: 16, marginTop: 8 }}>
                <label style={{ display: "flex", alignItems: "start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={function(e) { setAgreed(e.target.checked); }} style={{ width: 18, height: 18, accentColor: "#0D9488", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
                    I have read and agree to the <strong style={{ color: "#0D9488", cursor: "pointer", textDecoration: "underline" }} onClick={function(e) { e.preventDefault(); setView("terms"); }}>Terms and Conditions</strong>. I understand that non-repayment may result in legal action.
                  </span>
                </label>
              </div>
              <button type="submit" disabled={submitting || !agreed} style={B({ width: "100%", background: agreed ? "linear-gradient(135deg,#0D9488,#0F766E)" : "#CBD5E1", color: "#FFF", padding: "15px", fontSize: 16, marginTop: 4, borderRadius: 12, opacity: submitting ? 0.7 : 1, boxShadow: agreed ? "0 4px 15px rgba(13,148,136,.3)" : "none" })}>
                {submitting ? "Submitting..." : "Submit Application — Free"}
              </button>
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>Secured · Verified · Halaal</div>
            </form>
          </div>
        </div>
      )}

      {view === "payment" && (
        <div className="ap-section" style={{ maxWidth: 520, margin: "0 auto", padding: "50px 24px 100px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDFA", border: "2px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CheckCircle2 size={34} color="#0D9488" />
            </div>
            <h2 style={{ fontSize: "clamp(20px,5vw,24px)", fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>Application Submitted!</h2>
            <p style={{ color: "#64748B", fontSize: 14 }}>Save your Application ID — you will need it to track your status</p>
          </div>

          <div className="ap-card" style={{ background: "linear-gradient(135deg,#F0FDFA,#ECFDF5)", border: "2px solid #0D9488", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8, letterSpacing: 1 }}>YOUR APPLICATION ID</div>
            <div className="ap-appid" style={{ fontSize: "clamp(22px,7vw,32px)", fontWeight: 900, color: "#0D9488", letterSpacing: 2, marginBottom: 12, fontFamily: "monospace", wordBreak: "break-all" }}>{appId}</div>
            <button onClick={copyAppId} style={B({ background: idCopied ? "#059669" : "#0D9488", color: "#FFF", padding: "9px 22px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8 })}>
              {idCopied ? React.createElement(React.Fragment, null, React.createElement(Check, { size: 14 }), " Copied!") : React.createElement(React.Fragment, null, React.createElement(Copy, { size: 14 }), " Copy ID")}
            </button>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 10 }}>Screenshot this or save it — use it to track your application</div>
          </div>

          <div className="ap-card" style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 4 }}>Step 2 — Pay Verification Fee</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Send Rs. 350 via Easypaisa to complete your application</div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 4, letterSpacing: .5 }}>EASYPAISA NUMBER</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: 1 }}>{EASYPAISA_NUMBER}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 4, letterSpacing: .5 }}>ACCOUNT TITLE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{ACCOUNT_TITLE}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 4, letterSpacing: .5 }}>AMOUNT TO SEND</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#DC2626" }}>Rs. 350</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 4, letterSpacing: .5 }}>PAYMENT METHOD</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{PAYMENT_METHOD}</div>
                </div>
              </div>
              <button onClick={copyNum} style={B({ background: copied ? "#059669" : "#0D9488", color: "#FFF", padding: "9px 20px", fontSize: 13, marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8 })}>
                {copied ? React.createElement(React.Fragment, null, React.createElement(Check, { size: 14 }), " Copied!") : React.createElement(React.Fragment, null, React.createElement(Copy, { size: 14 }), " Copy Number")}
              </button>
            </div>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 13, color: "#166534" }}>
              <strong>How to pay:</strong> Open Easypaisa app then Send Money then Enter number {EASYPAISA_NUMBER} then Amount Rs. 350 then Send then Copy Transaction ID and take Screenshot
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Transaction ID (TID)</div>
              <input value={tid} onChange={function(e) { setTid(e.target.value); }} style={Object.assign({}, inp, { textAlign: "center", fontSize: 17, fontWeight: 700, letterSpacing: 2 })} placeholder="e.g. TXN1234567890" />
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Find in Easypaisa app then Transactions then Latest</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Payment Screenshot (REQUIRED)</div>
              <div style={{ border: "2px dashed #E2E8F0", borderRadius: 12, padding: 20, textAlign: "center", background: "#F8FAFC", cursor: "pointer" }} onClick={function() { document.getElementById("ssInput").click(); }}>
                {screenshot ? (
                  <div>
                    <CheckCircle2 size={24} color="#16A34A" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>Screenshot Uploaded!</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{screenshot.name}</div>
                    <img src={URL.createObjectURL(screenshot)} alt="payment proof" style={{ maxWidth: "100%", maxHeight: 200, marginTop: 10, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  </div>
                ) : (
                  <div>
                    <Copy size={24} color="#9CA3AF" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Click to upload screenshot</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Payment proof is required</div>
                  </div>
                )}
              </div>
              <input id="ssInput" type="file" accept="image/*" style={{ display: "none" }} onChange={function(e) { if (e.target.files && e.target.files[0]) setScreenshot(e.target.files[0]); }} />
            </div>
            <button onClick={confirmPayment} style={B({ width: "100%", background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "15px", fontSize: 15, borderRadius: 12, boxShadow: "0 4px 15px rgba(13,148,136,.3)" })}>
              Confirm Payment & Submit
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="ap-section" style={{ maxWidth: 520, margin: "0 auto", padding: "70px 24px 100px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F0FDF4", border: "2px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={42} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: "clamp(22px,5vw,26px)", fontWeight: 800, marginBottom: 8, color: "#0F172A" }}>You are All Set!</h2>
          <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>Your application and payment have been received. Our team will call you within 4-6 hours.</p>
          <div className="ap-card" style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8, letterSpacing: 1 }}>YOUR APPLICATION ID</div>
            <div className="ap-appid" style={{ fontSize: "clamp(20px,6vw,28px)", fontWeight: 900, color: "#0D9488", letterSpacing: 2, marginBottom: 10, fontFamily: "monospace", wordBreak: "break-all" }}>{appId}</div>
            <button onClick={copyAppId} style={B({ background: idCopied ? "#059669" : "#F0FDFA", color: idCopied ? "#FFF" : "#0D9488", padding: "8px 20px", fontSize: 13, border: "1px solid #A7F3D0", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8 })}>
              {idCopied ? React.createElement(React.Fragment, null, React.createElement(Check, { size: 13 }), " Copied!") : React.createElement(React.Fragment, null, React.createElement(Copy, { size: 13 }), " Copy ID")}
            </button>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Use this ID to track your application status</div>
          </div>
          <div className="ap-card" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20, marginBottom: 20, textAlign: "left" }}>
            {[
              { done: true,  text: "Application submitted" },
              { done: true,  text: "Verification fee received" },
              { done: false, text: "Under review (4-6 hours)" },
              { done: false, text: "Team will call you" },
              { done: false, text: "Funds transferred to your account" },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 4 ? 10 : 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.done ? "#16A34A" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.done ? React.createElement(Check, { size: 11, color: "#FFF" }) : React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: "#94A3B8" } })}
                  </div>
                  <div style={{ fontSize: 13, color: s.done ? "#0F172A" : "#94A3B8", fontWeight: s.done ? 500 : 400 }}>{s.text}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setView("status")} style={B({ background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "12px 24px", fontSize: 14, display: "flex", alignItems: "center", gap: 6, borderRadius: 10 })}>
              <Search size={14} /> Track Application
            </button>
            <button onClick={function() { setForm({ fullName: "", cnic: "", phone: "", city: "", category: "", purpose: "", loanAmount: "", tenure: "12", easypaisa: "" }); setAgreed(false); setAppId(""); setView("landing"); }} style={B({ background: "#F1F5F9", color: "#374151", padding: "12px 20px", fontSize: 14, borderRadius: 10 })}>
              Home
            </button>
          </div>
        </div>
      )}

      {view === "admin-login" && (
        <div className="ap-section" style={{ maxWidth: 380, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid #A7F3D0" }}>
            <Lock size={24} color="#0D9488" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#0F172A" }}>Admin Access</h2>
          <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 24 }}>Firebase Authentication Required</p>
          <div style={{ textAlign: "left", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Mail size={13} color="#0D9488" /> Email</div>
            <input type="email" style={inp} placeholder="admin@aasanpay.com" value={adminEmail} onChange={function(e) { setAdminEmail(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") checkAdmin(); }} />
          </div>
          <div style={{ textAlign: "left", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Lock size={13} color="#0D9488" /> Password</div>
            <input type="password" style={inp} placeholder="Password" value={adminPass} onChange={function(e) { setAdminPass(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") checkAdmin(); }} />
          </div>
          {passErr && <div style={{ color: "#DC2626", fontSize: 13, marginBottom: 14 }}>{passErr}</div>}
          <button onClick={checkAdmin} disabled={loginLoading} style={B({ width: "100%", background: "linear-gradient(135deg,#0D9488,#0F766E)", color: "#FFF", padding: "13px", fontSize: 15, borderRadius: 12, opacity: loginLoading ? 0.7 : 1 })}>
            {loginLoading ? "Verifying..." : "Sign In"}
          </button>
        </div>
      )}

      {view === "admin" && (
        authChecked && !authUser ? (
          <div style={{ textAlign: "center", padding: 100, color: "#9CA3AF" }}>Redirecting...</div>
        ) : (
          <div className="ap-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Admin Dashboard</h2>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>{authUser && authUser.email}</div>
              </div>
              <div style={{ background: "#F0FDFA", border: "1px solid #A7F3D0", borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#065F46", fontWeight: 600 }}>Firebase Connected</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { l: "Total",    v: apps.length,                                                          c: "#0D9488", bg: "#F0FDFA", bd: "#A7F3D0" },
                { l: "Pending",  v: apps.filter(function(a) { return a.status === "Pending"; }).length,   c: "#EA580C", bg: "#FFF7ED", bd: "#FDBA74" },
                { l: "Approved", v: apps.filter(function(a) { return a.status === "Approved"; }).length,  c: "#16A34A", bg: "#F0FDF4", bd: "#86EFAC" },
                { l: "Disbursed",v: apps.filter(function(a) { return a.status === "Disbursed"; }).length, c: "#2563EB", bg: "#EFF6FF", bd: "#93C5FD" },
                { l: "Rejected", v: apps.filter(function(a) { return a.status === "Rejected"; }).length,  c: "#DC2626", bg: "#FEF2F2", bd: "#FCA5A5" },
              ].map(function(s, i) {
                return (
                  <div key={i} style={{ background: s.bg, borderRadius: 14, padding: 18, textAlign: "center", border: "1px solid " + s.bd }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{s.l}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>All Applications</h3>
              <button onClick={load} style={B({ background: "#F1F5F9", color: "#374151", padding: "8px 16px", fontSize: 13, borderRadius: 8, border: "1px solid #E2E8F0" })}>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>Loading...</div>
            ) : apps.length === 0 ? (
              <div style={{ color: "#9CA3AF", padding: "60px 0", textAlign: "center", border: "2px dashed #E2E8F0", borderRadius: 16, fontSize: 14 }}>No applications yet.</div>
            ) : (
              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                <div className="ap-admin-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr 1fr auto", padding: "10px 18px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: .5 }}>
                  <span>NAME</span><span>CITY</span><span>AMOUNT</span><span>TENURE</span><span>TID</span><span>APP ID</span><span>STATUS</span><span></span>
                </div>
                {apps.map(function(a, i) {
                  const st = STATUS[a.status] || STATUS.Pending;
                  return (
                    <div key={a.id} className="ap-admin-table-row" onClick={function() { setSel(a); }}
                      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr 1fr auto", alignItems: "center", padding: "13px 18px", gap: 8, cursor: "pointer", borderTop: i === 0 ? "none" : "1px solid #F1F5F9", fontSize: 13, transition: "background .15s" }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = "#F8FAFC"; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>
                      <div style={{ fontWeight: 600, color: "#0F172A" }}>{a.fullName}</div>
                      <div style={{ color: "#64748B" }}>{a.city}</div>
                      <div style={{ fontWeight: 600, color: "#0F172A" }}>Rs.{Number(a.loanAmount).toLocaleString()}</div>
                      <div style={{ color: "#64748B" }}>{a.tenure}mo</div>
                      <div style={{ color: a.tid ? "#16A34A" : "#DC2626", fontSize: 11, fontWeight: 600 }}>{a.tid ? "✓" : "—"}</div>
                      <div style={{ color: "#64748B", fontSize: 11, fontFamily: "monospace" }}>{a.applicationId || "—"}</div>
                      <div><span style={{ background: st.bg, color: st.fg, fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid " + st.bd, fontWeight: 600 }}>{st.label}</span></div>
                      <Eye size={14} color="#CBD5E1" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {sel && view === "admin" && authUser && (
        <div onClick={function() { setSel(null); }} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}>
          <div className="ap-modal" onClick={function(e) { e.stopPropagation(); }} style={{ background: "#FFF", borderRadius: 20, padding: 28, maxWidth: 540, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20, gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#0D9488,#14B8A6)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{sel.fullName && sel.fullName[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", wordBreak: "break-word" }}>{sel.fullName}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 12 }}>{sel.cnic} · {sel.category}</div>
                  <div style={{ color: "#0D9488", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>{sel.applicationId || "No ID"}</div>
                </div>
              </div>
              <X size={20} color="#9CA3AF" style={{ cursor: "pointer", flexShrink: 0 }} onClick={function() { setSel(null); }} />
            </div>
            <div className="ap-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, marginBottom: 16, background: "#F8FAFC", borderRadius: 14, padding: 20 }}>
              {[
                ["Phone",     sel.phone],
                ["City",      sel.city],
                ["Amount",    "Rs. " + Number(sel.loanAmount).toLocaleString()],
                ["Tenure",    sel.tenure + " months"],
                ["Easypaisa", sel.easypaisa],
                ["Purpose",   sel.purpose],
                ["Applied",   new Date(sel.submittedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })],
                ["Terms",     sel.agreedToTerms ? "Agreed" : "Not Agreed"],
              ].map(function(kv) {
                return (
                  <div key={kv[0]} style={{ minWidth: 0 }}>
                    <div style={{ color: "#94A3B8", fontSize: 10, marginBottom: 3, fontWeight: 600, letterSpacing: .3 }}>{kv[0].toUpperCase()}</div>
                    <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 13, wordBreak: "break-word" }}>{kv[1]}</div>
                  </div>
                );
              })}
            </div>
            <div className="ap-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: sel.tid ? "#F0FDF4" : "#FEF2F2", border: "1px solid " + (sel.tid ? "#BBF7D0" : "#FCA5A5"), borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontWeight: 600 }}>TRANSACTION ID</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: sel.tid ? "#16A34A" : "#DC2626", wordBreak: "break-all" }}>{sel.tid || "Not Submitted"}</div>
              </div>
              <div style={{ background: (STATUS[sel.status] && STATUS[sel.status].bg) || "#F8FAFC", border: "1px solid " + ((STATUS[sel.status] && STATUS[sel.status].bd) || "#E2E8F0"), borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontWeight: 600 }}>CURRENT STATUS</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: (STATUS[sel.status] && STATUS[sel.status].fg) || "#374151" }}>{(STATUS[sel.status] && STATUS[sel.status].label) || sel.status}</div>
              </div>
            </div>
            <div className="ap-modal-actions" style={{ display: "flex", gap: 10 }}>
              <button onClick={function() { updateStatus(sel.id, "Approved"); }} style={B({ flex: 1, background: "#16A34A", color: "#FFF", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10 })}><CheckCircle2 size={15} /> Approve</button>
              <button onClick={function() { updateStatus(sel.id, "Disbursed"); }} style={B({ flex: 1, background: "#2563EB", color: "#FFF", padding: "11px", borderRadius: 10 })}>Disburse</button>
              <button onClick={function() { updateStatus(sel.id, "Rejected"); }} style={B({ flex: 1, background: "#DC2626", color: "#FFF", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10 })}><XCircle size={15} /> Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```
