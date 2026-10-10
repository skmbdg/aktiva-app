/**
 * Helper Utility untuk Kalkulasi Akuntansi Aktiva Tetap (Fixed Assets)
 */

// Format Angka ke Rupiah (IDR)
export const formatRupiah = (number) => {
  if (number === undefined || number === null || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

// Hitung Umur Penggunaan dalam Bulan & Tahun dari Tanggal Beli hingga Sekarang
export const calculateAge = (purchaseDateStr) => {
  if (!purchaseDateStr) return { years: 0, months: 0, totalMonths: 0 };
  const purchase = new Date(purchaseDateStr);
  const now = new Date();
  
  let months = (now.getFullYear() - purchase.getFullYear()) * 12;
  months -= purchase.getMonth();
  months += now.getMonth();
  
  const totalMonths = Math.max(0, months);
  const years = (totalMonths / 12).toFixed(1);
  return { years: parseFloat(years), months: totalMonths % 12, totalMonths };
};

// Hitung Penyusutan Metode Garis Lurus (Straight Line Method)
export const calculateStraightLine = (cost, salvageValue, lifeYears, purchaseDateStr) => {
  const c = Number(cost) || 0;
  const s = Number(salvageValue) || 0;
  const l = Number(lifeYears) || 1;
  
  const annualDepreciation = (c - s) / l;
  const monthlyDepreciation = annualDepreciation / 12;
  
  const { totalMonths } = calculateAge(purchaseDateStr);
  const maxMonths = l * 12;
  const usedMonths = Math.min(totalMonths, maxMonths);
  
  const accumulatedDepreciation = Math.min(c - s, Math.round(monthlyDepreciation * usedMonths));
  const currentBookValue = Math.max(s, c - accumulatedDepreciation);
  
  return {
    annualDepreciation,
    monthlyDepreciation,
    accumulatedDepreciation,
    currentBookValue,
    usedMonths,
    maxMonths,
    isFullyDepreciated: usedMonths >= maxMonths
  };
};

// Hitung Penyusutan Saldo Menurun Ganda (Double Declining Balance)
export const calculateDoubleDeclining = (cost, salvageValue, lifeYears, purchaseDateStr) => {
  const c = Number(cost) || 0;
  const s = Number(salvageValue) || 0;
  const l = Number(lifeYears) || 1;
  
  const rate = (2 / l); // Tarif 2x garis lurus
  const { years } = calculateAge(purchaseDateStr);
  const fullYearsUsed = Math.floor(years);
  
  let currentBookValue = c;
  let accumDep = 0;
  
  for (let year = 1; year <= Math.min(fullYearsUsed, l); year++) {
    let yearDep = currentBookValue * rate;
    if (currentBookValue - yearDep < s) {
      yearDep = Math.max(0, currentBookValue - s);
    }
    accumDep += yearDep;
    currentBookValue -= yearDep;
  }
  
  return {
    annualRatePct: (rate * 100).toFixed(1),
    accumulatedDepreciation: Math.round(accumDep),
    currentBookValue: Math.round(currentBookValue),
    isFullyDepreciated: currentBookValue <= s
  };
};

// Generate Depresiasi Table Schedule (Tahun demi Tahun)
export const generateDepreciationSchedule = (cost, salvageValue, lifeYears, purchaseDateStr, method = 'straight_line') => {
  const c = Number(cost) || 0;
  const s = Number(salvageValue) || 0;
  const l = Number(lifeYears) || 1;
  const startYear = purchaseDateStr ? new Date(purchaseDateStr).getFullYear() : new Date().getFullYear();
  
  const schedule = [];
  let bookValue = c;
  let accumDep = 0;
  
  if (method === 'straight_line') {
    const annualDep = (c - s) / l;
    for (let i = 1; i <= l; i++) {
      let depAmount = annualDep;
      if (bookValue - depAmount < s) {
        depAmount = bookValue - s;
      }
      accumDep += depAmount;
      bookValue -= depAmount;
      
      schedule.push({
        yearIndex: i,
        year: startYear + i - 1,
        beginningBookValue: bookValue + depAmount,
        depreciationExpense: depAmount,
        accumulatedDepreciation: accumDep,
        endingBookValue: bookValue
      });
    }
  } else {
    // Double Declining
    const rate = 2 / l;
    for (let i = 1; i <= l; i++) {
      let depAmount = bookValue * rate;
      if (bookValue - depAmount < s) {
        depAmount = Math.max(0, bookValue - s);
      }
      accumDep += depAmount;
      bookValue -= depAmount;
      
      schedule.push({
        yearIndex: i,
        year: startYear + i - 1,
        beginningBookValue: bookValue + depAmount,
        depreciationExpense: depAmount,
        accumulatedDepreciation: accumDep,
        endingBookValue: bookValue
      });
    }
  }
  
  return schedule;
};
