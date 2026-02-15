/**
 * Generates credentials based on name.
 * Username: First half of First Name + First half of Last Name + Random 3 digit number
 * Password: Random 8 character string
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns {object} { username, password }
 */
export const generateCredentials = (firstName, lastName) => {
    let usernameBase = '';
    const first = firstName || '';
    const last = lastName || '';

    if (first && last) {
        usernameBase = first.substring(0, Math.ceil(first.length / 2)) + 
                       last.substring(0, Math.ceil(last.length / 2));
    } else {
        usernameBase = first || last || 'student';
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const username = `${usernameBase.toLowerCase()}${randomNum}`;
    
    // Password: Random word/string (using math random base 36)
    const password = Math.random().toString(36).slice(-8);

    return { username, password };
};
