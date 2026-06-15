/**
 * UK Postcode Validator
 * Validates UK postcodes according to Royal Mail format
 */

/**
 * Simple UK postcode validation
 * Format: A(A)N(A/N) NAA or similar variations
 * Examples: B1 1AA, SW1A 1AA, M1 1AE, B33 8TH, CR2 6XH, DN55 1PT
 */
export const isValidUKPostcode = (postcode) => {
    if (!postcode || typeof postcode !== 'string') {
        return false;
    }

    // Trim and uppercase
    const cleaned = postcode.trim().toUpperCase();

    // UK postcode regex pattern
    const postcodeRegex =
        /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

    return postcodeRegex.test(cleaned);
};

/**
 * Format postcode to standard format (add space if missing)
 * Input: "B11AA" → Output: "B1 1AA"
 */
export const formatPostcode = (postcode) => {
    if (!postcode) return '';

    const cleaned = postcode
        .trim()
        .toUpperCase()
        .replace(/\s/g, ''); // Remove all spaces

    if (cleaned.length !== 6 && cleaned.length !== 7) {
        return postcode; // Return original if invalid length
    }

    // Add space before last 3 characters
    const outward = cleaned.substring(0, cleaned.length - 3);
    const inward = cleaned.substring(cleaned.length - 3);

    return `${outward} ${inward}`;
};

/**
 * Get postcode district (outward code)
 * Example: "B1 1AA" → "B1"
 */
export const getPostcodeDistrict = (postcode) => {
    if (!isValidUKPostcode(postcode)) {
        return null;
    }

    const cleaned = postcode.trim().toUpperCase();
    const parts = cleaned.split(' ');

    return parts[0] || null;
};

/**
 * Get postcode sector (outward + first digit of inward)
 * Example: "B1 1AA" → "B1 1"
 */
export const getPostcodeSector = (postcode) => {
    if (!isValidUKPostcode(postcode)) {
        return null;
    }

    const cleaned = postcode.trim().toUpperCase();
    const parts = cleaned.split(' ');
    const inward = parts[1] || '';

    return `${parts[0]} ${inward[0]}` || null;
};

/**
 * Get postcode area (first letter(s))
 * Example: "B1 1AA" → "B"
 * Example: "SW1A 1AA" → "SW"
 */
export const getPostcodeArea = (postcode) => {
    if (!postcode) return null;

    const cleaned = postcode.trim().toUpperCase();
    const match = cleaned.match(/^[A-Z]{1,2}/);

    return match ? match[0] : null;
};

/**
 * Validate multiple postcodes
 * Returns array of validation results
 */
export const validatePostcodes = (postcodes) => {
    if (!Array.isArray(postcodes)) {
        return [];
    }

    return postcodes.map((postcode) => ({
        original: postcode,
        isValid: isValidUKPostcode(postcode),
        formatted: isValidUKPostcode(postcode) ? formatPostcode(postcode) : null,
    }));
};

/**
 * UK postcode area codes with their regions
 * Useful for region-based pricing or delivery zones
 */
export const UK_POSTCODE_AREAS = {
    // London
    E: 'East London',
    EC: 'East Central London',
    N: 'North London',
    NW: 'North West London',
    SE: 'South East London',
    SW: 'South West London',
    W: 'West London',
    WC: 'West Central London',

    // Midlands
    B: 'Birmingham',
    CV: 'Coventry',
    DY: 'Dudley',
    WS: 'Walsall',
    WV: 'Wolverhampton',
    ST: 'Stoke-on-Trent',

    // North West
    CH: 'Chester',
    CW: 'Crewe',
    L: 'Liverpool',
    M: 'Manchester',
    SK: 'Stockport',
    WA: 'Warrington',

    // North East
    BD: 'Bradford',
    DL: 'Darlington',
    HD: 'Huddersfield',
    HX: 'Halifax',
    LS: 'Leeds',
    SR: 'Sunderland',
    TS: 'Middlesbrough',
    YO: 'York',

    // South East
    BN: 'Brighton',
    BR: 'Bromley',
    CR: 'Croydon',
    CT: 'Canterbury',
    DA: 'Dartford',
    GU: 'Guildford',
    HA: 'Harrow',
    HP: 'Hemel Hempstead',
    KT: 'Kingston',
    ME: 'Medway',
    OX: 'Oxford',
    PO: 'Portsmouth',
    RG: 'Reading',
    RH: 'Reigate',
    RM: 'Romford',
    SM: 'Sutton',
    SU: 'Surrey',
    TN: 'Tonbridge',
    UB: 'Uxbridge',

    // South West
    BA: 'Bath',
    BH: 'Bournemouth',
    BS: 'Bristol',
    BT: 'Belfast',
    CA: 'Carlisle',
    CB: 'Cambridge',
    CF: 'Cardiff',
    CG: 'Cowbridge',
    CO: 'Colchester',
    DD: 'Dundee',
    DG: 'Dumfries',
    DH: 'Durham',
    DN: 'Doncaster',
    DT: 'Dorchester',
    EH: 'Edinburgh',
    EX: 'Exeter',
    FY: 'Fleetwood',
    GL: 'Gloucester',
    GY: 'Guernsey',
    IM: 'Isle of Man',
    IV: 'Inverness',
    JE: 'Jersey',
    KA: 'Kilmarnock',
    KY: 'Kirkcaldy',
    LD: 'Llandrindod Wells',
    LL: 'Llandudno',
    LN: 'Lincoln',
    ML: 'Motherwell',
    NG: 'Nottingham',
    NN: 'Northampton',
    NR: 'Norwich',
    PA: 'Paisley',
    PE: 'Peterborough',
    PH: 'Perth',
    PL: 'Plymouth',
    PR: 'Preston',
    SA: 'Swansea',
    SG: 'Stevenage',
    SN: 'Swindon',
    SO: 'Southampton',
    SP: 'Salisbury',
    SS: 'Southend',
    SY: 'Shrewsbury',
    TA: 'Taunton',
    TD: 'Kelso',
    TQ: 'Torquay',
    TR: 'Truro',
    UB: 'Uxbridge',
    WD: 'Watford',
    WF: 'Wakefield',
    WN: 'Wigan',
    WR: 'Worcester',
    WS: 'Walsall',
    YD: 'Yate',
    ZE: 'Lerwick',
};

/**
 * Get region name from postcode
 * Example: "B1 1AA" → "Birmingham"
 */
export const getPostcodeRegion = (postcode) => {
    if (!postcode) return null;

    const area = getPostcodeArea(postcode);
    return UK_POSTCODE_AREAS[area] || null;
};

/**
 * Check if two postcodes are in same region
 */
export const isSameRegion = (postcode1, postcode2) => {
    const region1 = getPostcodeRegion(postcode1);
    const region2 = getPostcodeRegion(postcode2);

    return region1 && region2 && region1 === region2;
};

/**
 * Estimate distance category based on postcode regions
 * Used for rough pricing estimates
 * 
 * Returns: 'local' | 'regional' | 'longDistance'
 */
export const estimateDistanceCategory = (postcode1, postcode2) => {
    if (!isValidUKPostcode(postcode1) || !isValidUKPostcode(postcode2)) {
        return 'unknown';
    }

    // Same postcode sector = local
    if (getPostcodeSector(postcode1) === getPostcodeSector(postcode2)) {
        return 'local';
    }

    // Same region = regional
    if (isSameRegion(postcode1, postcode2)) {
        return 'regional';
    }

    // Different regions = long distance
    return 'longDistance';
};

/**
 * Sample postcode validator with suggestions
 */
export const validatePostcodeWithSuggestions = (postcode) => {
    const result = {
        input: postcode,
        isValid: false,
        formatted: null,
        region: null,
        suggestions: [],
    };

    if (!postcode) {
        result.suggestions = [
            'Postcode is required',
            'Format: B1 1AA or SW1A 1AA',
        ];
        return result;
    }

    if (isValidUKPostcode(postcode)) {
        result.isValid = true;
        result.formatted = formatPostcode(postcode);
        result.region = getPostcodeRegion(postcode);
        return result;
    }

    // Invalid - provide suggestions
    const cleaned = postcode.trim().toUpperCase();

    if (cleaned.length < 6) {
        result.suggestions.push('Postcode too short. UK postcodes are 6-7 characters');
    }

    if (cleaned.length > 8) {
        result.suggestions.push(
            'Postcode too long. UK postcodes are 6-7 characters'
        );
    }

    if (!/^[A-Z]/.test(cleaned)) {
        result.suggestions.push('Postcode should start with a letter');
    }

    if (!/[0-9]/.test(cleaned)) {
        result.suggestions.push('Postcode should contain numbers');
    }

    result.suggestions.push('Example valid formats: B1 1AA, SW1A 1AA, M1 1AE');

    return result;
};

export default {
    isValidUKPostcode,
    formatPostcode,
    getPostcodeDistrict,
    getPostcodeSector,
    getPostcodeArea,
    getPostcodeRegion,
    validatePostcodes,
    isSameRegion,
    estimateDistanceCategory,
    validatePostcodeWithSuggestions,
    UK_POSTCODE_AREAS,
};