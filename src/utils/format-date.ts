// export default function formatDate(
//   value: string | number | Date | null | undefined
// ): string | null {
//   if (value == null || value === '') return null;

//   let d;
//   // If value is a number or all-digits string, treat as ms since epoch
//   if (typeof value === 'number' || /^\d+$/.test(String(value).trim())) {
//     d = new Date(Number(value));
//   } else {
//     // Try parsing as date string (ISO preferred). Replace space with 'T' if needed.
//     const s = String(value).trim();
//     // Quick normalization for "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
//     const normalized = s.replace(' ', 'T');
//     d = new Date(normalized);
//   }

//   if (Number.isNaN(d.getTime())) return null; // invalid
//   return d.toISOString().split('T')[0];
// }

export default function formatDate(value: string | number | Date | null | undefined) {
  if (value == null || value === '') return null;

  let d;
  if (typeof value === 'number' || /^\d+$/.test(String(value).trim())) {
    d = new Date(Number(value));
  } else {
    const s = String(value).trim();
    const normalized = s.replace(' ', 'T');
    d = new Date(normalized);
  }

  if (Number.isNaN(d.getTime())) return null;

  const iso = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const [year, month, day] = iso.split('-').map(Number);

  // Wrap in a String object + attach fields
  const result = Object.assign(new String(iso), {
    year,
    month,
    day,
    toString() {
      return iso;
    },
    valueOf() {
      return iso;
    },
  });

  return result;
}

export const monthNames = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
