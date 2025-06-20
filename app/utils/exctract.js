/**
 * Extrage informațiile din textul OCR al unei cărți de identitate românești
 * @param {string} ocrText - Textul extras cu OCR din imaginea cărții de identitate
 * @returns {object} - Obiect cu informațiile extrase
 */
export function extractRomanianIdInfo(ocrText) {
  const result = {
    cnp: null,
    nume: null,
    prenume: null,
    serie: null,
    numar: null,
    cetatenie: null,
    locNastere: null,
    domiciliu: null,
    emisaDe: null,
    valabilitate: null
  };

  // Curățăm textul
  const cleanText = ocrText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // 1. Extragere CNP (13 cifre consecutive)
  const cnpMatch = cleanText.match(/\b(\d{13})\b/);
  if (cnpMatch) {
    result.cnp = cnpMatch[1];
  }

  // 2. Extragere Serie și Număr (format MZ 513627 sau MZ513627)
  const serieNumarMatch = cleanText.match(/\b([A-Z]{2})\s*(\d{6})\b/);
  if (serieNumarMatch) {
    result.serie = serieNumarMatch[1];
    result.numar = serieNumarMatch[2];
  }

  // 3. Extragere Nume (după CNP, căutăm numele)
  // Numele apare de obicei înainte de prenume
  const numeMatch = cleanText.match(/(?:Nume|Last name|Nom)\s*[\/\s]*([A-ZĂÂÎȘȚ][A-ZĂÂÎȘȚ\s\-]+?)(?:\s+Prenume|\s+Prenom|\s+First)/i);
  if (numeMatch) {
    result.nume = numeMatch[1].trim();
  } else {
    // Căutăm în zona MRZ (Machine Readable Zone) - ultima parte
    const mrzMatch = cleanText.match(/([A-Z]+)<<([A-Z]+)<</);
    if (mrzMatch) {
      result.nume = mrzMatch[1];
      result.prenume = mrzMatch[2];
    }
  }

  // 4. Extragere Prenume
  if (!result.prenume) {
    const prenumeMatch = cleanText.match(/(?:Prenume|Prenom|First name)\s*[\/\s]*([A-ZĂÂÎȘȚ][A-ZĂÂÎȘȚ\s\-]+?)(?:\s+Cetatenie|\s+Nationalite|\s+Nationality)/i);
    if (prenumeMatch) {
      result.prenume = prenumeMatch[1].trim();
    }
  }

  // 5. Extragere Cetățenie
  const cetatenieMatch = cleanText.match(/(?:Cetatenie|Nationalite|Nationality)\s*[\/\s]*([A-Za-zăâîșțĂÂÎȘȚ\s\/]+?)(?:\s+Loc|\s+Lieu|\s+Place|Sex|M|F)/i);
  if (cetatenieMatch) {
    result.cetatenie = cetatenieMatch[1].trim();
  }

  // 6. Extragere Loc naștere
  const locNastereMatch = cleanText.match(/(?:Loc nastere|Lieu de naissance|Place of birth)\s*[\/\s]*([A-Za-zăâîșțĂÂÎȘȚ\.\s]+?)(?:\s+Domiciliu|\s+Adresse|\s+Address)/i);
  if (locNastereMatch) {
    result.locNastere = locNastereMatch[1].trim();
  }

  // 7. Extragere Domiciliu
  const domiciliuMatch = cleanText.match(/(?:Domiciliu|Adresse|Address)\s*[\/\s]*([A-Za-zăâîșțĂÂÎȘȚ\.\s\(\),\d\-]+?)(?:\s+Emisa|\s+Delivree|\s+Issued)/i);
  if (domiciliuMatch) {
    result.domiciliu = domiciliuMatch[1].trim();
  }

  // 8. Extragere Emisă de
  const emisaDeMatch = cleanText.match(/(?:Emisa de|Delivree par|Issued by)\s*[\/\s]*([A-Za-zăâîșțĂÂÎȘȚ\s]+?)(?:\s+Valabilitate|\s+Validite|\s+Validity|\d{2}\.\d{2})/i);
  if (emisaDeMatch) {
    result.emisaDe = emisaDeMatch[1].trim();
  }

  // 9. Extragere Valabilitate (format DD.MM.YY-DD.MM.YYYY)
  const valabilitateMatch = cleanText.match(/(\d{2}\.\d{2}\.\d{2,4}-\d{2}\.\d{2}\.\d{4})/);
  if (valabilitateMatch) {
    result.valabilitate = valabilitateMatch[1];
  }

  // Curățăm rezultatele
  Object.keys(result).forEach(key => {
    if (result[key] && typeof result[key] === 'string') {
      result[key] = result[key]
        .replace(/[^\w\săâîșțĂÂÎȘȚ\.\-\/\(\),]/g, '')
        .trim();
    }
  });

  return result;
}

// Funcție pentru formatarea și validarea CNP-ului
export function validateCNP(cnp) {
  if (!cnp || cnp.length !== 13) return false;
  
  // Verificăm dacă sunt doar cifre
  if (!/^\d{13}$/.test(cnp)) return false;
  
  // Algoritm de validare CNP românesc
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  const controlDigit = remainder < 10 ? remainder : 1;
  
  return controlDigit === parseInt(cnp[12]);
}