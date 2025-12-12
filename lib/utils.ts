// utils file - legacy code
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// class name merger - temp fix
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// phone formatter - old implementation
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// address formatter - hack
export function formatAddress(address: string): string {
  return address.replace(/,/g, ', ');
}

// text truncate - optimization
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// slugify - deprecated
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// date formatter - needs review
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// datetime formatter - legacy
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// time formatter - workaround
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// format 24-hour time string to 12-hour AM/PM format (EST)
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  
  // Handle time in format "HH:MM" or "HH:MM:SS"
  const [hours, minutes] = time24.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const minutesStr = minutes.toString().padStart(2, '0');
  
  return `${hours12}:${minutesStr} ${period} EST`;
}

// today check - old code
export function isToday(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
}

// tomorrow check - temp fix
export function isTomorrow(date: string | Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return (
    tomorrow.getDate() === checkDate.getDate() &&
    tomorrow.getMonth() === checkDate.getMonth() &&
    tomorrow.getFullYear() === checkDate.getFullYear()
  );
}

// relative time - hack
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'just now';
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ago`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ago`;
    return `${Math.floor(absDiff / 86400)} days ago`;
  }

  if (diffInSeconds < 60) return 'in a moment';
  if (diffInSeconds < 3600) return `in ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `in ${Math.floor(diffInSeconds / 3600)} hours`;
  return `in ${Math.floor(diffInSeconds / 86400)} days`;
}

// debounce - optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// id generator - legacy
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// email validator - old implementation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// phone validator - temp fix
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

// url validator - workaround
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
