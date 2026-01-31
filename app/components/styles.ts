export const printStylesheet = `
  body { font-family: Arial, sans-serif; margin: 20px; }
  .print-header { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 2px solid #000; padding: 8px; vertical-align: top; }
  thead th { background-color: #e5e7eb; color: #000; }
  tr:nth-child(odd) { background: #f8fafc; }
  .text-center { text-align: center; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
  .bg-gray-100 { background-color: #f5f5f5; }
  .bg-white { background: #ffffff; }
  .text-red-500 { color: #ef4444; }
  .border-2 { border-width: 2px; }
  .border-black { border-color: #000; }
  .rounded-3xl { border-radius: 1.5rem; }
  .rounded, .rounded-lg { border-radius: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .w-full { width: 100%; }
  .table-fixed { table-layout: fixed; }
  .align-top { vertical-align: top; }
  .print-area { box-shadow: none !important; }
  @page { margin: 16mm; }
  @media print { body { margin: 0; } }
  .print-header img { object-fit: contain; border-radius: 9999px; }
`;