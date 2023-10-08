const express = require('express');
const cors = require('cors');

const fs = require('fs');

const OpenAi = require('openai');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));


// --------------------------------- //
dotenv.config(
    { path: './config.env' }
);

const ACCESS_URL = process.env.ACCESS_URL;
const API_KEY = process.env.API_KEY;

mongoose.connect(ACCESS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('connected')
    })
    .catch((err) => {
        console.log('not connected', err)
    });


const configuration = {
    apiKey: API_KEY,
};

const openai = new OpenAi(configuration);

const fetch_response = async (prompt) => {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt }],
    });

    return chatCompletion.choices[0].message.content;
}

const journeySchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    journey: {
        type: String,
        require: true
    },
    days: {
        type: Number,
        required: true
    }
});

app.get('/', async (req, res) => {

    const { s, e, d } = req.query;

    const JourneyModel = mongoose.model(`${s}_${e}_trip`, journeySchema);
    const response = await JourneyModel.find({ days: d });

    if (response.length === 0) {
        const PROMPT = `create a well planned trip from ${s} to ${e} for ${d} days (keeping atleast one sustainable point in mind)`;
        const AI_resp = await fetch_response(PROMPT);

        fs.appendFileSync('./.log', `new openai request at ${new Date().getTime()} [ip: ${req.ip}, s: ${s}, e: ${e}, d: ${d}]\n`)

        await JourneyModel.create({
            start: s,
            end: e,
            journey: AI_resp,
            days: d
        })

        return res.json({
            content: [{ journey: AI_resp, start: s, end: e, days: d }]
        });
    }
    else {
        fs.appendFileSync('./.log', `mongodb request at ${new Date().getTime()} [ip: ${req.ip}, s: ${s}, e: ${e}, d: ${d}]\n`)

        return res.json({
            content: response
        })
    }
})

// ---------------------- //
const PORT = 8000;
app.listen(PORT, () => {
    console.log('Listening.........')
});
