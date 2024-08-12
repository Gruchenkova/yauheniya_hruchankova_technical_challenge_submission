function generatePrompt() {
    var pose = "";

    if (variables['2692a597-f67a-4724-ae41-303847a6615a']?.['pose'] != null) {
        pose = variables['2692a597-f67a-4724-ae41-303847a6615a']?.['pose'].prompt_realistic + ",";
    }

    var clothes = wwFormulas.if(wwFormulas.length(variables['2692a597-f67a-4724-ae41-303847a6615a']?.['clothes']) > 0, wwFormulas.rollup(variables['2692a597-f67a-4724-ae41-303847a6615a']?.['clothes'], "prompt_realistic"), "")

    var customPrompt = variables[/* Custom Image Prompt - value */ '118a372e-9288-4770-ab72-f8e00ded276b-value']

    return customPrompt + ", " + clothes + " " + pose;
}

const jsonData = {
    "character_id": variables['2692a597-f67a-4724-ae41-303847a6615a']?.['character_id'],
    "style": variables['2692a597-f67a-4724-ae41-303847a6615a']?.['style'],
    "prompt": generatePrompt(),
    "hair_color": variables['1111a597-f67a-1724-ae41-52384713415c']?.['hair_color']  // hair_color parameter added
};

const token = pluginVariables[/* Xano Auth accessToken */ 'f5856798-485d-47be-b433-d43d771c64e1']['accessToken'];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendRequestWithRetries(url, data, headers, maxRetries = 5) {  // Retry limit updated to 5
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            console.log("attempt " + attempt)

            const response = await axios.post(url, data, { headers });
            return response;
        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                attempt++;
                console.error(`Attempt ${attempt}`);
                if (attempt >= maxRetries) {
                    throw error;
                }
                await sleep(2000);  // Delay increased to 2 seconds
            } else {
                throw error;
            }
        }
    }
}

try {
    const response = await sendRequestWithRetries(
        'https://xewp-pyfx-jmic.n7c.xano.io/api:v_TzjXqA/image/request',
        jsonData,
        { 'Authorization': `Bearer ${token}` }
    );

    return response;
} catch (error) {
    throw error;
    console.error('Final Error:', error);
    alert('An error occurred after multiple attempts.');
}
