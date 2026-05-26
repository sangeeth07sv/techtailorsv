'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Modal, ConfirmDialog, EmptyState, PageHeader, SearchBar, StatusBadge, LoadingSkeleton } from '../../components/ui'
import { getInvoices, addInvoice, updateInvoice, deleteInvoice, getCustomers, getSettings } from '../../lib/firestore'
import InvoicePrint from '../../components/ui/InvoicePrint'
import toast from 'react-hot-toast'
import { FileText, Plus, Trash2, Eye, X } from 'lucide-react'

const EMPTY_ITEM = { description:'', qty:1, rate:0, amount:0 }
const mkForm = (tax=5) => ({
  customerId:'', customerName:'', customerPhone:'', customerAddress:'',
  items:[{ ...EMPTY_ITEM }], discount:0, taxPercent:tax,
  paymentStatus:'pending', notes:'',
  date: new Date().toISOString().split('T')[0],
})

function fmtCur(n) {
  return new Intl.NumberFormat('en-IN',{ style:'currency', currency:'INR', maximumFractionDigits:2 }).format(n||0)
}
function fmtDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' })
}

export default function BillingPage() {
  const [invoices,  setInvoices]  = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [customers, setCusts]     = useState([])
  const [settings,  setSettings]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showNew,   setShowNew]   = useState(false)
  const [showView,  setShowView]  = useState(null)
  const [showDel,   setShowDel]   = useState(false)
  const [delId,     setDelId]     = useState(null)
  const [form,      setForm]      = useState(mkForm())
  const [saving,    setSaving]    = useState(false)

  useEffect(() => { loadAll() }, [])
  useEffect(() => {
    if (!search) { setFiltered(invoices); return }
    const t = search.toLowerCase()
    setFiltered(invoices.filter(i => i.customerName?.toLowerCase().includes(t) || i.invoiceNumber?.toLowerCase().includes(t)))
  }, [search, invoices])

  const loadAll = async () => {
    try {
      const [inv, custs, sett] = await Promise.all([getInvoices(), getCustomers(), getSettings()])
      setInvoices(inv); setFiltered(inv); setCusts(custs); setSettings(sett)
      setForm(mkForm(sett?.taxPercent || 5))
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const pickCustomer = (id) => {
    const c = customers.find(c => c.id === id)
    if (!c) return
    setForm(f => ({ ...f, customerId:id, customerName:c.name, customerPhone:c.phone||'', customerAddress:c.address||'' }))
  }

  const setItem = (i, field, val) => setForm(f => {
    const items = [...f.items]
    items[i] = { ...items[i], [field]: val }
    if (field === 'qty' || field === 'rate') items[i].amount = Number(items[i].qty) * Number(items[i].rate)
    return { ...f, items }
  })
  const addItem    = () => setForm(f => ({ ...f, items:[...f.items,{...EMPTY_ITEM}] }))
  const removeItem = (i) => setForm(f => ({ ...f, items:f.items.filter((_,idx)=>idx!==i) }))

  const sub     = form.items.reduce((s,i)=>s+Number(i.amount||0), 0)
  const disc    = Number(form.discount||0)
  const taxAmt  = ((sub - disc) * Number(form.taxPercent||0)) / 100
  const total   = sub - disc + taxAmt

  const save = async () => {
    if (!form.customerId) { toast.error('Select a customer'); return }
    if (!form.items[0]?.description) { toast.error('Add at least one item'); return }
    setSaving(true)
    try {
      await addInvoice({ ...form, subTotal:sub, discountAmount:disc, taxAmount:taxAmt, grandTotal:total })
      toast.success('Invoice created!')
      setShowNew(false); setForm(mkForm(settings?.taxPercent||5)); loadAll()
    } catch { toast.error('Failed to create invoice') }
    finally { setSaving(false) }
  }

  const del = async () => {
    try { await deleteInvoice(delId); toast.success('Deleted'); setShowDel(false); loadAll() }
    catch { toast.error('Delete failed') }
  }

  const updateStatus = async (id, s) => {
    try { await updateInvoice(id,{ paymentStatus:s }); toast.success('Updated'); loadAll() }
    catch { toast.error('Update failed') }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Billing" subtitle={`${invoices.length} invoices`}
        action={<button onClick={() => setShowNew(true)} className="btn-gold flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>New Invoice</button>} />

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customer, invoice #..." />
      </div>

      {loading ? <LoadingSkeleton rows={6} /> : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices yet" message="Create your first invoice"
          action={<button onClick={() => setShowNew(true)} className="btn-gold text-sm">Create Invoice</button>} />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block card p-0 overflow-hidden">
            <table className="w-full table-dark">
              <thead><tr>
                <th className="text-left">Invoice #</th><th className="text-left">Customer</th>
                <th className="text-left">Date</th><th className="text-right">Amount</th>
                <th className="text-center">Payment</th><th className="text-center">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-mono text-gold-500 text-sm">{inv.invoiceNumber}</td>
                    <td className="text-dark-100 font-medium">{inv.customerName}</td>
                    <td>{fmtDate(inv.createdAt)}</td>
                    <td className="text-right font-semibold text-dark-100">{fmtCur(inv.grandTotal)}</td>
                    <td className="text-center">
                      <select value={inv.paymentStatus} onChange={e=>updateStatus(inv.id,e.target.value)}
                        className="bg-dark-700 border border-dark-600 text-dark-200 rounded-lg px-2 py-1 text-xs cursor-pointer">
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setShowView({ ...inv, settings })} className="p-1.5 text-dark-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"><Eye className="w-4 h-4"/></button>
                        <button onClick={() => { setDelId(inv.id); setShowDel(true) }} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map(inv => (
              <div key={inv.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-gold-500 text-xs">{inv.invoiceNumber}</p>
                    <p className="text-dark-100 font-medium text-sm">{inv.customerName}</p>
                    <p className="text-dark-400 text-xs">{fmtDate(inv.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-dark-100 font-semibold">{fmtCur(inv.grandTotal)}</p>
                    <StatusBadge status={inv.paymentStatus} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setShowView({ ...inv, settings })} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-600 text-dark-300 text-xs hover:border-gold-500/40 hover:text-gold-400 transition-colors">
                    <Eye className="w-3.5 h-3.5"/> View
                  </button>
                  <button onClick={() => { setDelId(inv.id); setShowDel(true) }} className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* New Invoice Modal */}
      {showNew && (
        <Modal title="New Invoice" onClose={() => setShowNew(false)} size="xl">
          <div className="space-y-5">
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Select Customer *</label>
              <select className="input-dark" value={form.customerId} onChange={e=>pickCustomer(e.target.value)}>
                <option value="">Choose a customer...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Date</label>
                <input type="date" className="input-dark" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Payment Status</label>
                <select className="input-dark" value={form.paymentStatus} onChange={e=>setForm(f=>({...f,paymentStatus:e.target.value}))}>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-dark-300 text-sm">Items</label>
                <button onClick={addItem} className="text-gold-500 text-xs hover:text-gold-400 flex items-center gap-1"><Plus className="w-3 h-3"/>Add Item</button>
              </div>
              <div className="grid grid-cols-12 gap-2 text-dark-500 text-xs px-1 mb-1">
                <span className="col-span-5">Description</span><span className="col-span-2">Qty</span>
                <span className="col-span-2">Rate</span><span className="col-span-2">Amt</span><span className="col-span-1"/>
              </div>
              {form.items.map((item,i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center mb-2">
                  <input className="input-dark col-span-5 text-sm py-2" placeholder="Description" value={item.description} onChange={e=>setItem(i,'description',e.target.value)} />
                  <input className="input-dark col-span-2 text-sm py-2" type="number" min="1" value={item.qty} onChange={e=>setItem(i,'qty',e.target.value)} />
                  <input className="input-dark col-span-2 text-sm py-2" type="number" min="0" value={item.rate} onChange={e=>setItem(i,'rate',e.target.value)} />
                  <div className="col-span-2 text-dark-300 text-sm px-1">₹{Number(item.amount||0).toFixed(0)}</div>
                  <button onClick={()=>removeItem(i)} className="col-span-1 text-dark-500 hover:text-red-400 flex justify-center"><X className="w-4 h-4"/></button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-dark-900 rounded-xl p-4 space-y-2">
              {[['Subtotal', fmtCur(sub)],].map(([l,v])=>(
                <div key={l} className="flex justify-between text-sm"><span className="text-dark-400">{l}</span><span className="text-dark-200">{v}</span></div>
              ))}
              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-dark-400">Discount (₹)</span>
                <input type="number" min="0" className="input-dark w-32 text-sm py-1.5 text-right" value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} />
              </div>
              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-dark-400">GST (%)</span>
                <input type="number" min="0" max="100" className="input-dark w-32 text-sm py-1.5 text-right" value={form.taxPercent} onChange={e=>setForm(f=>({...f,taxPercent:e.target.value}))} />
              </div>
              <div className="flex justify-between text-sm"><span className="text-dark-400">Tax Amount</span><span className="text-dark-200">{fmtCur(taxAmt)}</span></div>
              <div className="flex justify-between pt-2 border-t border-dark-700">
                <span className="text-dark-100 font-semibold" style={{ fontFamily:'Playfair Display, serif' }}>Grand Total</span>
                <span className="text-gold-500 font-bold text-lg" style={{ fontFamily:'Playfair Display, serif' }}>{fmtCur(total)}</span>
              </div>
            </div>

            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Notes</label>
              <textarea className="input-dark" rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Additional notes..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-600 text-dark-300 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"/>}
                Create Invoice
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice View Modal */}
      {showView && (
        <Modal title="Invoice Preview" onClose={() => setShowView(null)} size="xl">
          <InvoicePrint invoice={showView} settings={showView.settings} />
          <div className="flex gap-3 mt-4 no-print">
            <button onClick={() => window.print()} className="btn-gold flex-1 py-2.5">🖨 Print Invoice</button>
          </div>
        </Modal>
      )}

      {showDel && <ConfirmDialog message="Permanently delete this invoice?" onConfirm={del} onCancel={() => setShowDel(false)} />}
    </DashboardLayout>
  )
}
