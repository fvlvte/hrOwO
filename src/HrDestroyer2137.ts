import speech from "@google-cloud/speech";
import {WordSplitter} from "./WordSplitter.js";

import portAudio from "naudiodon";

const client = new speech.SpeechClient();
const ws= new WordSplitter();
async function gownotest(gowno: any) {
// The path to the remote LINEAR16 file stored in Google Cloud Storage
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: gowno
    };
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
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}

export class AudioForwarder
{
    ao: any;
    bubfer: any;
    constructor() {
        // @ts-ignore
        this.ao = new portAudio.AudioIO({
            outOptions: {
                channelCount: 1,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 44100,
                deviceId: -1, // Use -1 or omit the deviceId to select the default device
                closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
            }
        });
        this.bubfer = Buffer.from([]);
    }

    pipeAudioXd(pipa)
    {
        pipa.on("data",chunk=>{
            ws.processChunk(chunk);
            //console.log(chunk.length);
            /*for(let i = 0; i < chunk.length;i += chunk.length / 8)
            {
                console.log(chunk.readInt16LE(i))
            }*/
            this.bubfer = Buffer.concat([this.bubfer, chunk]);
        });
       /* setTimeout(() => {
            const araara = Buffer.from(this.bubfer);
            gownotest(araara.toString("base64"));
        }, 5000);*/
    }
}
