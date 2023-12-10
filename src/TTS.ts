import textToSpeech from "@google-cloud/text-to-speech";
// Import other required libraries
import fs from "fs";

import WaveFile from 'wavefile';


import Speaker from "speaker";


import util from "util";
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
export async function ttsRun(ttsText: string) {
    // The text to synthesize
    const text = ttsText;

    // Construct the request
    const request = {
        input: {text: text},
        // Select the language and SSML voice gender (optional)
        voice: {languageCode: 'pl-PL', ssmlGender: 'NEUTRAL'},
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'LINEAR16'},
    };

    // Performs the text-to-speech request
    // @ts-ignore
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    console.log(response);

    const speaker = new Speaker({
        channels: 1,
        bitDepth: 16,
        sampleRate: 24000
    });
    let wav = new WaveFile.WaveFile(response.audioContent);
    // @ts-ignore
    speaker.write(wav.data.samples);
    speaker.end();
    console.log(wav);
    //console.log('Audio content written to file: output.mp3');
}
