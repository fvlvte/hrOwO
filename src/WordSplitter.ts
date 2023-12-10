import Speaker from "speaker";
import { ChatGPTAPI } from 'chatgpt';

import speech from "@google-cloud/speech";
import {ttsRun} from "./TTS.js";

async function zapytajHaeruwke(pytanko: string) {
    const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: 'gpt-4',
                temperature: 0.5,
                top_p: 0.8
            }
    },
        )

    const res = await api.sendMessage(`Jesteś na rozmowie rekturacyjnej o prace programisty i dostałeś pytanie: "${pytanko}" odpowiedz na nie w 10 słowach maksymalnie.`);
    console.log(res.text)

    ttsRun(res.text);
}

const client = new speech.SpeechClient();
async function speechToTextAok(base64speech: string) {
    const audio = {
        content: base64speech
    };

    //speaker.write(Buffer.from(base64speech, "base64"));

    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'pl-PL',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    // @ts-ignore
    const [response] = await client.recognize(request);
    return response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
}


export class WordSplitter
{
    readonly AMPLITUDE_THRESHOLD = 25;

    words: Buffer[] = [];
    currentWordBuilder: Buffer = Buffer.from([]);
    counter: number = 0;
    state: number = 0;

    processChunk(chunk: Buffer)
    {
        let averageAmplitude = 0;

        for(let i = 0; i < chunk.length;i += 2)
        {
            averageAmplitude += Math.abs(chunk.readInt16LE(i));
        }

        const audioAmplitudeRatioAvg = (averageAmplitude / chunk.length / 2);
        //console.log(audioAmplitudeRatioAvg);

        if(this.state === 0)
        {
            if(audioAmplitudeRatioAvg > this.AMPLITUDE_THRESHOLD)
            {
                this.state = 1;
                this.currentWordBuilder = Buffer.concat([this.currentWordBuilder, chunk]);
            }
        }
        else if(this.state === 1) {
            this.currentWordBuilder = Buffer.concat([this.currentWordBuilder, chunk]);
            if (audioAmplitudeRatioAvg < this.AMPLITUDE_THRESHOLD) {
                this.counter++;
            } else {
                this.counter = 0;
            }

            if (this.counter >= 2) {
                this.state = 0;
                this.words.push(this.currentWordBuilder);
                speechToTextAok(this.currentWordBuilder.toString("base64")).
                    then(tekscik => {
                        console.log(tekscik);
                        zapytajHaeruwke(tekscik);
                });
                this.currentWordBuilder = Buffer.from([]);
            }
        }
    }
}
