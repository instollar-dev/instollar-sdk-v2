// ============================================================================
// INTERFACES
// ============================================================================

export interface LGA {
  name: string;
  code?: string; // Optional ISO/local administrative code
}

export interface State {
  name: string;
  code?: string; // Optional state/province code (ISO 3166-2 or local)
  lgas?: LGA[]; // Local Government Areas / Sub-counties / Districts (optional)
}

export interface Country {
  countryCode: string; // ISO 3166-1 alpha-2
  name: string; // Country name
  phoneCode: string; // International dialing code
  phoneLength: number; // Expected phone number length (digits only, national significant)
  inputFormat: string; // Display format pattern (e.g., "### ### ####")
  currency: string; // ISO 4217 currency code
  states?: State[]; // Optional: First-level administrative divisions
}

import GEOGRAPHY_DATA from "./data.json";

// ============================================================================
// COUNTRY DATA WITH ADMINISTRATIVE DIVISIONS
// ============================================================================

const UNSORTED_COUNTRIES: Country[] = [
  {
    countryCode: "NG",
    name: "Nigeria",
    phoneCode: "+234",
    phoneLength: 10,
    inputFormat: "### ### ####",
    currency: "NGN",
  },
  {
    countryCode: "KE",
    name: "Kenya",
    phoneCode: "+254",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "KES",
  },
  {
    countryCode: "ZA",
    name: "South Africa",
    phoneCode: "+27",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "ZAR",
  },
  {
    countryCode: "GH",
    name: "Ghana",
    phoneCode: "+233",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "GHS",
  },
  {
    countryCode: "EG",
    name: "Egypt",
    phoneCode: "+20",
    phoneLength: 10,
    inputFormat: "## #### ####",
    currency: "EGP",
  },
  {
    countryCode: "MA",
    name: "Morocco",
    phoneCode: "+212",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "MAD",
  },
  {
    countryCode: "DZ",
    name: "Algeria",
    phoneCode: "+213",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "DZD",
  },
  {
    countryCode: "AO",
    name: "Angola",
    phoneCode: "+244",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "AOA",
  },
  {
    countryCode: "BJ",
    name: "Benin",
    phoneCode: "+229",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "BW",
    name: "Botswana",
    phoneCode: "+267",
    phoneLength: 8,
    inputFormat: "## ### ###",
    currency: "BWP",
  },
  {
    countryCode: "BF",
    name: "Burkina Faso",
    phoneCode: "+226",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "BI",
    name: "Burundi",
    phoneCode: "+257",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "BIF",
  },
  {
    countryCode: "CM",
    name: "Cameroon",
    phoneCode: "+237",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "XAF",
  },
  {
    countryCode: "CV",
    name: "Cabo Verde",
    phoneCode: "+238",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "CVE",
  },
  {
    countryCode: "CF",
    name: "Central African Republic",
    phoneCode: "+236",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XAF",
  },
  {
    countryCode: "TD",
    name: "Chad",
    phoneCode: "+235",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XAF",
  },
  {
    countryCode: "KM",
    name: "Comoros",
    phoneCode: "+269",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "KMF",
  },
  {
    countryCode: "CG",
    name: "Congo",
    phoneCode: "+242",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "XAF",
  },
  {
    countryCode: "CD",
    name: "Congo, Democratic Republic of the",
    phoneCode: "+243",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "CDF",
  },
  {
    countryCode: "CI",
    name: "Côte d'Ivoire",
    phoneCode: "+225",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "DJ",
    name: "Djibouti",
    phoneCode: "+253",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "DJF",
  },
  {
    countryCode: "GQ",
    name: "Equatorial Guinea",
    phoneCode: "+240",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "XAF",
  },
  {
    countryCode: "ER",
    name: "Eritrea",
    phoneCode: "+291",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "ERN",
  },
  {
    countryCode: "ET",
    name: "Ethiopia",
    phoneCode: "+251",
    phoneLength: 9,
    inputFormat: "## ### ####",
    currency: "ETB",
  },
  {
    countryCode: "GA",
    name: "Gabon",
    phoneCode: "+241",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XAF",
  },
  {
    countryCode: "GM",
    name: "Gambia",
    phoneCode: "+220",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "GMD",
  },
  {
    countryCode: "GN",
    name: "Guinea",
    phoneCode: "+224",
    phoneLength: 8,
    inputFormat: "### ### ###",
    currency: "GNF",
  },
  {
    countryCode: "GW",
    name: "Guinea-Bissau",
    phoneCode: "+245",
    phoneLength: 8,
    inputFormat: "### ####",
    currency: "XOF",
  },
  {
    countryCode: "LS",
    name: "Lesotho",
    phoneCode: "+266",
    phoneLength: 8,
    inputFormat: "### ####",
    currency: "LSL",
  },
  {
    countryCode: "LR",
    name: "Liberia",
    phoneCode: "+231",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "LRD",
  },
  {
    countryCode: "LY",
    name: "Libya",
    phoneCode: "+218",
    phoneLength: 9,
    inputFormat: "## ### ####",
    currency: "LYD",
  },
  {
    countryCode: "MG",
    name: "Madagascar",
    phoneCode: "+261",
    phoneLength: 9,
    inputFormat: "## ## ### ##",
    currency: "MGA",
  },
  {
    countryCode: "MW",
    name: "Malawi",
    phoneCode: "+265",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "MWK",
  },
  {
    countryCode: "ML",
    name: "Mali",
    phoneCode: "+223",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "MR",
    name: "Mauritania",
    phoneCode: "+222",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "MRU",
  },
  {
    countryCode: "MU",
    name: "Mauritius",
    phoneCode: "+230",
    phoneLength: 8,
    inputFormat: "### ####",
    currency: "MUR",
  },
  {
    countryCode: "MZ",
    name: "Mozambique",
    phoneCode: "+258",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "MZN",
  },
  {
    countryCode: "NA",
    name: "Namibia",
    phoneCode: "+264",
    phoneLength: 9,
    inputFormat: "## ### ####",
    currency: "NAD",
  },
  {
    countryCode: "NE",
    name: "Niger",
    phoneCode: "+227",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "RW",
    name: "Rwanda",
    phoneCode: "+250",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "RWF",
  },
  {
    countryCode: "ST",
    name: "São Tomé and Príncipe",
    phoneCode: "+239",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "STN",
  },
  {
    countryCode: "SN",
    name: "Senegal",
    phoneCode: "+221",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "XOF",
  },
  {
    countryCode: "SC",
    name: "Seychelles",
    phoneCode: "+248",
    phoneLength: 7,
    inputFormat: "### ####",
    currency: "SCR",
  },
  {
    countryCode: "SL",
    name: "Sierra Leone",
    phoneCode: "+232",
    phoneLength: 8,
    inputFormat: "## ### ###",
    currency: "SLL",
  },
  {
    countryCode: "SO",
    name: "Somalia",
    phoneCode: "+252",
    phoneLength: 8,
    inputFormat: "## ### ###",
    currency: "SOS",
  },
  {
    countryCode: "SS",
    name: "South Sudan",
    phoneCode: "+211",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "SSP",
  },
  {
    countryCode: "SD",
    name: "Sudan",
    phoneCode: "+249",
    phoneLength: 9,
    inputFormat: "## ### ####",
    currency: "SDG",
  },
  {
    countryCode: "SZ",
    name: "Eswatini",
    phoneCode: "+268",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "SZL",
  },
  {
    countryCode: "TZ",
    name: "Tanzania",
    phoneCode: "+255",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "TZS",
  },
  {
    countryCode: "TG",
    name: "Togo",
    phoneCode: "+228",
    phoneLength: 8,
    inputFormat: "## ## ####",
    currency: "XOF",
  },
  {
    countryCode: "TN",
    name: "Tunisia",
    phoneCode: "+216",
    phoneLength: 8,
    inputFormat: "## ### ###",
    currency: "TND",
  },
  {
    countryCode: "UG",
    name: "Uganda",
    phoneCode: "+256",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "UGX",
  },
  {
    countryCode: "ZM",
    name: "Zambia",
    phoneCode: "+260",
    phoneLength: 9,
    inputFormat: "### ### ###",
    currency: "ZMW",
  },
  {
    countryCode: "ZW",
    name: "Zimbabwe",
    phoneCode: "+263",
    phoneLength: 9,
    inputFormat: "## ### ####",
    currency: "ZWL",
  },
];

// ============================================================================
// SORTING LOGIC
// ============================================================================

const PRIORITY_COUNTRY_VALUES = ["NG", "KE"];

export const COUNTRIES: Country[] = [...UNSORTED_COUNTRIES].sort((a, b) => {
  const aPriority = PRIORITY_COUNTRY_VALUES.indexOf(a.countryCode);
  const bPriority = PRIORITY_COUNTRY_VALUES.indexOf(b.countryCode);

  const aIsPriority = aPriority !== -1;
  const bIsPriority = bPriority !== -1;

  if (aIsPriority && bIsPriority) {
    return aPriority - bPriority;
  }
  if (aIsPriority) return -1;
  if (bIsPriority) return 1;

  return a.name.localeCompare(b.name);
});

// ============================================================================
// HELPER UTILITIES
// ============================================================================

export function getStatesForCountry(countryCode: string): State[] | undefined {
  return (GEOGRAPHY_DATA as Record<string, State[]>)[countryCode];
}

export function getLGAsForState(
  countryCode: string,
  stateName: string,
): LGA[] | undefined {
  const states = getStatesForCountry(countryCode);
  const state = states?.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase(),
  );
  return state?.lgas;
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.countryCode.toLowerCase().includes(lowerQuery),
  );
}
