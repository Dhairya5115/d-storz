"use client"
import { useState } from "react"

const products = [
  { id: 1, name: "Ceramic Pour-Over Set", price: 1299, originalPrice: 1599, category: "Brewing", rating: 4.8, reviews: 124, tag: "Bestseller", emoji: "☕", desc: "Hand-thrown ceramic with bamboo stand. Brews 600ml perfectly.", details: "Each piece is individually hand-thrown by artisan potters in Jaipur. The porous ceramic naturally filters mineral impurities, resulting in a cleaner, brighter cup. Includes dripper, server, and bamboo stand.", specs: { Material: "Stoneware Ceramic", Capacity: "600ml", "Dishwasher Safe": "Yes", "Filter Size": "Size 2", Origin: "Jaipur, India" }, variants: ["Chalk White", "Matte Black", "Clay Brown"] },
  { id: 2, name: "Cast Iron Skillet 26cm", price: 2499, originalPrice: 2999, category: "Cookware", rating: 4.9, reviews: 89, tag: "Top Rated", emoji: "🍳", desc: "Pre-seasoned, oven-safe to 260°C. Lasts generations.", details: "Cast from a single pour of iron, this skillet develops a natural non-stick patina over time. The more you use it, the better it gets. Ideal for searing, baking, frying, and slow cooking.", specs: { Material: "Cast Iron", Diameter: "26cm", "Oven Safe": "Up to 260°C", Weight: "2.8kg", "Induction Compatible": "Yes" }, variants: ["26cm", "30cm", "22cm"] },
  { id: 3, name: "Hinoki Cutting Board", price: 1899, originalPrice: 2299, category: "Prep", rating: 4.7, reviews: 67, tag: "New", emoji: "🪵", desc: "Japanese cypress wood. Naturally antimicrobial.", details: "Hinoki cypress is traditionally used in Japanese kitchens for its natural antimicrobial properties and gentle texture that preserves knife edges. Hand-finished with food-safe oil.", specs: { Material: "Hinoki Cypress", Size: "38 × 25 × 2.5cm", "Knife-Friendly": "Yes", "Food Safe Oil": "Yes", Origin: "Japan" }, variants: ["Small", "Medium", "Large"] },
  { id: 4, name: "Copper Measuring Set", price: 899, originalPrice: 1099, category: "Tools", rating: 4.6, reviews: 203, tag: "Popular", emoji: "🥄", desc: "6-piece set. Hammered copper with engraved markings.", details: "A full set of 6 measuring spoons in hammered copper with laser-engraved measurements. The long handles prevent hand contact with ingredients and the hammered finish gives a beautiful textured look.", specs: { Material: "Copper-plated Steel", Pieces: "6 spoons", Sizes: "1/4 tsp to 1 tbsp", Dishwasher: "Hand wash only", Hanging: "Includes ring" }, variants: ["Copper", "Matte Silver", "Gold"] },
]

const relatedProducts = [
  { id: 5, name: "Stoneware Bowl Set", price: 1599, emoji: "🥣", category: "Serveware", rating: 4.8 },
  { id: 6, name: "Herb Keeper Glass Jar", price: 649, emoji: "🌿", category: "Storage", rating: 4.5 },
  { id: 7, name: "Wok 32cm Flat Base", price: 1999, emoji: "🥘", category: "Cookware", rating: 4.9 },
  { id: 8, name: "Mortar & Pestle", price: 799, emoji: "🫙", category: "Tools", rating: 4.7 },
]

export default function ProductDetailPage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews">("details")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showAllProducts, setShowAllProducts] = useState(false)

  const cartCount = cart.length

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) cart.push(selectedProduct.id)
    setCart([...cart])
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const discount = Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #fafaf8; color: #1a1a18; }
        :root {
          --cream: #fafaf8; --warm: #f2ede6; --border: #e8e3db;
          --text: #1a1a18; --muted: #8a8680; --accent: #c17f3e;
        }

        /* NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(250,250,248,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 5vw; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 600;
          letter-spacing: 0.05em; color: var(--text); text-decoration: none;
        }
        .logo span { color: var(--accent); }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .back-link {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.82rem; color: var(--muted); text-decoration: none;
          padding: 0.35rem 0.85rem; border: 1px solid var(--border);
          border-radius: 100px; transition: all 0.2s;
        }
        .back-link:hover { border-color: var(--text); color: var(--text); }
        .cart-btn {
          background: var(--text); color: var(--cream); border: none;
          padding: 0.5rem 1.2rem; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;
        }
        .cart-btn:hover { background: var(--accent); }
        .cart-count {
          background: var(--accent); color: white; border-radius: 50%;
          width: 18px; height: 18px; display: flex; align-items: center;
          justify-content: center; font-size: 0.65rem; font-weight: 700;
        }

        /* BREADCRUMB */
        .breadcrumb {
          padding: 1rem 5vw; font-size: 0.8rem; color: var(--muted);
          display: flex; align-items: center; gap: 0.5rem;
          max-width: 1200px; margin: 0 auto;
        }
        .breadcrumb a { color: var(--muted); text-decoration: none; }
        .breadcrumb a:hover { color: var(--accent); }
        .breadcrumb span { color: var(--text); font-weight: 500; }

        /* PRODUCT LAYOUT */
        .product-layout {
          max-width: 1200px; margin: 0 auto;
          padding: 1rem 5vw 5rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem;
          align-items: start;
        }

        /* LEFT — IMAGE */
        .image-section { position: sticky; top: 80px; }
        .main-image {
          background: var(--warm); border: 1px solid var(--border);
          border-radius: 16px; aspect-ratio: 1;
          display: flex; align-items: center; justify-content: center;
          font-size: 8rem; margin-bottom: 1rem; position: relative;
          overflow: hidden;
        }
        .image-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: var(--accent); color: white;
          font-size: 0.7rem; font-weight: 700;
          padding: 0.3rem 0.75rem; border-radius: 100px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .discount-badge {
          position: absolute; top: 1rem; right: 1rem;
          background: #dc2626; color: white;
          font-size: 0.75rem; font-weight: 700;
          padding: 0.3rem 0.6rem; border-radius: 6px;
        }
        .wishlist-btn {
          position: absolute; bottom: 1rem; right: 1rem;
          background: white; border: 1px solid var(--border);
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.1rem; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .wishlist-btn:hover { border-color: #dc2626; transform: scale(1.05); }
        .wishlist-btn.active { background: #fef2f2; border-color: #dc2626; }
        .thumbnail-row {
          display: flex; gap: 0.75rem;
        }
        .thumbnail {
          flex: 1; aspect-ratio: 1; background: var(--warm);
          border: 2px solid var(--border); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; cursor: pointer; transition: all 0.2s;
          opacity: 0.6;
        }
        .thumbnail:first-child { opacity: 1; border-color: var(--accent); }
        .thumbnail:hover { opacity: 1; border-color: var(--text); }

        /* RIGHT — INFO */
        .info-section { padding-top: 0.5rem; }
        .product-category-tag {
          font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.15em; color: var(--accent);
          font-weight: 500; margin-bottom: 0.75rem;
        }
        .product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 400; line-height: 1.2;
          margin-bottom: 1rem; letter-spacing: -0.01em;
        }
        .rating-row {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .stars { color: var(--accent); font-size: 0.9rem; }
        .rating-text { font-size: 0.85rem; color: var(--muted); }
        .rating-text strong { color: var(--text); }
        .in-stock {
          font-size: 0.78rem; color: #2d6a4f;
          background: #d1fae5; padding: 0.2rem 0.6rem;
          border-radius: 100px; font-weight: 500;
        }

        /* PRICE */
        .price-row {
          display: flex; align-items: baseline; gap: 1rem;
          margin-bottom: 2rem; padding-bottom: 2rem;
          border-bottom: 1px solid var(--border);
        }
        .price-current {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 600; color: var(--text);
        }
        .price-original {
          font-size: 1.1rem; color: var(--muted);
          text-decoration: line-through;
        }
        .price-save {
          font-size: 0.8rem; color: #dc2626;
          font-weight: 600; background: #fef2f2;
          padding: 0.2rem 0.6rem; border-radius: 100px;
        }

        /* VARIANTS */
        .option-label {
          font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--muted);
          font-weight: 500; margin-bottom: 0.75rem;
        }
        .variant-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .variant-btn {
          padding: 0.5rem 1.2rem; border: 1.5px solid var(--border);
          border-radius: 8px; background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          color: var(--text); transition: all 0.15s;
        }
        .variant-btn:hover { border-color: var(--text); }
        .variant-btn.active { border-color: var(--accent); background: var(--accent); color: white; }

        /* QUANTITY */
        .qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .qty-control {
          display: flex; align-items: center; gap: 0;
          border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
        }
        .qty-btn {
          background: var(--warm); border: none; width: 40px; height: 40px;
          font-size: 1.1rem; cursor: pointer; transition: background 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .qty-btn:hover { background: var(--border); }
        .qty-num {
          width: 50px; text-align: center; font-weight: 600;
          font-size: 0.95rem; border: none; background: white;
          border-left: 1px solid var(--border); border-right: 1px solid var(--border);
          height: 40px; line-height: 40px;
        }

        /* ADD TO CART */
        .cta-row { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
        .add-to-cart {
          flex: 1; background: var(--text); color: white; border: none;
          padding: 1rem 2rem; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .add-to-cart:hover { background: var(--accent); transform: translateY(-1px); }
        .add-to-cart.added { background: #2d6a4f; }
        .buy-now {
          flex: 1; background: transparent; color: var(--text);
          border: 1.5px solid var(--text); padding: 1rem 2rem;
          border-radius: 100px; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 500; cursor: pointer;
          transition: all 0.2s;
        }
        .buy-now:hover { background: var(--warm); }

        /* PERKS */
        .perks { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .perk {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.85rem; color: var(--muted);
        }
        .perk-icon { font-size: 1rem; width: 20px; text-align: center; }

        /* TABS */
        .tabs { border-bottom: 1px solid var(--border); display: flex; gap: 0; margin-bottom: 1.5rem; }
        .tab-btn {
          background: none; border: none; padding: 0.75rem 1.25rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          color: var(--muted); cursor: pointer; position: relative;
          transition: color 0.2s; border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }

        .tab-content { font-size: 0.9rem; line-height: 1.8; color: #3a3835; }

        .specs-table { width: 100%; border-collapse: collapse; }
        .specs-table tr:nth-child(even) td { background: var(--warm); }
        .specs-table td { padding: 0.6rem 0.75rem; font-size: 0.85rem; border-bottom: 1px solid var(--border); }
        .specs-table td:first-child { color: var(--muted); font-weight: 500; width: 40%; }

        /* REVIEWS */
        .review-card {
          background: var(--warm); border-radius: 10px;
          padding: 1rem; margin-bottom: 0.75rem;
        }
        .review-header { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
        .reviewer { font-weight: 500; font-size: 0.85rem; }
        .review-stars { color: var(--accent); font-size: 0.8rem; }
        .review-text { font-size: 0.83rem; color: #4a4845; line-height: 1.6; }
        .review-date { font-size: 0.72rem; color: var(--muted); margin-top: 0.4rem; }

        /* PRODUCT SWITCHER */
        .product-switcher {
          max-width: 1200px; margin: 0 auto;
          padding: 0 5vw 2rem;
        }
        .switcher-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 600;
          color: var(--muted); margin-bottom: 0.75rem;
          text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem;
        }
        .switcher-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .switcher-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; border: 1.5px solid var(--border);
          border-radius: 8px; background: white; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          transition: all 0.15s; color: var(--text);
        }
        .switcher-btn:hover { border-color: var(--text); }
        .switcher-btn.active { border-color: var(--accent); background: var(--accent); color: white; }

        /* RELATED */
        .related {
          background: var(--warm); border-top: 1px solid var(--border);
          padding: 4rem 5vw;
        }
        .related-inner { max-width: 1200px; margin: 0 auto; }
        .related h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; margin-bottom: 2rem;
        }
        .related-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .related-card {
          background: white; border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;
        }
        .related-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
        .related-image {
          background: var(--warm); height: 120px;
          display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
        }
        .related-info { padding: 0.85rem; }
        .related-name { font-weight: 500; font-size: 0.85rem; margin-bottom: 0.25rem; }
        .related-price { color: var(--accent); font-size: 0.85rem; font-weight: 600; }

        /* FOOTER */
        footer {
          background: var(--text); color: rgba(250,250,248,0.4);
          padding: 2.5rem 5vw;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
        }
        footer .logo { color: var(--cream); }
        footer p { font-size: 0.8rem; }

        /* TOAST */
        .toast {
          position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
          background: #1a1a18; color: white; padding: 0.75rem 1.5rem;
          border-radius: 100px; font-size: 0.85rem; font-weight: 500;
          z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s;
          white-space: nowrap;
        }
        .toast.show { opacity: 1; }

        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr; gap: 2rem; }
          .image-section { position: static; }
          .cta-row { flex-direction: column; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="logo">D<span>-</span>Storz</a>
        <div className="nav-right">
          <a href="/" className="back-link">← Back to Shop</a>
          <a href="/admin" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", padding: "0.4rem 0.8rem", border: "1px solid var(--border)", borderRadius: "100px" }}>⚙️ Admin</a>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a> /
        <a href="/">Shop</a> /
        <a href="/">{selectedProduct.category}</a> /
        <span>{selectedProduct.name}</span>
      </div>

      {/* PRODUCT SWITCHER */}
      <div className="product-switcher">
        <div className="switcher-title">Browse Products</div>
        <div className="switcher-row">
          {products.map(p => (
            <button
              key={p.id}
              className={`switcher-btn ${selectedProduct.id === p.id ? "active" : ""}`}
              onClick={() => { setSelectedProduct(p); setSelectedVariant(0); setActiveTab("details") }}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN PRODUCT LAYOUT */}
      <div className="product-layout">

        {/* LEFT — IMAGE */}
        <div className="image-section">
          <div className="main-image">
            <span style={{ fontSize: "9rem" }}>{selectedProduct.emoji}</span>
            <span className="image-badge">{selectedProduct.tag}</span>
            <span className="discount-badge">-{discount}%</span>
            <button
              className={`wishlist-btn ${wishlist.includes(selectedProduct.id) ? "active" : ""}`}
              onClick={() => toggleWishlist(selectedProduct.id)}
            >
              {wishlist.includes(selectedProduct.id) ? "❤️" : "🤍"}
            </button>
          </div>
          <div className="thumbnail-row">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="thumbnail">{selectedProduct.emoji}</div>
            ))}
          </div>
        </div>

        {/* RIGHT — INFO */}
        <div className="info-section">
          <div className="product-category-tag">{selectedProduct.category}</div>
          <h1 className="product-title">{selectedProduct.name}</h1>

          <div className="rating-row">
            <span className="stars">{"★".repeat(Math.floor(selectedProduct.rating))}{"☆".repeat(5 - Math.floor(selectedProduct.rating))}</span>
            <span className="rating-text"><strong>{selectedProduct.rating}</strong> ({selectedProduct.reviews} reviews)</span>
            <span className="in-stock">✓ In Stock</span>
          </div>

          <div className="price-row">
            <span className="price-current">₹{selectedProduct.price.toLocaleString()}</span>
            <span className="price-original">₹{selectedProduct.originalPrice.toLocaleString()}</span>
            <span className="price-save">Save {discount}%</span>
          </div>

          {/* VARIANTS */}
          <div className="option-label">
            {selectedProduct.id === 2 ? "Size" : selectedProduct.id === 1 ? "Colour" : selectedProduct.id === 3 ? "Size" : "Finish"}
            {" — "}
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{selectedProduct.variants[selectedVariant]}</span>
          </div>
          <div className="variant-row">
            {selectedProduct.variants.map((v, i) => (
              <button
                key={i}
                className={`variant-btn ${selectedVariant === i ? "active" : ""}`}
                onClick={() => setSelectedVariant(i)}
              >
                {v}
              </button>
            ))}
          </div>

          {/* QUANTITY */}
          <div className="qty-row">
            <div className="option-label" style={{ margin: 0 }}>Qty</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <div className="qty-num">{quantity}</div>
              <button className="qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</button>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Max 10 per order</span>
          </div>

          {/* CTA */}
          <div className="cta-row">
            <button
              className={`add-to-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button className="buy-now">Buy Now</button>
          </div>

          {/* PERKS */}
          <div className="perks">
            <div className="perk"><span className="perk-icon">🚚</span> Free delivery on orders over ₹999</div>
            <div className="perk"><span className="perk-icon">↩️</span> 30-day hassle-free returns</div>
            <div className="perk"><span className="perk-icon">🔒</span> Secure checkout — UPI & cards accepted</div>
            <div className="perk"><span className="perk-icon">🌿</span> Sustainably sourced & ethically made</div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {(["details", "specs", "reviews"] as const).map(t => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "details" ? "Description" : t === "specs" ? "Specifications" : `Reviews (${selectedProduct.reviews})`}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "details" && (
              <div>
                <p style={{ marginBottom: "1rem" }}>{selectedProduct.desc}</p>
                <p>{selectedProduct.details}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <table className="specs-table">
                <tbody>
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "reviews" && (
              <div>
                {[
                  { name: "Priya S.", stars: 5, text: "Absolutely love this! The quality is outstanding and it looks gorgeous in my kitchen.", date: "Mar 8, 2026" },
                  { name: "Rahul M.", stars: 5, text: "Exactly as described. Fast delivery and very well packaged. Will buy again.", date: "Mar 5, 2026" },
                  { name: "Anita P.", stars: 4, text: "Great product overall. Slightly smaller than I expected but still very useful.", date: "Feb 28, 2026" },
                ].map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <span className="reviewer">{r.name}</span>
                      <span className="review-stars">{"★".repeat(r.stars)}</span>
                    </div>
                    <p className="review-text">{r.text}</p>
                    <p className="review-date">{r.date} · Verified Purchase</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related">
        <div className="related-inner">
          <h2>You might also like</h2>
          <div className="related-grid">
            {relatedProducts.map(p => (
              <div key={p.id} className="related-card" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <div className="related-image">{p.emoji}</div>
                <div className="related-info">
                  <div className="related-name">{p.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.3rem" }}>{p.category}</div>
                  <div className="related-price">₹{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <a href="/" className="logo">D<span style={{ color: "var(--accent)" }}>-</span>Storz</a>
        <p>© 2024 D-Storz. All rights reserved.</p>
        <p>Made with ♥ in India</p>
      </footer>

      {/* ADDED TO CART TOAST */}
      <div className={`toast ${addedToCart ? "show" : ""}`}>
        ✓ {selectedProduct.name} added to cart!
      </div>
    </>
  )
}