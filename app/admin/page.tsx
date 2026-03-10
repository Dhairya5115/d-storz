"use client"
import { useState } from "react"

// ─── MOCK DATA ───────────────────────────────────────────────
const salesData = [
  { month: "Oct", revenue: 42000, orders: 34 },
  { month: "Nov", revenue: 58000, orders: 47 },
  { month: "Dec", revenue: 91000, orders: 73 },
  { month: "Jan", revenue: 67000, orders: 54 },
  { month: "Feb", revenue: 84000, orders: 68 },
  { month: "Mar", revenue: 112000, orders: 89 },
]

const initialProducts = [
  { id: 1, name: "Ceramic Pour-Over Set", category: "Brewing", price: 1299, stock: 45, status: "Active", emoji: "☕" },
  { id: 2, name: "Cast Iron Skillet 26cm", category: "Cookware", price: 2499, stock: 12, status: "Active", emoji: "🍳" },
  { id: 3, name: "Hinoki Cutting Board", category: "Prep", price: 1899, stock: 0, status: "Out of Stock", emoji: "🪵" },
  { id: 4, name: "Copper Measuring Set", category: "Tools", price: 899, stock: 78, status: "Active", emoji: "🥄" },
  { id: 5, name: "Stoneware Bowl Set", category: "Serveware", price: 1599, stock: 5, status: "Low Stock", emoji: "🥣" },
  { id: 6, name: "Herb Keeper Glass Jar", category: "Storage", price: 649, stock: 34, status: "Active", emoji: "🌿" },
]

const initialOrders = [
  { id: "ORD-1042", customer: "Priya Sharma", email: "priya@gmail.com", amount: 3798, status: "Delivered", date: "Mar 9, 2026", items: 2 },
  { id: "ORD-1041", customer: "Rahul Mehta", email: "rahul@gmail.com", amount: 1299, status: "Shipped", date: "Mar 9, 2026", items: 1 },
  { id: "ORD-1040", customer: "Anita Patel", email: "anita@gmail.com", amount: 5296, status: "Processing", date: "Mar 8, 2026", items: 3 },
  { id: "ORD-1039", customer: "Vikram Singh", email: "vikram@gmail.com", amount: 899, status: "Pending", date: "Mar 8, 2026", items: 1 },
  { id: "ORD-1038", customer: "Meera Nair", email: "meera@gmail.com", amount: 2499, status: "Delivered", date: "Mar 7, 2026", items: 1 },
  { id: "ORD-1037", customer: "Arjun Reddy", email: "arjun@gmail.com", amount: 1948, status: "Cancelled", date: "Mar 7, 2026", items: 2 },
  { id: "ORD-1036", customer: "Kavya Krishnan", email: "kavya@gmail.com", amount: 3198, status: "Delivered", date: "Mar 6, 2026", items: 2 },
  { id: "ORD-1035", customer: "Rohan Gupta", email: "rohan@gmail.com", amount: 649, status: "Shipped", date: "Mar 6, 2026", items: 1 },
]

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
type Tab = "dashboard" | "products" | "orders" | "add-product"

// ─── MINI CHART ──────────────────────────────────────────────
function MiniChart({ data }: { data: typeof salesData }) {
  const max = Math.max(...data.map(d => d.revenue))
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div
            style={{
              width: "100%",
              height: `${(d.revenue / max) * 70}px`,
              background: i === data.length - 1 ? "var(--accent)" : "var(--border)",
              borderRadius: "4px 4px 0 0",
              transition: "height 0.3s",
            }}
          />
          <span style={{ fontSize: "0.6rem", color: "var(--muted)" }}>{d.month}</span>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard")
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [orderFilter, setOrderFilter] = useState("All")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [newProduct, setNewProduct] = useState({ name: "", category: "Cookware", price: "", stock: "", emoji: "🍳", desc: "" })
  const [saved, setSaved] = useState(false)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = orders.length
  const activeProducts = products.filter(p => p.status === "Active").length
  const pendingOrders = orders.filter(o => o.status === "Pending").length

  const filteredOrders = orderFilter === "All"
    ? orders
    : orders.filter(o => o.status === orderFilter)

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    setEditingOrder(null)
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Delete this product?")) setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      status: Number(newProduct.stock) === 0 ? "Out of Stock" : Number(newProduct.stock) < 10 ? "Low Stock" : "Active",
      emoji: newProduct.emoji,
    }
    setProducts(prev => [product, ...prev])
    setNewProduct({ name: "", category: "Cookware", price: "", stock: "", emoji: "🍳", desc: "" })
    setSaved(true)
    setTimeout(() => { setSaved(false); setTab("products") }, 1500)
  }

  const statusColor = (s: string) => {
    if (s === "Delivered") return "#2d6a4f"
    if (s === "Shipped") return "#1a6496"
    if (s === "Processing") return "#b45309"
    if (s === "Pending") return "#6b7280"
    if (s === "Cancelled") return "#dc2626"
    return "#6b7280"
  }

  const stockColor = (s: string) => {
    if (s === "Active") return "#2d6a4f"
    if (s === "Low Stock") return "#b45309"
    return "#dc2626"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f4f3f0;
          color: #1a1a18;
        }

        :root {
          --cream: #fafaf8;
          --warm: #f2ede6;
          --border: #e8e3db;
          --text: #1a1a18;
          --muted: #8a8680;
          --accent: #c17f3e;
          --sidebar: #1a1a18;
          --sidebar-text: rgba(250,250,248,0.7);
          --sidebar-active: rgba(193,127,62,0.15);
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          width: 240px;
          background: var(--sidebar);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.3s;
        }

        .sidebar-logo {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-logo span { color: var(--accent); }
        .sidebar-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          background: var(--accent);
          color: white;
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          letter-spacing: 0.05em;
          margin-left: auto;
        }

        .sidebar-section {
          padding: 1rem 0.75rem;
          flex: 1;
        }

        .sidebar-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.25);
          padding: 0 0.75rem;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          color: var(--sidebar-text);
          cursor: pointer;
          font-size: 0.88rem;
          transition: all 0.15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          margin-bottom: 2px;
        }

        .sidebar-link:hover { background: rgba(255,255,255,0.06); color: white; }
        .sidebar-link.active { background: var(--sidebar-active); color: var(--accent); }
        .sidebar-link .icon { font-size: 1rem; width: 20px; text-align: center; }

        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }

        /* MAIN */
        .main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .topbar {
          background: var(--cream);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .notification-dot {
          position: relative;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .dot {
          position: absolute;
          top: -2px; right: -2px;
          width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 50%;
        }

        .content { padding: 2rem; }

        /* CARDS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
        }

        .stat-card.blue::before { background: #2979ff; }
        .stat-card.green::before { background: #2d6a4f; }
        .stat-card.orange::before { background: #b45309; }

        .stat-card-icon {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .stat-card-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .stat-card-label {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .stat-card-change {
          font-size: 0.75rem;
          color: #2d6a4f;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        /* GRID LAYOUT */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .panel {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .panel-action {
          font-size: 0.78rem;
          color: var(--accent);
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }

        /* TABLE */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        th {
          text-align: left;
          padding: 0.6rem 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
          font-weight: 500;
        }

        td {
          padding: 0.85rem 0.75rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--warm); }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .product-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .product-emoji-cell {
          width: 36px;
          height: 36px;
          background: var(--warm);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .action-btn {
          background: none;
          border: 1px solid var(--border);
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          color: var(--text);
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .action-btn:hover { background: var(--warm); }
        .action-btn.danger { color: #dc2626; border-color: #fca5a5; }
        .action-btn.danger:hover { background: #fef2f2; }
        .action-btn.primary { background: var(--text); color: white; border-color: var(--text); }
        .action-btn.primary:hover { background: var(--accent); border-color: var(--accent); }

        /* FILTER TABS */
        .filter-tabs {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-tab {
          background: transparent;
          border: 1px solid var(--border);
          padding: 0.35rem 0.85rem;
          border-radius: 100px;
          font-size: 0.78rem;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .filter-tab:hover { border-color: var(--text); color: var(--text); }
        .filter-tab.active { background: var(--text); border-color: var(--text); color: white; }

        /* ADD PRODUCT FORM */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group.full { grid-column: 1 / -1; }

        label {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        input, select, textarea {
          border: 1px solid var(--border);
          background: var(--warm);
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }

        input:focus, select:focus, textarea:focus { border-color: var(--accent); }
        textarea { resize: vertical; min-height: 80px; }

        .save-btn {
          background: var(--text);
          color: white;
          border: none;
          padding: 0.85rem 2.5rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover { background: var(--accent); }
        .save-btn.success { background: #2d6a4f; }

        /* STATUS SELECT */
        .status-select {
          border: 1px solid var(--border);
          background: white;
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          font-size: 0.78rem;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        /* RECENT ORDERS IN DASHBOARD */
        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.83rem;
        }

        .order-row:last-child { border-bottom: none; }

        /* TOP PRODUCTS */
        .top-product {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.83rem;
        }

        .top-product:last-child { border-bottom: none; }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
        }

        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .main { margin-left: 0; }
          .dashboard-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            D<span>-</span>Storz
            <span className="sidebar-badge">ADMIN</span>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Main</div>
            {[
              { id: "dashboard", icon: "📊", label: "Dashboard" },
              { id: "products", icon: "📦", label: "Products" },
              { id: "orders", icon: "🛒", label: "Orders" },
              { id: "add-product", icon: "➕", label: "Add Product" },
            ].map(item => (
              <button
                key={item.id}
                className={`sidebar-link ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id as Tab)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="sidebar-label">Store</div>
            {[
              { icon: "👥", label: "Customers" },
              { icon: "⭐", label: "Reviews" },
              { icon: "🎁", label: "Discounts" },
              { icon: "⚙️", label: "Settings" },
            ].map(item => (
              <button key={item.label} className="sidebar-link">
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>Dhairya Shah</div>
            <div>Admin · D-Storz</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-title">
              {tab === "dashboard" && "Dashboard"}
              {tab === "products" && "Products"}
              {tab === "orders" && "Orders"}
              {tab === "add-product" && "Add Product"}
            </div>
            <div className="topbar-right">
              <div className="notification-dot">🔔<span className="dot" /></div>
              <div className="admin-avatar">DS</div>
            </div>
          </div>

          <div className="content">

            {/* ─── DASHBOARD TAB ─── */}
            {tab === "dashboard" && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-icon">💰</div>
                    <div className="stat-card-value">₹{(totalRevenue / 1000).toFixed(0)}K</div>
                    <div className="stat-card-label">Total Revenue</div>
                    <div className="stat-card-change">↑ 33% vs last month</div>
                  </div>
                  <div className="stat-card blue">
                    <div className="stat-card-icon">🛒</div>
                    <div className="stat-card-value">{totalOrders}</div>
                    <div className="stat-card-label">Total Orders</div>
                    <div className="stat-card-change">↑ 18% vs last month</div>
                  </div>
                  <div className="stat-card green">
                    <div className="stat-card-icon">📦</div>
                    <div className="stat-card-value">{activeProducts}</div>
                    <div className="stat-card-label">Active Products</div>
                    <div className="stat-card-change">2 need restocking</div>
                  </div>
                  <div className="stat-card orange">
                    <div className="stat-card-icon">⏳</div>
                    <div className="stat-card-value">{pendingOrders}</div>
                    <div className="stat-card-label">Pending Orders</div>
                    <div className="stat-card-change" style={{ color: "#b45309" }}>Needs attention</div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Revenue Overview</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Last 6 months</span>
                    </div>
                    <MiniChart data={salesData} />
                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem" }}>
                      {salesData.map((d, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: i === salesData.length - 1 ? "var(--accent)" : "var(--text)" }}>
                            ₹{(d.revenue / 1000).toFixed(0)}K
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{d.orders} orders</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Top Products</span>
                    </div>
                    {initialProducts.slice(0, 5).map((p, i) => (
                      <div key={p.id} className="top-product">
                        <span style={{ fontSize: "1.1rem" }}>{p.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                          <div className="progress-bar" style={{ marginTop: "4px" }}>
                            <div className="progress-fill" style={{ width: `${100 - i * 15}%` }} />
                          </div>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>
                          ₹{p.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Recent Orders</span>
                    <button className="panel-action" onClick={() => setTab("orders")}>View all →</button>
                  </div>
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="order-row">
                      <div>
                        <div style={{ fontWeight: 500 }}>{order.customer}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{order.id} · {order.date}</div>
                      </div>
                      <span
                        className="badge"
                        style={{ background: `${statusColor(order.status)}18`, color: statusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                      <div style={{ fontWeight: 600 }}>₹{order.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ─── PRODUCTS TAB ─── */}
            {tab === "products" && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">All Products ({products.length})</span>
                  <button className="action-btn primary" onClick={() => setTab("add-product")}>+ Add Product</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-name-cell">
                            <div className="product-emoji-cell">{product.emoji}</div>
                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{product.category}</td>
                        <td style={{ fontWeight: 600 }}>₹{product.price.toLocaleString()}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span
                            className="badge"
                            style={{ background: `${stockColor(product.status)}18`, color: stockColor(product.status) }}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button className="action-btn">Edit</button>
                            <button className="action-btn danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ─── ORDERS TAB ─── */}
            {tab === "orders" && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">All Orders ({orders.length})</span>
                </div>
                <div className="filter-tabs">
                  {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(f => (
                    <button
                      key={f}
                      className={`filter-tab ${orderFilter === f ? "active" : ""}`}
                      onClick={() => setOrderFilter(f)}
                    >
                      {f}
                      {f !== "All" && (
                        <span style={{ marginLeft: "0.3rem", opacity: 0.7 }}>
                          ({orders.filter(o => o.status === f).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600 }}>{order.id}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{order.customer}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{order.email}</div>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{order.items} item{order.items > 1 ? "s" : ""}</td>
                        <td style={{ fontWeight: 600 }}>₹{order.amount.toLocaleString()}</td>
                        <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{order.date}</td>
                        <td>
                          {editingOrder === order.id ? (
                            <select
                              className="status-select"
                              defaultValue={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              autoFocus
                            >
                              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className="badge"
                              style={{ background: `${statusColor(order.status)}18`, color: statusColor(order.status), cursor: "pointer" }}
                              onClick={() => setEditingOrder(order.id)}
                              title="Click to change status"
                            >
                              {order.status} ✎
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ─── ADD PRODUCT TAB ─── */}
            {tab === "add-product" && (
              <div className="panel" style={{ maxWidth: 700 }}>
                <div className="panel-header">
                  <span className="panel-title">Add New Product</span>
                </div>
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Product Name</label>
                    <input
                      placeholder="e.g. Japanese Steel Chef Knife"
                      value={newProduct.name}
                      onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    >
                      {["Cookware", "Prep", "Tools", "Brewing", "Serveware", "Storage"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Emoji Icon</label>
                    <input
                      placeholder="e.g. 🔪"
                      value={newProduct.emoji}
                      onChange={e => setNewProduct(p => ({ ...p, emoji: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1499"
                      value={newProduct.price}
                      onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={newProduct.stock}
                      onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe the product..."
                      value={newProduct.desc}
                      onChange={e => setNewProduct(p => ({ ...p, desc: e.target.value }))}
                    />
                  </div>
                </div>

                {/* PREVIEW */}
                {newProduct.name && (
                  <div style={{
                    background: "var(--warm)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center"
                  }}>
                    <div style={{ fontSize: "2rem" }}>{newProduct.emoji || "📦"}</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{newProduct.name}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{newProduct.category} · ₹{Number(newProduct.price).toLocaleString() || "—"}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--muted)" }}>Preview</span>
                  </div>
                )}

                <button
                  className={`save-btn ${saved ? "success" : ""}`}
                  onClick={handleAddProduct}
                >
                  {saved ? "✓ Product Added!" : "Add Product"}
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  )
}