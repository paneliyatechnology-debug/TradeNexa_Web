/**
 * Offline nearest-city match for India (no external geocoding).
 * Results are resolved to platform IDs via fetchStates / fetchCities.
 */
export interface IndiaLocationHint {
  cityName: string;
  stateName: string;
  stateCode: string;
}

interface CityPoint extends IndiaLocationHint {
  lat: number;
  lng: number;
}

/** Major Indian cities used only to map lat/lng → searchable names. */
const INDIA_CITY_POINTS: CityPoint[] = [
  { cityName: "Mumbai", stateName: "Maharashtra", stateCode: "MH", lat: 19.076, lng: 72.8777 },
  { cityName: "Pune", stateName: "Maharashtra", stateCode: "MH", lat: 18.5204, lng: 73.8567 },
  { cityName: "Nagpur", stateName: "Maharashtra", stateCode: "MH", lat: 21.1458, lng: 79.0882 },
  { cityName: "Nashik", stateName: "Maharashtra", stateCode: "MH", lat: 19.9975, lng: 73.7898 },
  { cityName: "Delhi", stateName: "Delhi", stateCode: "DL", lat: 28.7041, lng: 77.1025 },
  { cityName: "New Delhi", stateName: "Delhi", stateCode: "DL", lat: 28.6139, lng: 77.209 },
  { cityName: "Bengaluru", stateName: "Karnataka", stateCode: "KA", lat: 12.9716, lng: 77.5946 },
  { cityName: "Mysuru", stateName: "Karnataka", stateCode: "KA", lat: 12.2958, lng: 76.6394 },
  { cityName: "Mangaluru", stateName: "Karnataka", stateCode: "KA", lat: 12.9141, lng: 74.856 },
  { cityName: "Hyderabad", stateName: "Telangana", stateCode: "TS", lat: 17.385, lng: 78.4867 },
  { cityName: "Warangal", stateName: "Telangana", stateCode: "TS", lat: 17.9689, lng: 79.5941 },
  { cityName: "Chennai", stateName: "Tamil Nadu", stateCode: "TN", lat: 13.0827, lng: 80.2707 },
  { cityName: "Coimbatore", stateName: "Tamil Nadu", stateCode: "TN", lat: 11.0168, lng: 76.9558 },
  { cityName: "Madurai", stateName: "Tamil Nadu", stateCode: "TN", lat: 9.9252, lng: 78.1198 },
  { cityName: "Kolkata", stateName: "West Bengal", stateCode: "WB", lat: 22.5726, lng: 88.3639 },
  { cityName: "Siliguri", stateName: "West Bengal", stateCode: "WB", lat: 26.7271, lng: 88.3953 },
  { cityName: "Ahmedabad", stateName: "Gujarat", stateCode: "GJ", lat: 23.0225, lng: 72.5714 },
  { cityName: "Surat", stateName: "Gujarat", stateCode: "GJ", lat: 21.1702, lng: 72.8311 },
  { cityName: "Vadodara", stateName: "Gujarat", stateCode: "GJ", lat: 22.3072, lng: 73.1812 },
  { cityName: "Rajkot", stateName: "Gujarat", stateCode: "GJ", lat: 22.3039, lng: 70.8022 },
  { cityName: "Amreli", stateName: "Gujarat", stateCode: "GJ", lat: 21.6032, lng: 71.2221 },
  { cityName: "Bhavnagar", stateName: "Gujarat", stateCode: "GJ", lat: 21.7645, lng: 72.1519 },
  { cityName: "Jamnagar", stateName: "Gujarat", stateCode: "GJ", lat: 22.4707, lng: 70.0577 },
  { cityName: "Jaipur", stateName: "Rajasthan", stateCode: "RJ", lat: 26.9124, lng: 75.7873 },
  { cityName: "Jodhpur", stateName: "Rajasthan", stateCode: "RJ", lat: 26.2389, lng: 73.0243 },
  { cityName: "Udaipur", stateName: "Rajasthan", stateCode: "RJ", lat: 24.5854, lng: 73.7125 },
  { cityName: "Lucknow", stateName: "Uttar Pradesh", stateCode: "UP", lat: 26.8467, lng: 80.9462 },
  { cityName: "Kanpur", stateName: "Uttar Pradesh", stateCode: "UP", lat: 26.4499, lng: 80.3319 },
  { cityName: "Varanasi", stateName: "Uttar Pradesh", stateCode: "UP", lat: 25.3176, lng: 82.9739 },
  { cityName: "Noida", stateName: "Uttar Pradesh", stateCode: "UP", lat: 28.5355, lng: 77.391 },
  { cityName: "Ghaziabad", stateName: "Uttar Pradesh", stateCode: "UP", lat: 28.6692, lng: 77.4538 },
  { cityName: "Amritsar", stateName: "Punjab", stateCode: "PB", lat: 31.634, lng: 74.8723 },
  { cityName: "Ludhiana", stateName: "Punjab", stateCode: "PB", lat: 30.901, lng: 75.8573 },
  { cityName: "Mohali", stateName: "Punjab", stateCode: "PB", lat: 30.7046, lng: 76.7179 },
  { cityName: "Mohali", stateName: "Punjab", stateCode: "PB", lat: 30.7333, lng: 76.7794 },
  { cityName: "Bhopal", stateName: "Madhya Pradesh", stateCode: "MP", lat: 23.2599, lng: 77.4126 },
  { cityName: "Indore", stateName: "Madhya Pradesh", stateCode: "MP", lat: 22.7196, lng: 75.8577 },
  { cityName: "Gwalior", stateName: "Madhya Pradesh", stateCode: "MP", lat: 26.2183, lng: 78.1828 },
  { cityName: "Patna", stateName: "Bihar", stateCode: "BR", lat: 25.5941, lng: 85.1376 },
  { cityName: "Gaya", stateName: "Bihar", stateCode: "BR", lat: 24.7914, lng: 85.0002 },
  { cityName: "Bhubaneswar", stateName: "Odisha", stateCode: "OD", lat: 20.2961, lng: 85.8245 },
  { cityName: "Cuttack", stateName: "Odisha", stateCode: "OD", lat: 20.4625, lng: 85.8828 },
  { cityName: "Guwahati", stateName: "Assam", stateCode: "AS", lat: 26.1445, lng: 91.7362 },
  { cityName: "Thiruvananthapuram", stateName: "Kerala", stateCode: "KL", lat: 8.5241, lng: 76.9366 },
  { cityName: "Ernakulam", stateName: "Kerala", stateCode: "KL", lat: 9.9312, lng: 76.2673 },
  { cityName: "Kozhikode", stateName: "Kerala", stateCode: "KL", lat: 11.2588, lng: 75.7804 },
  { cityName: "Visakhapatnam", stateName: "Andhra Pradesh", stateCode: "AP", lat: 17.6868, lng: 83.2185 },
  { cityName: "Vijayawada", stateName: "Andhra Pradesh", stateCode: "AP", lat: 16.5062, lng: 80.648 },
  { cityName: "Raipur", stateName: "Chhattisgarh", stateCode: "CG", lat: 21.2514, lng: 81.6296 },
  { cityName: "Ranchi", stateName: "Jharkhand", stateCode: "JH", lat: 23.3441, lng: 85.3096 },
  { cityName: "Jamshedpur", stateName: "Jharkhand", stateCode: "JH", lat: 22.8046, lng: 86.2029 },
  { cityName: "Dehradun", stateName: "Uttarakhand", stateCode: "UK", lat: 30.3165, lng: 78.0322 },
  { cityName: "Haridwar", stateName: "Uttarakhand", stateCode: "UK", lat: 29.9457, lng: 78.1642 },
  { cityName: "Shimla", stateName: "Himachal Pradesh", stateCode: "HP", lat: 31.1048, lng: 77.1734 },
  { cityName: "Panaji", stateName: "Goa", stateCode: "GA", lat: 15.4909, lng: 73.8278 },
  { cityName: "Margao", stateName: "Goa", stateCode: "GA", lat: 15.2832, lng: 73.9862 },
  { cityName: "Faridabad", stateName: "Haryana", stateCode: "HR", lat: 28.4089, lng: 77.3178 },
  { cityName: "Gurugram", stateName: "Haryana", stateCode: "HR", lat: 28.4595, lng: 77.0266 },
  { cityName: "Gurgaon", stateName: "Haryana", stateCode: "HR", lat: 28.4595, lng: 77.0266 },
  { cityName: "Agra", stateName: "Uttar Pradesh", stateCode: "UP", lat: 27.1767, lng: 78.0081 },
  { cityName: "Meerut", stateName: "Uttar Pradesh", stateCode: "UP", lat: 28.9845, lng: 77.7064 },
  { cityName: "Aurangabad", stateName: "Maharashtra", stateCode: "MH", lat: 19.8762, lng: 75.3433 },
  { cityName: "Thane", stateName: "Maharashtra", stateCode: "MH", lat: 19.2183, lng: 72.9781 },
  { cityName: "Navi Mumbai", stateName: "Maharashtra", stateCode: "MH", lat: 19.033, lng: 73.0297 },
  { cityName: "Howrah", stateName: "West Bengal", stateCode: "WB", lat: 22.5958, lng: 88.2636 },
  { cityName: "Durgapur", stateName: "West Bengal", stateCode: "WB", lat: 23.5204, lng: 87.3119 },
  { cityName: "Tiruchirappalli", stateName: "Tamil Nadu", stateCode: "TN", lat: 10.7905, lng: 78.7047 },
  { cityName: "Salem", stateName: "Tamil Nadu", stateCode: "TN", lat: 11.6643, lng: 78.146 },
  { cityName: "Hubballi", stateName: "Karnataka", stateCode: "KA", lat: 15.3647, lng: 75.124 },
  { cityName: "Belagavi", stateName: "Karnataka", stateCode: "KA", lat: 15.8497, lng: 74.4977 },
  { cityName: "Bangalore", stateName: "Karnataka", stateCode: "KA", lat: 12.9716, lng: 77.5946 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Rough India bounding box — skip clearly out-of-country coords. */
function isLikelyInIndia(lat: number, lng: number): boolean {
  return lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 98;
}

export function matchNearestIndiaLocation(lat: number, lng: number): IndiaLocationHint | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (!isLikelyInIndia(lat, lng)) return null;

  let best: CityPoint | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const city of INDIA_CITY_POINTS) {
    const distance = haversineKm(lat, lng, city.lat, city.lng);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = city;
    }
  }

  // Reject matches that are unrealistically far from any known city.
  if (!best || bestDistance > 350) return null;

  return {
    cityName: best.cityName,
    stateName: best.stateName,
    stateCode: best.stateCode,
  };
}
