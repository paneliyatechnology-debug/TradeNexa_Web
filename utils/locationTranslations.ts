/**
 * Comprehensive translation mappings for Indian States, UTs, and Major Cities
 * Supports English ('en'), Gujarati ('gu'), and Hindi ('hi').
 */

interface LocationTranslation {
  en: string;
  gu: string;
  hi: string;
}

const LOCATIONS_MAP: Record<string, LocationTranslation> = {
  // States & UTs
  gujarat: { en: "Gujarat", gu: "ગુજરાત", hi: "गुजरात" },
  maharashtra: { en: "Maharashtra", gu: "મહારાષ્ટ્ર", hi: "महाराष्ट्र" },
  delhi: { en: "Delhi", gu: "દિલ્હી", hi: "दिल्ली" },
  rajasthan: { en: "Rajasthan", gu: "રાજસ્થાન", hi: "राजस्थान" },
  "madhya pradesh": { en: "Madhya Pradesh", gu: "મધ્ય પ્રદેશ", hi: "मध्य प्रदेश" },
  "uttar pradesh": { en: "Uttar Pradesh", gu: "ઉત્તર પ્રદેશ", hi: "उत्तर प्रदेश" },
  karnataka: { en: "Karnataka", gu: "કર્ણાટક", hi: "कर्नाटक" },
  "tamil nadu": { en: "Tamil Nadu", gu: "તમિલનાડુ", hi: "तमिलनाडु" },
  "west bengal": { en: "West Bengal", gu: "પશ્ચિમ બંગાળ", hi: "पश्चिम बंगाल" },
  telangana: { en: "Telangana", gu: "તેલંગાણા", hi: "तेलंगाना" },
  punjab: { en: "Punjab", gu: "પંજાબ", hi: "पंजाब" },
  haryana: { en: "Haryana", gu: "હરિયાણા", hi: "हरियाणा" },
  bihar: { en: "Bihar", gu: "બિહાર", hi: "बिहार" },
  "andhra pradesh": { en: "Andhra Pradesh", gu: "આંધ્ર પ્રદેશ", hi: "आंध्र प्रदेश" },
  kerala: { en: "Kerala", gu: "કેરળ", hi: "केरल" },
  odisha: { en: "Odisha", gu: "ઓડિશા", hi: "ओडिशा" },
  orissa: { en: "Odisha", gu: "ઓડિશા", hi: "ओडिशा" },
  assam: { en: "Assam", gu: "આસામ", hi: "असम" },
  jharkhand: { en: "Jharkhand", gu: "ઝારખંડ", hi: "झारखंड" },
  chhattisgarh: { en: "Chhattisgarh", gu: "છત્તીસગઢ", hi: "छत्तीसगढ़" },
  uttarakhand: { en: "Uttarakhand", gu: "ઉત્તરાખંડ", hi: "उत्तराखंड" },
  "himachal pradesh": { en: "Himachal Pradesh", gu: "હિમાચલ પ્રદેશ", hi: "हिमाचल प्रदेश" },
  goa: { en: "Goa", gu: "ગોવા", hi: "गोवा" },
  tripura: { en: "Tripura", gu: "ત્રિપુરા", hi: "त्रिपुरा" },
  manipur: { en: "Manipur", gu: "મણિપુર", hi: "मणिपुर" },
  meghalaya: { en: "Meghalaya", gu: "મેઘાલય", hi: "मेघालय" },
  nagaland: { en: "Nagaland", gu: "નાગાલેન્ડ", hi: "नागालैंड" },
  mizoram: { en: "Mizoram", gu: "મિઝોરમ", hi: "मिज़ोरम" },
  sikkim: { en: "Sikkim", gu: "સિક્કિમ", hi: "सिक्किम" },
  "arunachal pradesh": { en: "Arunachal Pradesh", gu: "અરુણાચલ પ્રદેશ", hi: "अरुणाचल प्रदेश" },
  "jammu and kashmir": { en: "Jammu & Kashmir", gu: "જમ્મુ અને કાશ્મીર", hi: "जम्मू और कश्मीर" },
  "jammu & kashmir": { en: "Jammu & Kashmir", gu: "જમ્મુ અને કાશ્મીર", hi: "जम्मू और कश्मीर" },
  chandigarh: { en: "Chandigarh", gu: "ચંડીગઢ", hi: "चंडीगढ़" },
  puducherry: { en: "Puducherry", gu: "પુડુચેરી", hi: "पुदुचेरी" },
  ladakh: { en: "Ladakh", gu: "લદ્દાખ", hi: "लद्दाख" },
  india: { en: "India", gu: "ભારત", hi: "भारत" },

  // Gujarat Cities
  ahmedabad: { en: "Ahmedabad", gu: "અમદાવાદ", hi: "अहमदाबाद" },
  surat: { en: "Surat", gu: "સુરત", hi: "सूरत" },
  vadodara: { en: "Vadodara", gu: "વડોદરા", hi: "वडोदरा" },
  baroda: { en: "Vadodara", gu: "વડોદરા", hi: "वडोदरा" },
  rajkot: { en: "Rajkot", gu: "રાજકોટ", hi: "राजकोट" },
  bhavnagar: { en: "Bhavnagar", gu: "ભાવનગર", hi: "भावनगर" },
  jamnagar: { en: "Jamnagar", gu: "જામનગર", hi: "जामनगर" },
  gandhinagar: { en: "Gandhinagar", gu: "ગાંધીનગર", hi: "गांधीनगर" },
  junagadh: { en: "Junagadh", gu: "જુનાગઢ", hi: "जूनागढ़" },
  anand: { en: "Anand", gu: "આણંદ", hi: "આણંદ" },
  navsari: { en: "Navsari", gu: "નવસારી", hi: "नवसारी" },
  morbi: { en: "Morbi", gu: "મોરબી", hi: "मोरबी" },
  nadiad: { en: "Nadiad", gu: "નડિયાદ", hi: "નડિયાદ" },
  surendranagar: { en: "Surendranagar", gu: "સુરેન્દ્રનગર", hi: "सुरेंद्रनगर" },
  bharuch: { en: "Bharuch", gu: "ભરૂચ", hi: "भरूच" },
  porbandar: { en: "Porbandar", gu: "પોરબંદર", hi: "पोरबंदर" },
  godhra: { en: "Godhra", gu: "ગોધરા", hi: "गोधरा" },
  bhuj: { en: "Bhuj", gu: "ભુજ", hi: "भुज" },
  valsad: { en: "Valsad", gu: "વલસાડ", hi: "वलसाड" },
  vapi: { en: "Vapi", gu: "વાપી", hi: "वापी" },
  gondal: { en: "Gondal", gu: "ગોંડલ", hi: "गोंडल" },
  patan: { en: "Patan", gu: "પાટણ", hi: "पाटन" },
  kalol: { en: "Kalol", gu: "કલોલ", hi: "कलोल" },
  dahod: { en: "Dahod", gu: "દાહોદ", hi: "दाहोद" },
  amreli: { en: "Amreli", gu: "અમરેલી", hi: "अमरेली" },
  mehsana: { en: "Mehsana", gu: "મહેસાણા", hi: "मेहसाणा" },
  botad: { en: "Botad", gu: "બોટાદ", hi: "बोटाद" },
  palanpur: { en: "Palanpur", gu: "પાલનપુર", hi: "पालनपुर" },
  veraval: { en: "Veraval", gu: "વેરાવળ", hi: "वेरावल" },
  ankleshwar: { en: "Ankleshwar", gu: "અંકલેશ્વર", hi: "अंकलेश्वर" },
  gandhidham: { en: "Gandhidham", gu: "ગાંધીધામ", hi: "गांधीधाम" },
  jetpur: { en: "Jetpur", gu: "જેતપુર", hi: "જેતપુર" },
  disa: { en: "Deesa", gu: "ડીસા", hi: "डीसा" },
  deesa: { en: "Deesa", gu: "ડીસા", hi: "डीसा" },

  // Maharashtra Cities
  mumbai: { en: "Mumbai", gu: "મુંબઈ", hi: "मुंबई" },
  pune: { en: "Pune", gu: "પુણે", hi: "पुणे" },
  nagpur: { en: "Nagpur", gu: "નાગપુર", hi: "नागपुर" },
  thane: { en: "Thane", gu: "ઠાણે", hi: "ठाणे" },
  nashik: { en: "Nashik", gu: "નાસિક", hi: "नासिक" },
  aurangabad: { en: "Aurangabad", gu: "ઔરંગાબાદ", hi: "औरंगाबाद" },
  solapur: { en: "Solapur", gu: "સોલાપુર", hi: "सोलापुर" },
  kolhapur: { en: "Kolhapur", gu: "કોલ્હાપુર", hi: "कोल्हापुर" },
  navi_mumbai: { en: "Navi Mumbai", gu: "નવી મુંબઈ", hi: "नवी मुंबई" },
  "navi mumbai": { en: "Navi Mumbai", gu: "નવી મુંબઈ", hi: "नवी मुंबई" },

  // Delhi NCR
  "new delhi": { en: "New Delhi", gu: "નવી દિલ્હી", hi: "नई दिल्ली" },
  noida: { en: "Noida", gu: "નોઈડા", hi: "नोएडा" },
  gurugram: { en: "Gurugram", gu: "ગુરુગ્રામ", hi: "गुरुग्राम" },
  gurgaon: { en: "Gurugram", gu: "ગુરુગ્રામ", hi: "गुरुग्राम" },
  faridabad: { en: "Faridabad", gu: "ફરીદાબાદ", hi: "फरीदाबाद" },
  ghaziabad: { en: "Ghaziabad", gu: "ગાઝિયાબાદ", hi: "गाजियाबाद" },

  // Rajasthan Cities
  jaipur: { en: "Jaipur", gu: "જયપુર", hi: "जयपुर" },
  jodhpur: { en: "Jodhpur", gu: "જોધપુર", hi: "जोधपुर" },
  kota: { en: "Kota", gu: "કોટા", hi: "कोटा" },
  bikaner: { en: "Bikaner", gu: "બિકાનેર", hi: "बीकानेर" },
  ajmer: { en: "Ajmer", gu: "અજમેર", hi: "अजमेर" },
  udaipur: { en: "Udaipur", gu: "ઉદયપુર", hi: "उदयपुर" },
  bhilwara: { en: "Bhilwara", gu: "ભીલવાડા", hi: "भीलवाड़ा" },
  alwar: { en: "Alwar", gu: "અલવર", hi: "अलवर" },

  // Karnataka Cities
  bengaluru: { en: "Bengaluru", gu: "બેંગલુરુ", hi: "बेंगलुरु" },
  bangalore: { en: "Bengaluru", gu: "બેંગલુરુ", hi: "बेंगलुरु" },
  mysuru: { en: "Mysuru", gu: "મૈસુર", hi: "मैसूर" },
  mysore: { en: "Mysuru", gu: "મૈસુર", hi: "मैसूर" },
  hubballi: { en: "Hubballi", gu: "હુબલી", hi: "हुबली" },
  mangalore: { en: "Mangaluru", gu: "મેંગલોર", hi: "मंगलौर" },
  mangaluru: { en: "Mangaluru", gu: "મેંગલોર", hi: "मंगलौर" },
  belagavi: { en: "Belagavi", gu: "બેલ્ગામ", hi: "बेलगाम" },

  // Tamil Nadu Cities
  chennai: { en: "Chennai", gu: "ચેન્નાઇ", hi: "चेन्नई" },
  coimbatore: { en: "Coimbatore", gu: "કોયમ્બતૂર", hi: "कोयंबटूर" },
  madurai: { en: "Madurai", gu: "મદુરાઇ", hi: "मदुरै" },
  tiruchirappalli: { en: "Tiruchirappalli", gu: "તિરુચિરાપલ્લી", hi: "तिरुचिरापल्ली" },
  salem: { en: "Salem", gu: "સેલેમ", hi: "सेलम" },
  tirupur: { en: "Tirupur", gu: "તિરુપુરા", hi: "तिरुपुर" },

  // Telangana & Andhra Pradesh Cities
  hyderabad: { en: "Hyderabad", gu: "હૈદરાબાદ", hi: "हैदराबाद" },
  secunderabad: { en: "Secunderabad", gu: "સિકંદરાબાદ", hi: "सिकंदराबाद" },
  warangal: { en: "Warangal", gu: "વારંગલ", hi: "वारंगल" },
  visakhapatnam: { en: "Visakhapatnam", gu: "વિશાખાપટ્ટનમ", hi: "विशाखापट्टनम" },
  vijayawada: { en: "Vijayawada", gu: "વિજયવાડા", hi: "विजयवाड़ा" },
  guntur: { en: "Guntur", gu: "ગુંટુર", hi: "गुंटूर" },

  // West Bengal Cities
  kolkata: { en: "Kolkata", gu: "કોલકાતા", hi: "कोलकाता" },
  howrah: { en: "Howrah", gu: "હાવડા", hi: "हावड़ा" },
  durgapur: { en: "Durgapur", gu: "દુર્ગાપુર", hi: "दुर्गापुर" },
  asansol: { en: "Asansol", gu: "આસનસોલ", hi: "आसनसोल" },
  siliguri: { en: "Siliguri", gu: "સિલીગુડી", hi: "सिलीगुड़ी" },

  // Uttar Pradesh & MP Cities
  lucknow: { en: "Lucknow", gu: "લખનૌ", hi: "लखनऊ" },
  kanpur: { en: "Kanpur", gu: "કાનપુર", hi: "कानपुर" },
  varanasi: { en: "Varanasi", gu: "વારાણસી", hi: "वाराणसी" },
  agra: { en: "Agra", gu: "આગ્રા", hi: "आगरा" },
  prayagraj: { en: "Prayagraj", gu: "પ્રયાગરાજ", hi: "प्रयागराज" },
  allahabad: { en: "Prayagraj", gu: "પ્રયાગરાજ", hi: "प्रयागराज" },
  meerut: { en: "Meerut", gu: "મેરઠ", hi: "मेरठ" },
  bareilly: { en: "Bareilly", gu: "બરેલી", hi: "बरेली" },
  aligarh: { en: "Aligarh", gu: "અલીગઢ", hi: "अलीगढ़" },
  moradabad: { en: "Moradabad", gu: "મુરાદાબાદ", hi: "मुरादाबाद" },
  gorakhpur: { en: "Gorakhpur", gu: "ગોરખપુર", hi: "गोरखपुर" },
  indore: { en: "Indore", gu: "ઇન્દોર", hi: "इंदौर" },
  bhopal: { en: "Bhopal", gu: "ભોપાલ", hi: "भोपाल" },
  gwalior: { en: "Gwalior", gu: "ગ્વાલિયર", hi: "ग्वालियर" },
  jabalpur: { en: "Jabalpur", gu: "જબલપુર", hi: "जबलपुर" },
  ujjain: { en: "Ujjain", gu: "ઉજ્જૈન", hi: "उज्जैन" },

  // Bihar & Jharkhand Cities
  patna: { en: "Patna", gu: "પટના", hi: "पटना" },
  gaya: { en: "Gaya", gu: "ગયા", hi: "गया" },
  ranchi: { en: "Ranchi", gu: "રાંચી", hi: "रांची" },
  jamshedpur: { en: "Jamshedpur", gu: "જમશેદપુર", hi: "जमशेदपुर" },
  dhanbad: { en: "Dhanbad", gu: "ધનબાદ", hi: "धनबाद" },

  // Punjab, Haryana, HP, UK Cities
  ludhiana: { en: "Ludhiana", gu: "લુધિયાણા", hi: "लुधियाना" },
  amritsar: { en: "Amritsar", gu: "અમૃતસર", hi: "अमृतसर" },
  jalandhar: { en: "Jalandhar", gu: "જલંધર", hi: "जालंधर" },
  panipat: { en: "Panipat", gu: "પાનીપત", hi: "पानीपत" },
  ambala: { en: "Ambala", gu: "અંબાલા", hi: "अंबाला" },
  karnal: { en: "Karnal", gu: "કરનાલ", hi: "करनाल" },
  dehradun: { en: "Dehradun", gu: "દેહરાદૂન", hi: "देहरादून" },
  haridwar: { en: "Haridwar", gu: "હરિદ્વાર", hi: "हरिद्वार" },
  shimla: { en: "Shimla", gu: "શિમલા", hi: "शिमला" },

  // Kerala & Odisha & Others
  kochi: { en: "Kochi", gu: "કોચી", hi: "कोच्चि" },
  thiruvananthapuram: { en: "Thiruvananthapuram", gu: "તિરુવનંતપુરમ", hi: "तिरुवनंतपुरम" },
  kozhikode: { en: "Kozhikode", gu: "કોઝિકોડ", hi: "कोझिकोड" },
  bhubaneswar: { en: "Bhubaneswar", gu: "ભુવનેશ્વર", hi: "भुवनेश्वर" },
  cuttack: { en: "Cuttack", gu: "કટક", hi: "कटक" },
  raipur: { en: "Raipur", gu: "રાયપુર", hi: "रायपुर" },
  guwahati: { en: "Guwahati", gu: "ગુવાહાટી", hi: "गुवाहाटी" },
};

// Build reverse lookup index from translated words (e.g. "અમદાવાદ" -> entry, "अहमदाबाद" -> entry)
const REVERSE_LOOKUP: Record<string, LocationTranslation> = {};
for (const entry of Object.values(LOCATIONS_MAP)) {
  REVERSE_LOOKUP[entry.en.toLowerCase()] = entry;
  REVERSE_LOOKUP[entry.gu.toLowerCase()] = entry;
  REVERSE_LOOKUP[entry.hi.toLowerCase()] = entry;
}

/**
 * Translates a given state or city name to the target language ('en', 'gu', 'hi').
 */
export function translateLocationName(
  name: string | null | undefined,
  targetLang = "en"
): string {
  if (!name || !name.trim()) return "";
  const cleaned = name.trim();
  const normalizedKey = cleaned.toLowerCase();

  const lang = targetLang.toLowerCase();
  const validLang = lang === "gu" ? "gu" : lang === "hi" ? "hi" : "en";

  // Check direct key or reverse key
  const match = LOCATIONS_MAP[normalizedKey] || REVERSE_LOOKUP[normalizedKey];
  if (match) {
    return match[validLang] || match.en || cleaned;
  }

  return cleaned;
}

/**
 * Formats a location badge string (e.g., "Ahmedabad, Gujarat" -> "અમદાવાદ, ગુજરાત").
 */
export function formatLocationLabel(
  cityName?: string | null,
  stateName?: string | null,
  targetLang = "en"
): string {
  const city = cityName?.trim();
  const state = stateName?.trim();

  const tCity = city ? translateLocationName(city, targetLang) : null;
  const tState = state ? translateLocationName(state, targetLang) : null;

  if (tCity && tState) {
    return `${tCity}, ${tState}`;
  }
  if (tCity) return tCity;
  if (tState) return tState;

  if (targetLang === "gu") return "સ્થળ પસંદ કરો";
  if (targetLang === "hi") return "स्थान चुनें";
  return "Select Location";
}
