// components/ui/InvoicePrint.js  — Premium printable invoice

export default function InvoicePrint({ invoice, settings = {} }) {
  const {
    invoiceNumber, customerName, customerPhone, customerAddress,
    items = [], subTotal = 0, discountAmount = 0, taxAmount = 0,
    grandTotal = 0, taxPercent = 5, paymentStatus, notes, date, createdAt,
  } = invoice

  const shop = {
    shopName:  settings?.shopName  || 'SANKIRTHI DESIGNERS',
    ownerName: settings?.ownerName || 'VASANTHAMANI S',
    gstNumber: settings?.gstNumber || '9785425325605',
    phone:     settings?.phone     || '9787384280',
    address:   settings?.address   || 'Coimbatore',
    email:     settings?.email     || 'vasanthamani420@gmail.com',
    logoUrl:   settings?.logoUrl   || '',
    qrCodeUrl: settings?.qrCodeUrl || '',
  }

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0)

  const invoiceDate = date
    ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  const statusColor = {
    paid:    { bg: '#dcfce7', color: '#166534', border: '#86efac' },
    partial: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    pending: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  }[paymentStatus] || { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' }

  const s = { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1a1a', lineHeight: '1.5' }

  return (
    <div id="invoice-print" style={{ background:'white', ...s, maxWidth:'800px', margin:'0 auto', padding:'32px' }}>

      {/* Header */}
      <div style={{ borderBottom: '3px solid #B8960C', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px' }}>
          <div style={{ flex: 1 }}>
            {shop.logoUrl && (
              <img src={shop.logoUrl} alt="Logo" style={{ height:'60px', marginBottom:'8px', objectFit:'contain' }} />
            )}
            <h1 style={{ fontSize:'22px', fontWeight:'bold', color:'#B8960C', letterSpacing:'2px', margin:'0 0 4px' }}>
              {shop.shopName}
            </h1>
            <p style={{ color:'#555', margin:'2px 0', fontSize:'12px' }}>Prop: {shop.ownerName}</p>
            <p style={{ color:'#555', margin:'2px 0', fontSize:'12px' }}>{shop.address}</p>
            <p style={{ color:'#555', margin:'2px 0', fontSize:'12px' }}>📞 {shop.phone} | ✉ {shop.email}</p>
            <p style={{ color:'#555', margin:'4px 0 0', fontSize:'11px' }}><strong>GSTIN:</strong> {shop.gstNumber}</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ background:'#B8960C', color:'white', padding:'8px 20px', borderRadius:'4px', marginBottom:'12px' }}>
              <h2 style={{ margin:0, fontSize:'18px', letterSpacing:'3px', fontWeight:'bold' }}>INVOICE</h2>
            </div>
            <p style={{ margin:'2px 0', fontSize:'12px', color:'#555' }}><strong style={{ color:'#1a1a1a' }}>Invoice No:</strong> {invoiceNumber}</p>
            <p style={{ margin:'2px 0', fontSize:'12px', color:'#555' }}><strong style={{ color:'#1a1a1a' }}>Date:</strong> {invoiceDate}</p>
            <div style={{ marginTop:'8px', padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold',
              background: statusColor.bg, color: statusColor.color, border: `1px solid ${statusColor.border}` }}>
              {paymentStatus?.toUpperCase() || 'PENDING'}
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom:'20px', background:'#fafafa', padding:'12px 16px', borderRadius:'6px', border:'1px solid #e5e5e5' }}>
        <p style={{ fontSize:'10px', color:'#B8960C', letterSpacing:'2px', fontWeight:'bold', margin:'0 0 6px' }}>BILL TO</p>
        <p style={{ fontSize:'15px', fontWeight:'bold', color:'#1a1a1a', margin:'0 0 4px' }}>{customerName}</p>
        {customerPhone && <p style={{ color:'#555', margin:'2px 0', fontSize:'12px' }}>📞 {customerPhone}</p>}
        {customerAddress && <p style={{ color:'#555', margin:'2px 0', fontSize:'12px' }}>{customerAddress}</p>}
      </div>

      {/* Items Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'16px' }}>
        <thead>
          <tr style={{ background:'#1a1a1a', color:'white' }}>
            {['#','DESCRIPTION','QTY','RATE (₹)','AMOUNT (₹)'].map(h => (
              <th key={h} style={{ padding:'10px 12px', textAlign: h==='#'||h==='QTY' ? 'center' : h.includes('₹') ? 'right' : 'left', fontSize:'11px', letterSpacing:'1px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ background: i%2===0 ? 'white' : '#fafafa', borderBottom:'1px solid #e5e5e5' }}>
              <td style={{ padding:'10px 12px', color:'#888', textAlign:'center' }}>{i+1}</td>
              <td style={{ padding:'10px 12px', color:'#1a1a1a' }}>{item.description}</td>
              <td style={{ padding:'10px 12px', textAlign:'center', color:'#555' }}>{item.qty}</td>
              <td style={{ padding:'10px 12px', textAlign:'right', color:'#555' }}>{Number(item.rate||0).toFixed(2)}</td>
              <td style={{ padding:'10px 12px', textAlign:'right', color:'#1a1a1a', fontWeight:'600' }}>{Number(item.amount||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals + QR */}
      <div style={{ display:'flex', justifyContent:'space-between', gap:'24px', marginBottom:'20px', flexWrap:'wrap' }}>
        {/* QR Code */}
        <div>
          {shop.qrCodeUrl ? (
            <div style={{ border:'1px solid #e5e5e5', borderRadius:'8px', padding:'12px', textAlign:'center', width:'180px' }}>
              <p style={{ fontSize:'11px', color:'#B8960C', fontWeight:'bold', letterSpacing:'1px', margin:'0 0 8px' }}>SCAN TO PAY</p>
              <img src={shop.qrCodeUrl} alt="Pay QR" style={{ width:'120px', height:'120px', objectFit:'contain' }} />
              <p style={{ fontSize:'10px', color:'#888', margin:'6px 0 0' }}>UPI Payment</p>
            </div>
          ) : (
            <div style={{ border:'1px dashed #ccc', borderRadius:'8px', padding:'12px', textAlign:'center', width:'160px' }}>
              <p style={{ fontSize:'11px', color:'#aaa', margin:0 }}>Upload QR Code in Settings</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div style={{ minWidth:'220px' }}>
          {[
            { label: 'Subtotal', val: fmt(subTotal) },
            ...(discountAmount > 0 ? [{ label: 'Discount', val: `- ${fmt(discountAmount)}`, red: true }] : []),
            { label: `GST (${taxPercent}%)`, val: fmt(taxAmount) },
          ].map(({ label, val, red }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #e5e5e5', fontSize:'12px' }}>
              <span style={{ color:'#555' }}>{label}</span>
              <span style={{ color: red ? '#dc2626' : '#1a1a1a' }}>{val}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 8px', background:'#1a1a1a', borderRadius:'4px', marginTop:'4px' }}>
            <span style={{ color:'#D4AF37', fontWeight:'bold', fontSize:'13px' }}>GRAND TOTAL</span>
            <span style={{ color:'#D4AF37', fontWeight:'bold', fontSize:'15px' }}>{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>

      {notes && (
        <div style={{ marginBottom:'16px', padding:'8px 14px', borderLeft:'3px solid #B8960C', background:'#fffbeb' }}>
          <p style={{ fontSize:'11px', color:'#888', margin:'0 0 2px' }}>NOTES:</p>
          <p style={{ fontSize:'12px', color:'#555', margin:0 }}>{notes}</p>
        </div>
      )}

      {/* Signatures */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:'30px', paddingTop:'20px', borderTop:'1px solid #e5e5e5' }}>
        <div>
          <p style={{ fontSize:'11px', color:'#888', margin:'0 0 40px' }}>Customer Signature</p>
          <div style={{ borderTop:'1px solid #ccc', width:'160px' }} />
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontSize:'11px', color:'#888', margin:'0 0 4px' }}>For {shop.shopName}</p>
          <div style={{ height:'36px' }} />
          <div style={{ borderTop:'1px solid #ccc', width:'160px', marginLeft:'auto' }} />
          <p style={{ fontSize:'11px', color:'#1a1a1a', margin:'4px 0 0', fontWeight:'bold' }}>Authorized Signatory</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop:'20px', textAlign:'center', borderTop:'2px solid #B8960C', paddingTop:'12px' }}>
        <p style={{ fontSize:'11px', color:'#888', margin:0 }}>
          Thank you for your business! • {shop.shopName} • GSTIN: {shop.gstNumber}
        </p>
        <p style={{ fontSize:'10px', color:'#aaa', margin:'2px 0 0' }}>
          Computer-generated invoice. No physical signature required unless specified.
        </p>
      </div>
    </div>
  )
}
