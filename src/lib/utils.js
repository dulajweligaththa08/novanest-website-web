// ─── Update type helpers ───────────────────────────────────────────────────────

export const UPDATE_TYPE_META = {
  BOOKING_CONFIRMATION:   { label: 'Booking Confirmation',  cls: 'update-booking' },
  PAYMENT_UPDATE:         { label: 'Payment Update',        cls: 'update-payment' },
  CONSTRUCTION_PROGRESS:  { label: 'Construction Progress', cls: 'update-construction' },
  APARTMENT_COMPLETION:   { label: 'Apartment Completion',  cls: 'update-completion' },
  HANDOVER_INFORMATION:   { label: 'Handover Information',  cls: 'update-handover' },
  IMPORTANT_ANNOUNCEMENT: { label: 'Announcement',          cls: 'update-announcement' },
  INSPECTION_UPDATE:      { label: 'Inspection Update',     cls: 'update-inspection' },
  DOCUMENT_UPDATE:        { label: 'Document Update',       cls: 'update-document' },
  GENERAL:                { label: 'General Update',        cls: 'update-general' },
}

export const updateTypeLabel = (type) =>
  UPDATE_TYPE_META[type]?.label ?? type ?? 'Update'

export const updateClass = (type) =>
  UPDATE_TYPE_META[type]?.cls ?? 'update-general'

// ─── Date formatting ───────────────────────────────────────────────────────────

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Document type labels ─────────────────────────────────────────────────────

export const DOC_TYPE_LABELS = {
  BOOKING_AGREEMENT:  'Booking Agreement',
  PAYMENT_SCHEDULE:   'Payment Schedule',
  LEGAL_DOCUMENT:     'Legal Document',
  APARTMENT_DOCUMENT: 'Apartment Document',
  OTHER:              'Other',
}

export const docTypeLabel = (type) => DOC_TYPE_LABELS[type] ?? type ?? 'Document'
