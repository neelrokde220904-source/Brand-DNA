export async function exportToPDF(brandName) {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');
  const el = document.getElementById('dna-card');
  if (!el) return;
  const canvas = await html2canvas(el, {
    backgroundColor: '#0a0008',
    scale: 2,
    useCORS: true
  });
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2]
  });
  pdf.addImage(
    canvas.toDataURL('image/png'),
    'PNG',
    0, 0,
    canvas.width / 2,
    canvas.height / 2
  );
  pdf.save(`${brandName.toLowerCase().replace(/\s+/g, '-')}-design-dna.pdf`);
}

export function exportToJSON(brand) {
  const blob = new Blob([JSON.stringify(brand, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${brand.brand.toLowerCase().replace(/\s+/g, '-')}-design-dna.json`;
  a.click();
  URL.revokeObjectURL(url);
}
