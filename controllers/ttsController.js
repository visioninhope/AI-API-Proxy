require('dotenv').config();
const needle = require('needle');
const url = require('url');

//create the route
const streamUnrealSpeech = async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy e.g city here
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.UNREAL_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.UNREALSPEECH_URL}?${params}`, data, options);
        
        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'audio/mpeg')
            res.send(apiResponse.body)
        } else {
            res.set('Content-Type', 'plain/text')
            res.status(apiResponse.statusCode).send(apiResponse.body);
        }
    }
    catch (err) {
        console.log(err.message)       
        res.status(500).json(err.message);
    }
}

module.exports = {
    streamUnrealSpeech
}