const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function send_sms(number, body) {
    try {
        await client.messages.create({
                body: body,
                from: '+' + JSON.stringify(process.env.TWILIO_NUMBER),
                to: JSON.stringify(number)
            })
            .then(message => {
                console.log(message.sid)
                return true;
            });
    } catch {
        return false
    }
}

module.exports.send_sms = send_sms;