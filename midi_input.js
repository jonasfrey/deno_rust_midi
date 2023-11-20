import { midi } from "https://deno.land/x/deno_midi/mod.ts";

const midi_in = new midi.Input();
// List the available ports.
console.log(midi_in.getPorts());
midi_in.openPort(1); // Open the first available port.

// Set a callback to receive the messages.
// This is the generic callback to receive all the messages
midi_in.on("message", ({ message, deltaTime }) => {
    console.log(message)
  console.log(`Message received at ${deltaTime} : ${message}`);
});

// Stop listening to the event.
// midi_in.off("message");

// // You can listen to more specific messages.
// midi_in.on("note_on", ({ message, deltaTime }) => {
//   console.log(`Note on received at ${deltaTime} : ${message}`);
// });
// midi_in.off("note_on");

// Close the port.
// midi_in.closePort();
// // It's still possible to open an other port, otherwise you can free the device.
// midi_in.freeDevice();