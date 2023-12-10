import portAudio from "naudiodon";
import {AudioForwarder} from "./HrDestroyer2137.js";

const audioForwarder = new AudioForwarder();

// @ts-ignore
const ai = new portAudio.AudioIO({
    inOptions: {
        channelCount: 1,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 44100,
        deviceId: 23, // Use -1 or omit the deviceId to select the default device
        closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
    }
});

ai.start();
audioForwarder.pipeAudioXd(ai);

