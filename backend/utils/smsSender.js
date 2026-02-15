const axios = require('axios');

const sendSMS = async (mobileNumber, message) => {
    try {
        if (!mobileNumber) {
            console.log("SMS Skipped: No mobile number provided.");
            return;
        }

        const username = process.env.SMS_USERNAME;
        const password = process.env.SMS_PASSWORD;
        const senderId = process.env.SMS_SENDER_ID || 'SMINT';

        // Prepare the URL
        const apiUrl = 'https://api.smartping.ai/fe/api/v1/send';

        // Make the Request
        const response = await axios.get(apiUrl, {
            params: {
                username: username,
                password: password,
                unicode: 'false',
                from: senderId,
                to: mobileNumber,
                text: message
            }
        });

        console.log(`SMS Sent to ${mobileNumber}:`, response.data);
        return response.data;

    } catch (error) {
        console.error("SMS Sending Failed:", error.message);
        // We don't throw error here to avoid breaking the main registration flow
    }
};

module.exports = sendSMS;