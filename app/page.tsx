"use client"
import { useState } from "react"

const products = [
  { id: 1, name: "Ceramic Pour-Over Set", price: 1299, category: "Brewing", rating: 4.8, reviews: 124, tag: "Bestseller", emoji: "☕", desc: "Hand-thrown ceramic with bamboo stand. Brews 600ml perfectly." },
  { id: 2, name: "Cast Iron Skillet 26cm", price: 2499, category: "Cookware", rating: 4.9, reviews: 89, tag: "Top Rated", emoji: "🍳", desc: "Pre-seasoned, oven-safe to 260°C. Lasts generations." },
  { id: 3, name: "Hinoki Cutting Board", price: 1899, category: "Prep", rating: 4.7, reviews: 67, tag: "New", emoji: "🪵", desc: "Japanese cypress wood. Naturally antimicrobial." },
  { id: 4, name: "Copper Measuring Set", price: 899, category: "Tools", rating: 4.6, reviews: 203, tag: "Popular", emoji: "🥄", desc: "6-piece set. Hammered copper with engraved markings." },
  { id: 5, name: "Stoneware Bowl Set", price: 1599, category: "Serveware", rating: 4.8, reviews: 156, tag: "Bestseller", emoji: "🥣", desc: "Set of 4. Microwave & dishwasher safe. Matte finish." },
  { id: 6, name: "Herb Keeper Glass Jar", price: 649, category: "Storage", rating: 4.5, reviews: 91, tag: "New", emoji: "🌿", desc: "Borosilicate glass with bamboo lid. Keeps herbs fresh 2x longer." },
  { id: 7, name: "Wok 32cm Flat Base", price: 1999, category: "Cookware", rating: 4.9, reviews: 178, tag: "Top Rated", emoji: "🥘", desc: "Carbon steel, pre-seasoned. Works on all hob types." },
  { id: 8, name: "Mortar & Pestle", price: 799, category: "Tools", rating: 4.7, reviews: 112, tag: "Popular", emoji: "🫙", desc: "Solid granite, 2-cup capacity. Perfect for spices & pastes." },
]

const categories = ["All", "Cookware", "Prep", "Tools", "Brewing", "Serveware", "Storage"]

export default function DStorzHome() {
  const [cart, setCart] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [cartOpen, setCartOpen] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const cartItems = cart.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const cartTotal = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id))
    return sum + (product?.price || 0) * qty
  }, 0)

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id])
    setAddedId(id)
    setTimeout(() => setAddedId(null), 1000)
  }

  const removeFromCart = (id: number) => {
    const idx = cart.lastIndexOf(id)
    if (idx !== -1) {
      setCart(prev => prev.filter((_, i) => i !== idx))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #fafaf8;
          color: #1a1a18;
        }

        :root {
          --cream: #fafaf8;
          --warm: #f2ede6;
          --border: #e8e3db;
          --text: #1a1a18;
          --muted: #8a8680;
          --accent: #c17f3e;
          --accent-light: #f5ebe0;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250,250,248,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 5vw;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--text);
          text-decoration: none;
        }

        .logo span { color: var(--accent); }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .search-input {
          border: 1px solid var(--border);
          background: var(--warm);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: var(--text);
          width: 200px;
          outline: none;
          transition: border-color 0.2s, width 0.3s;
        }

        .search-input:focus {
          border-color: var(--accent);
          width: 260px;
        }

        .cart-btn {
          background: var(--text);
          color: var(--cream);
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }

        .cart-btn:hover { background: var(--accent); }

        .cart-count {
          background: var(--accent);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
        }

        /* HERO */
        .hero {
          padding: 5rem 5vw 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--text);
          margin-bottom: 1.5rem;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .hero-desc {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 420px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-primary {
          background: var(--text);
          color: var(--cream);
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary:hover {
          background: var(--accent);
          transform: translateY(-1px);
        }

        .btn-ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          padding: 0.8rem 2rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s;
          text-decoration: none;
        }

        .btn-ghost:hover { border-color: var(--text); }

        .hero-visual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .hero-card {
          background: var(--warm);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: transform 0.2s;
        }

        .hero-card:hover { transform: translateY(-4px); }
        .hero-card:nth-child(2) { margin-top: 2rem; }
        .hero-card:nth-child(3) { margin-top: -1rem; }

        .hero-card-emoji { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .hero-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .hero-card-price {
          font-size: 0.85rem;
          color: var(--accent);
          font-weight: 500;
        }

        /* STATS */
        .stats {
          background: var(--text);
          color: var(--cream);
          padding: 2.5rem 5vw;
          display: flex;
          justify-content: center;
          gap: 5rem;
          flex-wrap: wrap;
        }

        .stat { text-align: center; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--accent);
          display: block;
        }
        .stat-label {
          font-size: 0.8rem;
          color: rgba(250,250,248,0.6);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* CATALOG */
        .catalog {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 5vw;
        }

        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .catalog-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cat-btn {
          background: transparent;
          border: 1px solid var(--border);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.2s;
        }

        .cat-btn:hover { border-color: var(--text); color: var(--text); }
        .cat-btn.active {
          background: var(--text);
          border-color: var(--text);
          color: var(--cream);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }

        .product-image {
          background: var(--warm);
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          position: relative;
        }

        .product-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--accent);
          color: white;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .product-tag.new { background: #2d6a4f; }
        .product-tag.top { background: #1a1a18; }

        .product-info {
          padding: 1.25rem;
        }

        .product-category {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }

        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }

        .product-desc {
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
        }

        .product-price span {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 400;
        }

        .product-rating {
          font-size: 0.75rem;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }

        .product-rating .stars { color: var(--accent); }

        .add-btn {
          background: var(--text);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }

        .add-btn:hover { background: var(--accent); transform: scale(1.1); }
        .add-btn.added { background: #2d6a4f; }

        /* BANNER */
        .banner {
          background: var(--warm);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 4rem 5vw;
          text-align: center;
        }

        .banner h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          margin-bottom: 1rem;
        }

        .banner p {
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }

        /* FEATURES */
        .features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 5vw;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
        }

        .feature {
          text-align: center;
          padding: 2rem 1rem;
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature p {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
        }

        /* FOOTER */
        footer {
          background: var(--text);
          color: rgba(250,250,248,0.5);
          padding: 3rem 5vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        footer .logo { color: var(--cream); }
        footer p { font-size: 0.8rem; }

        /* CART DRAWER */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .cart-overlay.open { opacity: 1; pointer-events: all; }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 380px;
          max-width: 100vw;
          background: var(--cream);
          z-index: 201;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border);
        }

        .cart-drawer.open { transform: translateX(0); }

        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--muted);
          line-height: 1;
        }

        .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
          align-items: center;
        }

        .cart-item-emoji {
          width: 50px;
          height: 50px;
          background: var(--warm);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .cart-item-info { flex: 1; }

        .cart-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .cart-item-price {
          font-size: 0.85rem;
          color: var(--accent);
          font-weight: 500;
        }

        .cart-item-qty {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .qty-btn {
          background: var(--warm);
          border: 1px solid var(--border);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .qty-btn:hover { background: var(--border); }

        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .cart-total .amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: var(--accent);
        }

        .checkout-btn {
          width: 100%;
          background: var(--text);
          color: var(--cream);
          border: none;
          padding: 1rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .checkout-btn:hover { background: var(--accent); }

        .empty-cart {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--muted);
        }

        .empty-cart-icon { font-size: 3rem; margin-bottom: 1rem; }

        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; gap: 2rem; }
          .hero-visual { display: none; }
          .stats { gap: 2rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#" className="logo">D<span>-</span>Storz</a>
        <div className="nav-right">
          <input
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <p className="hero-eyebrow">Curated Kitchenware · Est. 2024</p>
          <h1>Cook with <em>intention,</em> eat with joy.</h1>
          <p className="hero-desc">
            Thoughtfully sourced kitchen tools for everyday cooking. From cast iron to ceramics — built to last, designed to inspire.
          </p>
          <div className="hero-cta">
            <a href="#catalog" className="btn-primary">Shop Now</a>
            <a href="#features" className="btn-ghost">Our Story</a>
          </div>
        </div>
        <div className="hero-visual">
          {products.slice(0, 4).map(p => (
            <div key={p.id} className="hero-card">
              <div className="hero-card-emoji">{p.emoji}</div>
              <div className="hero-card-name">{p.name}</div>
              <div className="hero-card-price">₹{p.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <span className="stat-num">2,400+</span>
          <span className="stat-label">Happy Customers</span>
        </div>
        <div className="stat">
          <span className="stat-num">180+</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-num">4.8★</span>
          <span className="stat-label">Average Rating</span>
        </div>
        <div className="stat">
          <span className="stat-num">Free</span>
          <span className="stat-label">Shipping Over ₹999</span>
        </div>
      </div>

      {/* CATALOG */}
      <section className="catalog" id="catalog">
        <div className="catalog-header">
          <h2 className="catalog-title">Our Collection</h2>
          <div className="categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtered.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.emoji}
                <span className={`product-tag ${product.tag === "New" ? "new" : product.tag === "Top Rated" ? "top" : ""}`}>
                  {product.tag}
                </span>
              </div>
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                <p className="product-rating">
                  <span className="stars">{"★".repeat(Math.floor(product.rating))}</span>
                  {" "}{product.rating} ({product.reviews} reviews)
                </p>
                <div className="product-footer">
                  <div className="product-price">
                    ₹{product.price.toLocaleString()}
                    <span> incl. GST</span>
                  </div>
                  <button
                    className={`add-btn ${addedId === product.id ? "added" : ""}`}
                    onClick={() => addToCart(product.id)}
                    title="Add to cart"
                  >
                    {addedId === product.id ? "✓" : "+"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
            <p>No products found for "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* BANNER */}
      <div className="banner">
        <h2>Free shipping on orders over ₹999</h2>
        <p>Every order comes with careful packaging and a satisfaction guarantee. Not happy? Return within 30 days.</p>
        <button className="btn-primary" onClick={() => setActiveCategory("All")}>
          Shop All Products
        </button>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        {[
          { icon: "🌿", title: "Sustainably Sourced", desc: "Every product is ethically made from natural or recycled materials." },
          { icon: "🚚", title: "Fast Delivery", desc: "Same-day dispatch. Delivered across India in 2-5 business days." },
          { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns. No questions asked." },
          { icon: "🔒", title: "Secure Payments", desc: "100% secure checkout. UPI, cards, and net banking accepted." },
        ].map(f => (
          <div key={f.title} className="feature">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="logo">D<span style={{color:"var(--accent)"}}>-</span>Storz</a>
        <p>© 2024 D-Storz. All rights reserved.</p>
        <p>Made with ♥ in India</p>
      </footer>

      {/* CART DRAWER */}
      <div className={`cart-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({cart.length})</h2>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {Object.keys(cartItems).length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Add some items to get started!</p>
            </div>
          ) : (
            Object.entries(cartItems).map(([id, qty]) => {
              const product = products.find(p => p.id === Number(id))!
              return (
                <div key={id} className="cart-item">
                  <div className="cart-item-emoji">{product.emoji}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{product.name}</div>
                    <div className="cart-item-price">₹{(product.price * qty).toLocaleString()}</div>
                  </div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => removeFromCart(product.id)}>−</button>
                    <span>{qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(product.id)}>+</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {Object.keys(cartItems).length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="amount">₹{cartTotal.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  )
}