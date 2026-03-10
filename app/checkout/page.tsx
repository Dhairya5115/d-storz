"use client"
import { useState } from "react"

const cartItems = [
  { id: 1, name: "Ceramic Pour-Over Set", variant: "Chalk White", price: 1299, qty: 1, emoji: "☕" },
  { id: 2, name: "Cast Iron Skillet 26cm", variant: "26cm", price: 2499, qty: 1, emoji: "🍳" },
  { id: 4, name: "Copper Measuring Set", variant: "Copper", price: 899, qty: 2, emoji: "🥄" },
]

type Step = 1 | 2 | 3 | 4

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"]

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1)
  const [items, setItems] = useState(cartItems)
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "Maharashtra", pincode: "",
    paymentMethod: "upi",
    upiId: "", saveAddress: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [placing, setPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + gst

  const update = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim()) e.lastName = "Required"
    if (!form.email.includes("@")) e.email = "Valid email required"
    if (form.phone.length !== 10) e.phone = "10-digit number required"
    if (!form.address.trim()) e.address = "Required"
    if (!form.city.trim()) e.city = "Required"
    if (form.pincode.length !== 6) e.pincode = "6-digit pincode required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (form.paymentMethod === "upi" && !form.upiId.includes("@")) e.upiId = "Valid UPI ID required (e.g. name@upi)"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => (s + 1) as Step)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 2000))
    setPlacing(false)
    setOrderPlaced(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id))

  const Field = ({ label, name, type = "text", placeholder, half = false, options }: {
    label: string; name: string; type?: string; placeholder?: string; half?: boolean; options?: string[]
  }) => (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display: "block", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 500, marginBottom: "0.4rem" }}>
        {label}
      </label>
      {options ? (
        <select
          value={(form as any)[name]}
          onChange={e => update(name, e.target.value)}
          style={{ width: "100%", border: `1px solid ${errors[name] ? "#dc2626" : "var(--border)"}`, background: "white", padding: "0.7rem 1rem", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.88rem", color: "var(--text)", outline: "none" }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={(form as any)[name]}
          onChange={e => update(name, e.target.value)}
          style={{ width: "100%", border: `1px solid ${errors[name] ? "#dc2626" : "var(--border)"}`, background: "white", padding: "0.7rem 1rem", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.88rem", color: "var(--text)", outline: "none", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = errors[name] ? "#dc2626" : "var(--border)"}
        />
      )}
      {errors[name] && <p style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "0.25rem" }}>{errors[name]}</p>}
    </div>
  )

  // ORDER SUCCESS
  if (orderPlaced) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #fafaf8; color: #1a1a18; }
        :root { --cream: #fafaf8; --warm: #f2ede6; --border: #e8e3db; --text: #1a1a18; --muted: #8a8680; --accent: #c17f3e; }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <nav style={{ background: "rgba(250,250,248,0.95)", borderBottom: "1px solid var(--border)", padding: "0 5vw", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 600, color: "#1a1a18", textDecoration: "none" }}>D<span style={{ color: "var(--accent)" }}>-</span>Storz</a>
      </nav>
      <div style={{ maxWidth: 560, margin: "6rem auto", padding: "0 5vw", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem", animation: "pop 0.5s ease forwards" }}>🎉</div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.5rem", fontWeight: 400, marginBottom: "1rem", animation: "fadeUp 0.5s ease 0.2s both" }}>Order Confirmed!</h1>
        <p style={{ color: "var(--muted)", marginBottom: "0.5rem", animation: "fadeUp 0.5s ease 0.3s both" }}>
          Thank you, <strong style={{ color: "var(--text)" }}>{form.firstName}</strong>! Your order has been placed.
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "2.5rem", animation: "fadeUp 0.5s ease 0.4s both" }}>
          A confirmation has been sent to <strong style={{ color: "var(--text)" }}>{form.email}</strong>
        </p>
        <div style={{ background: "var(--warm)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", animation: "fadeUp 0.5s ease 0.5s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Order ID</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.9rem" }}>{orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Total Paid</span>
            <span style={{ fontWeight: 700, color: "var(--accent)" }}>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Estimated Delivery</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>3–5 business days</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", animation: "fadeUp 0.5s ease 0.6s both" }}>
          <a href="/" style={{ background: "var(--text)", color: "white", padding: "0.85rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
            Continue Shopping
          </a>
          <a href="/admin" style={{ background: "transparent", color: "var(--text)", border: "1.5px solid var(--border)", padding: "0.85rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.9rem" }}>
            Track Order
          </a>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f3f0; color: #1a1a18; }
        :root { --cream: #fafaf8; --warm: #f2ede6; --border: #e8e3db; --text: #1a1a18; --muted: #8a8680; --accent: #c17f3e; }

        .navbar {
          background: rgba(250,250,248,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border); padding: 0 5vw; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--text); text-decoration: none; }
        .logo span { color: var(--accent); }
        .back-link { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--muted); text-decoration: none; padding: 0.35rem 0.85rem; border: 1px solid var(--border); border-radius: 100px; transition: all 0.2s; background: white; }
        .back-link:hover { border-color: var(--text); color: var(--text); }

        /* STEPS */
        .steps-bar { background: var(--cream); border-bottom: 1px solid var(--border); padding: 1rem 5vw; }
        .steps-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; }
        .step-item { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
        .step-circle {
          width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0; transition: all 0.3s;
        }
        .step-circle.done { background: #2d6a4f; color: white; }
        .step-circle.active { background: var(--accent); color: white; }
        .step-circle.inactive { background: var(--border); color: var(--muted); }
        .step-label { font-size: 0.8rem; font-weight: 500; }
        .step-label.active { color: var(--accent); }
        .step-label.done { color: #2d6a4f; }
        .step-label.inactive { color: var(--muted); }
        .step-line { flex: 1; height: 1px; background: var(--border); margin: 0 0.5rem; }
        .step-line.done { background: #2d6a4f; }

        /* LAYOUT */
        .checkout-layout { max-width: 900px; margin: 2rem auto; padding: 0 5vw 4rem; display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; align-items: start; }

        /* PANEL */
        .panel { background: var(--cream); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; }
        .panel-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; margin-bottom: 1.5rem; }

        /* FORM GRID */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* PAYMENT OPTIONS */
        .payment-option {
          border: 1.5px solid var(--border); border-radius: 10px; padding: 1rem 1.25rem;
          cursor: pointer; transition: all 0.2s; margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .payment-option:hover { border-color: var(--text); }
        .payment-option.selected { border-color: var(--accent); background: #fef6ec; }
        .payment-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid var(--border); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .payment-option.selected .payment-radio { border-color: var(--accent); }
        .payment-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
        .payment-label { font-weight: 500; font-size: 0.9rem; }
        .payment-sub { font-size: 0.78rem; color: var(--muted); }
        .payment-icon { font-size: 1.4rem; margin-left: auto; }

        /* UPI INPUT */
        .upi-field { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border); }

        /* ORDER SUMMARY */
        .summary-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
        .summary-item:last-of-type { border-bottom: none; }
        .item-emoji { width: 44px; height: 44px; background: var(--warm); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; position: relative; }
        .item-qty-badge { position: absolute; top: -6px; right: -6px; background: var(--text); color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; }
        .item-info { flex: 1; min-width: 0; }
        .item-name { font-size: 0.83rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-variant { font-size: 0.72rem; color: var(--muted); }
        .item-price { font-size: 0.85rem; font-weight: 600; flex-shrink: 0; }
        .remove-btn { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 0.9rem; padding: 0.2rem; transition: color 0.15s; }
        .remove-btn:hover { color: #dc2626; }

        /* TOTALS */
        .totals { margin-top: 1rem; }
        .total-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .total-row.grand { font-weight: 700; font-size: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); margin-top: 0.5rem; }
        .total-label { color: var(--muted); }
        .free-tag { color: #2d6a4f; font-weight: 600; font-size: 0.8rem; }

        /* BUTTONS */
        .next-btn { width: 100%; background: var(--text); color: white; border: none; padding: 1rem; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: background 0.2s; margin-top: 1.5rem; }
        .next-btn:hover { background: var(--accent); }
        .next-btn:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }
        .back-btn { width: 100%; background: transparent; color: var(--text); border: 1.5px solid var(--border); padding: 0.85rem; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; cursor: pointer; margin-top: 0.75rem; transition: border-color 0.2s; }
        .back-btn:hover { border-color: var(--text); }

        /* REVIEW */
        .review-block { background: var(--warm); border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; }
        .review-block-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 500; margin-bottom: 0.75rem; }
        .review-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem; }
        .review-row:last-child { margin-bottom: 0; }
        .edit-link { font-size: 0.75rem; color: var(--accent); cursor: pointer; background: none; border: none; font-family: inherit; }

        /* PLACING OVERLAY */
        .placing-overlay { position: fixed; inset: 0; background: rgba(250,250,248,0.9); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* SECURE BADGE */
        .secure-badge { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--muted); justify-content: center; margin-top: 1rem; }

        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* PLACING OVERLAY */}
      {placing && (
        <div className="placing-overlay">
          <div className="spinner" />
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem" }}>Placing your order...</p>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="logo">D<span>-</span>Storz</a>
        <a href="/" className="back-link">← Continue Shopping</a>
      </nav>

      {/* STEPS */}
      <div className="steps-bar">
        <div className="steps-inner">
          {[
            { num: 1, label: "Cart" },
            { num: 2, label: "Shipping" },
            { num: 3, label: "Payment" },
            { num: 4, label: "Review" },
          ].map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div className="step-item">
                <div className={`step-circle ${step > s.num ? "done" : step === s.num ? "active" : "inactive"}`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`step-label ${step > s.num ? "done" : step === s.num ? "active" : "inactive"}`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && <div className={`step-line ${step > s.num ? "done" : ""}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-layout">

        {/* LEFT PANEL */}
        <div>

          {/* STEP 1 — CART */}
          {step === 1 && (
            <div className="panel">
              <div className="panel-title">Your Cart ({items.length} items)</div>
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-emoji">
                    {item.emoji}
                    <span className="item-qty-badge">{item.qty}</span>
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-variant">{item.variant}</div>
                  </div>
                  <div className="item-price">₹{(item.price * item.qty).toLocaleString()}</div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛒</div>
                  <p>Your cart is empty</p>
                  <a href="/" style={{ color: "var(--accent)", fontSize: "0.85rem" }}>← Browse products</a>
                </div>
              )}
              {items.length > 0 && (
                <button className="next-btn" onClick={handleNext}>Proceed to Shipping →</button>
              )}
            </div>
          )}

          {/* STEP 2 — SHIPPING */}
          {step === 2 && (
            <div className="panel">
              <div className="panel-title">Shipping Details</div>
              <div className="form-grid">
                <Field label="First Name" name="firstName" placeholder="Dhairya" half />
                <Field label="Last Name" name="lastName" placeholder="Shah" half />
                <Field label="Email Address" name="email" type="email" placeholder="you@email.com" />
                <Field label="Phone Number" name="phone" type="tel" placeholder="10-digit mobile number" />
                <Field label="Full Address" name="address" placeholder="House/Flat no., Street, Area" />
                <Field label="City" name="city" placeholder="Mumbai" half />
                <Field label="State" name="state" half options={STATES} />
                <Field label="PIN Code" name="pincode" placeholder="400001" half />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="save"
                  checked={form.saveAddress}
                  onChange={e => update("saveAddress", e.target.checked)}
                  style={{ width: "auto", accentColor: "var(--accent)" }}
                />
                <label htmlFor="save" style={{ fontSize: "0.83rem", color: "var(--muted)", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
                  Save this address for future orders
                </label>
              </div>
              <button className="next-btn" onClick={handleNext}>Continue to Payment →</button>
              <button className="back-btn" onClick={() => setStep(1)}>← Back to Cart</button>
            </div>
          )}

          {/* STEP 3 — PAYMENT */}
          {step === 3 && (
            <div className="panel">
              <div className="panel-title">Payment Method</div>

              {[
                { id: "upi", label: "UPI Payment", sub: "GPay, PhonePe, Paytm & more", icon: "📱" },
                { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: "💳" },
                { id: "netbanking", label: "Net Banking", sub: "All major Indian banks", icon: "🏦" },
                { id: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: "💵" },
              ].map(opt => (
                <div
                  key={opt.id}
                  className={`payment-option ${form.paymentMethod === opt.id ? "selected" : ""}`}
                  onClick={() => update("paymentMethod", opt.id)}
                >
                  <div className="payment-radio">
                    {form.paymentMethod === opt.id && <div className="payment-radio-dot" />}
                  </div>
                  <div>
                    <div className="payment-label">{opt.label}</div>
                    <div className="payment-sub">{opt.sub}</div>
                    {opt.id === "upi" && form.paymentMethod === "upi" && (
                      <div className="upi-field">
                        <input
                          placeholder="yourname@upi"
                          value={form.upiId}
                          onChange={e => update("upiId", e.target.value)}
                          style={{ width: "100%", border: `1px solid ${errors.upiId ? "#dc2626" : "var(--border)"}`, background: "white", padding: "0.6rem 0.9rem", borderRadius: "7px", fontFamily: "inherit", fontSize: "0.85rem", outline: "none" }}
                        />
                        {errors.upiId && <p style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "0.25rem" }}>{errors.upiId}</p>}
                      </div>
                    )}
                    {opt.id === "card" && form.paymentMethod === "card" && (
                      <div className="upi-field" style={{ display: "grid", gap: "0.6rem" }}>
                        <input placeholder="Card Number" style={{ width: "100%", border: "1px solid var(--border)", background: "white", padding: "0.6rem 0.9rem", borderRadius: "7px", fontFamily: "inherit", fontSize: "0.85rem", outline: "none" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                          <input placeholder="MM / YY" style={{ border: "1px solid var(--border)", background: "white", padding: "0.6rem 0.9rem", borderRadius: "7px", fontFamily: "inherit", fontSize: "0.85rem", outline: "none" }} />
                          <input placeholder="CVV" style={{ border: "1px solid var(--border)", background: "white", padding: "0.6rem 0.9rem", borderRadius: "7px", fontFamily: "inherit", fontSize: "0.85rem", outline: "none" }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="payment-icon">{opt.icon}</span>
                </div>
              ))}

              <button className="next-btn" onClick={handleNext}>Review Order →</button>
              <button className="back-btn" onClick={() => setStep(2)}>← Back to Shipping</button>
              <div className="secure-badge">🔒 Your payment is 100% secure & encrypted</div>
            </div>
          )}

          {/* STEP 4 — REVIEW */}
          {step === 4 && (
            <div className="panel">
              <div className="panel-title">Review Your Order</div>

              <div className="review-block">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div className="review-block-title" style={{ margin: 0 }}>Shipping To</div>
                  <button className="edit-link" onClick={() => setStep(2)}>Edit</button>
                </div>
                <div className="review-row"><span style={{ fontWeight: 500 }}>{form.firstName} {form.lastName}</span></div>
                <div className="review-row"><span style={{ color: "var(--muted)", fontSize: "0.83rem" }}>{form.address}, {form.city}, {form.state} — {form.pincode}</span></div>
                <div className="review-row"><span style={{ color: "var(--muted)", fontSize: "0.83rem" }}>{form.phone} · {form.email}</span></div>
              </div>

              <div className="review-block">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div className="review-block-title" style={{ margin: 0 }}>Payment</div>
                  <button className="edit-link" onClick={() => setStep(3)}>Edit</button>
                </div>
                <div className="review-row">
                  <span>
                    {form.paymentMethod === "upi" ? `📱 UPI — ${form.upiId}` :
                      form.paymentMethod === "card" ? "💳 Credit / Debit Card" :
                        form.paymentMethod === "netbanking" ? "🏦 Net Banking" : "💵 Cash on Delivery"}
                  </span>
                </div>
              </div>

              <div className="review-block">
                <div className="review-block-title">Items ({items.length})</div>
                {items.map(item => (
                  <div key={item.id} className="review-row">
                    <span>{item.emoji} {item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button className="next-btn" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? "Placing Order..." : `Place Order · ₹${total.toLocaleString()}`}
              </button>
              <button className="back-btn" onClick={() => setStep(3)}>← Back to Payment</button>
              <div className="secure-badge">🔒 By placing your order you agree to our Terms & Privacy Policy</div>
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="panel" style={{ position: "sticky", top: "80px" }}>
          <div className="panel-title" style={{ fontSize: "1.1rem" }}>Order Summary</div>

          {items.map(item => (
            <div key={item.id} className="summary-item">
              <div className="item-emoji">
                {item.emoji}
                <span className="item-qty-badge">{item.qty}</span>
              </div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-variant">{item.variant}</div>
              </div>
              <div className="item-price">₹{(item.price * item.qty).toLocaleString()}</div>
            </div>
          ))}

          <div className="totals">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Shipping</span>
              <span className={shipping === 0 ? "free-tag" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="total-row">
              <span className="total-label">GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {shipping === 0 && (
            <div style={{ background: "#d1fae5", color: "#2d6a4f", fontSize: "0.75rem", fontWeight: 500, padding: "0.5rem 0.85rem", borderRadius: "8px", marginTop: "1rem", textAlign: "center" }}>
              ✓ You qualify for free shipping!
            </div>
          )}

          <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
            {["🚚 Free returns within 30 days", "🔒 Secure 256-bit SSL checkout", "📦 Dispatched within 24 hours"].map(p => (
              <div key={p} style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.4rem" }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}