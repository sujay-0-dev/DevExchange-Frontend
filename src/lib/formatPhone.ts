export const formatPhone = (phone: string): string => {
  // Remove all spaces and dashes
  let cleaned = phone.replace(/[\s\-]/g, '')
  // Add +91 if not present (India)
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = '+' + cleaned
    } else if (cleaned.length === 10) {
      cleaned = '+91' + cleaned
    }
  }
  return cleaned
}
