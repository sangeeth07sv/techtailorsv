// lib/firestore.js
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, where,
  serverTimestamp, setDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// ── CUSTOMERS ──────────────────────────────────────────────────────────────
export async function getCustomers() {
  const q = query(collection(db, 'customers'), orderBy('name', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function getCustomer(id) {
  const snap = await getDoc(doc(db, 'customers', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function addCustomer(data) {
  return addDoc(collection(db, 'customers'), { ...data, createdAt: serverTimestamp() })
}
export async function updateCustomer(id, data) {
  return updateDoc(doc(db, 'customers', id), { ...data, updatedAt: serverTimestamp() })
}
export async function deleteCustomer(id) {
  return deleteDoc(doc(db, 'customers', id))
}

// ── INVOICES ───────────────────────────────────────────────────────────────
export async function getInvoices() {
  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function getInvoice(id) {
  const snap = await getDoc(doc(db, 'invoices', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function addInvoice(data) {
  const snap = await getDocs(collection(db, 'invoices'))
  const num  = String(snap.size + 1).padStart(4, '0')
  return addDoc(collection(db, 'invoices'), {
    ...data,
    invoiceNumber: `INV-${num}`,
    createdAt: serverTimestamp(),
  })
}
export async function updateInvoice(id, data) {
  return updateDoc(doc(db, 'invoices', id), { ...data, updatedAt: serverTimestamp() })
}
export async function deleteInvoice(id) {
  return deleteDoc(doc(db, 'invoices', id))
}

// ── ORDERS ─────────────────────────────────────────────────────────────────
export async function getOrders() {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function addOrder(data) {
  return addDoc(collection(db, 'orders'), { ...data, createdAt: serverTimestamp() })
}
export async function updateOrder(id, data) {
  return updateDoc(doc(db, 'orders', id), { ...data, updatedAt: serverTimestamp() })
}
export async function deleteOrder(id) {
  return deleteDoc(doc(db, 'orders', id))
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  shopName:   'SANKIRTHI DESIGNERS',
  ownerName:  'VASANTHAMANI S',
  gstNumber:  '9785425325605',
  phone:      '9787384280',
  address:    'Coimbatore',
  email:      'vasanthamani420@gmail.com',
  taxPercent: 5,
  logoUrl:    '',
  qrCodeUrl:  '',
}
export async function getSettings() {
  const snap = await getDoc(doc(db, 'settings', 'shop'))
  return snap.exists() ? snap.data() : DEFAULT_SETTINGS
}
export async function saveSettings(data) {
  const ref = doc(db, 'settings', 'shop')
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  }
  return setDoc(ref, { ...data, createdAt: serverTimestamp() })
}

// ── DASHBOARD STATS ────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [custSnap, invSnap, ordSnap] = await Promise.all([
    getDocs(collection(db, 'customers')),
    getDocs(collection(db, 'invoices')),
    getDocs(collection(db, 'orders')),
  ])
  const invoices = invSnap.docs.map(d => d.data())
  const totalRevenue = invoices
    .filter(i => i.paymentStatus === 'paid')
    .reduce((s, i) => s + (i.grandTotal || 0), 0)
  const pendingDeliveries = ordSnap.docs
    .map(d => d.data())
    .filter(o => o.status !== 'delivered').length

  return {
    totalCustomers:   custSnap.size,
    totalOrders:      ordSnap.size,
    totalRevenue,
    pendingDeliveries,
  }
}
