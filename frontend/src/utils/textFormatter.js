/**
 * Formats the input text by capitalizing the first letter of words
 * that have a length greater than 2 characters.
 * 
 * @param {string} text - The input text to format.
 * @returns {string} - The formatted text.
 */
export const formatInputText = (text) => {
  if (!text) return "";
  
  // Split by spaces to handle words individually, preserving spaces
  // We use a regex to split but keep delimiters (spaces) to reconstruction is exact
  const parts = text.split(/(\s+)/);
  
  const formattedParts = parts.map(part => {
    // If it's whitespace, return as is
    if (/^\s+$/.test(part)) return part;
    
    // Check word length
    if (part.length > 2) {
        // Capitalize first letter, keep rest as is (or lowercase? User said "make the first character... capital")
        // Usually titles are Title Case. User didn't say lower case the rest.
        // But in StudentAdmission existing code: `e.target.value.toLowerCase().replace...` suggests they might want normalized casing.
        // However, "make the first charaacter of that capital" strictly means modify first char.
        // If I type "APPLE", length > 2. First char 'A' is capital. 
        // If I type "apple", -> "Apple".
        // If I type "aPPLE", -> "APPLE" or "Apple"?
        // Given existing code does `toLowerCase()` first, I should probably respect that intention or ask.
        // Existing: `e.target.value.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())` -> Title Case.
        // User request: "whenver we write a word ... whose length is more than 2 characters make the first charaacter of that capital"
        // Implicitly, words <= 2 should NOT have forced capitalization? Or just not enforced?
        // Let's assume we just touch the first character if length > 2.
        
        // However, typical behavior for names/addresses is Title Case.
        // Let's capitalize the first letter and keep the rest as entered, to be safe, UNLESS the user wants strict Title Case.
        // "make the first charaacter of that capital"
        return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return part;
  });
  
  return formattedParts.join("");
};
