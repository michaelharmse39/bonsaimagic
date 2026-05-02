'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2, Check, X, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LogoutButton from '@/app/account/LogoutButton'
import { useRouter } from 'next/navigation'

type Address = {
  id: string
  name: string | null
  street: string | null
  suburb: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  country: string | null
  phone: string | null
  is_default: boolean
}

type Props = {
  user: { firstName: string; lastName: string; email: string }
  addresses: Address[]
}

const EMPTY_FORM = { name: '', street: '', suburb: '', city: '', province: '', postalCode: '', country: 'South Africa', phone: '', isDefault: false }

export default function ProfileClient({ user, addresses: initialAddresses }: Props) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)

  // Name editing
  const [editingName, setEditingName] = useState(false)
  const [nameForm, setNameForm] = useState({ firstName: user.firstName, lastName: user.lastName })
  const [nameSaving, setNameSaving] = useState(false)

  // Address editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addrForm, setAddrForm] = useState(EMPTY_FORM)
  const [addrSaving, setAddrSaving] = useState(false)

  async function saveName() {
    setNameSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nameForm),
    })
    setNameSaving(false)
    if (res.ok) { setEditingName(false); router.refresh() }
  }

  function startEditAddress(addr: Address) {
    setEditingId(addr.id)
    setShowAddForm(false)
    setAddrForm({
      name: addr.name ?? '',
      street: addr.street ?? '',
      suburb: addr.suburb ?? '',
      city: addr.city ?? '',
      province: addr.province ?? '',
      postalCode: addr.postal_code ?? '',
      country: addr.country ?? 'South Africa',
      phone: addr.phone ?? '',
      isDefault: addr.is_default,
    })
  }

  async function saveAddress() {
    setAddrSaving(true)
    if (editingId) {
      const res = await fetch(`/api/addresses/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addrForm),
      })
      if (res.ok) {
        const updated: Address = await res.json()
        setAddresses(prev =>
          prev.map(a => a.id === editingId ? updated : addrForm.isDefault ? { ...a, is_default: false } : a)
        )
        setEditingId(null)
      }
    } else {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addrForm),
      })
      if (res.ok) {
        const created: Address = await res.json()
        setAddresses(prev => {
          const base = addrForm.isDefault ? prev.map(a => ({ ...a, is_default: false })) : prev
          return [...base, created]
        })
        setShowAddForm(false)
        setAddrForm(EMPTY_FORM)
      }
    }
    setAddrSaving(false)
  }

  async function deleteAddress(id: string) {
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    if (res.ok) {
      const remaining = addresses.filter(a => a.id !== id)
      // If we deleted the default and there are others, promote the first
      const deletedWasDefault = addresses.find(a => a.id === id)?.is_default
      if (deletedWasDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], is_default: true }
      }
      setAddresses(remaining)
    }
  }

  async function setDefault(id: string) {
    const res = await fetch(`/api/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    })
    if (res.ok) {
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="jp-label mb-1">My Account</p>
          <h1 className="font-(family-name:--font-heading) font-light text-3xl">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* Personal Details */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Personal Details</CardTitle>
            {!editingName && (
              <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-green-600 transition-colors">
                <Pencil size={14} />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingName ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">First name</label>
                  <input
                    value={nameForm.firstName}
                    onChange={e => setNameForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Last name</label>
                  <input
                    value={nameForm.lastName}
                    onChange={e => setNameForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground/40"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveName}
                  disabled={nameSaving}
                  className="inline-flex items-center gap-1.5 text-xs bg-foreground text-background px-3 py-1.5 rounded-sm hover:opacity-80 disabled:opacity-50"
                >
                  <Check size={12} /> {nameSaving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => { setEditingName(false); setNameForm({ firstName: user.firstName, lastName: user.lastName }) }} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Full Name</p>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
                <p>{user.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Addresses</CardTitle>
            {!showAddForm && !editingId && (
              <button
                onClick={() => { setShowAddForm(true); setAddrForm(EMPTY_FORM); setEditingId(null) }}
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
              >
                <Plus size={13} /> Add
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing addresses */}
          {addresses.map((addr) => (
            <div key={addr.id}>
              {editingId === addr.id ? (
                <AddressForm
                  form={addrForm}
                  onChange={setAddrForm}
                  onSave={saveAddress}
                  onCancel={() => setEditingId(null)}
                  saving={addrSaving}
                />
              ) : (
                <div className="flex items-start justify-between gap-3 p-3 border border-border rounded-sm">
                  <div className="text-sm space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {addr.name && <span className="font-medium">{addr.name}</span>}
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                          <Star size={9} fill="currentColor" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">{addr.street}{addr.suburb ? `, ${addr.suburb}` : ''}</p>
                    <p className="text-muted-foreground text-xs">{addr.city}{addr.province ? `, ${addr.province}` : ''} {addr.postal_code}</p>
                    {addr.phone && <p className="text-muted-foreground text-xs">{addr.phone}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.is_default && (
                      <button onClick={() => setDefault(addr.id)} title="Set as default" className="text-muted-foreground hover:text-green-600 transition-colors">
                        <Star size={13} />
                      </button>
                    )}
                    <button onClick={() => startEditAddress(addr)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteAddress(addr.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new address form */}
          {showAddForm && (
            <AddressForm
              form={addrForm}
              onChange={setAddrForm}
              onSave={saveAddress}
              onCancel={() => setShowAddForm(false)}
              saving={addrSaving}
            />
          )}

          {addresses.length === 0 && !showAddForm && (
            <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

type AddrFormType = typeof EMPTY_FORM

function AddressForm({ form, onChange, onSave, onCancel, saving }: {
  form: AddrFormType
  onChange: (f: AddrFormType) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const field = (key: keyof AddrFormType, label: string, placeholder?: string) => (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">{label}</label>
      <input
        value={form[key] as string}
        onChange={e => onChange({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground/40"
      />
    </div>
  )

  return (
    <div className="border border-border rounded-sm p-4 space-y-3">
      {field('name', 'Recipient name (optional)')}
      {field('street', 'Street address', '5 Example Street')}
      <div className="grid grid-cols-2 gap-3">
        {field('suburb', 'Suburb')}
        {field('city', 'City')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('province', 'Province')}
        {field('postalCode', 'Postal code')}
      </div>
      {field('phone', 'Phone (optional)')}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={e => onChange({ ...form, isDefault: e.target.checked })}
          className="rounded"
        />
        Set as default address
      </label>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-xs bg-foreground text-background px-3 py-1.5 rounded-sm hover:opacity-80 disabled:opacity-50"
        >
          <Check size={12} /> {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  )
}
