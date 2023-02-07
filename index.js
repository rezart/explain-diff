const request = require('request');

async function run() {
    const diff = process.env.INPUT_DIFF;
    const apiKey = process.env.INPUT_APIKEY;

    console.log('diff: ', diff)

    const options = {
        url: 'https://api.openai.com/v1/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        json: {
            prompt: `I want you to act as a code review assistant. I will provide you with code snippets, and you will need to evaluate them and provide feedback on best practices, potential bugs, and optimizations. Please focus on providing actionable feedback that can help improve the code and avoid providing vague or general comments. Your feedback should be clear and specific, and you can point out any relevant documentation or resources that could be used to improve the code. Please do not provide any new code or solutions, just evaluate the code provided. My first code snippet is::\n${diff}`,
            model: 'text-davinci-003',
            max_tokens: 2048,
            temperature: 0.7,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                reject(body);
                return;
            }

            const explanation = body.choices[0].text;
            resolve(explanation);
        });
    });
}

run().then(explanation => {
    console.log(explanation);
    console.log(`::set-output name=explanation::${explanation}`);
    process.exit(0);
}).catch(error => {
    console.error(error);
    process.exit(1);
});
