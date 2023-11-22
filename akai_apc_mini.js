import { midi } from "https://deno.land/x/deno_midi/mod.ts";
import {
  f_sleep_ms
} from "https://deno.land/x/handyhelpers@0.6/mod.js"


const midi_out = new midi.Output();
console.log(midi_out.getPorts());

midi_out.openPort(1);

// midi_out.sendMessage([0x90, 0, 2]);
// midi_out.sendMessage([0x90, 64, 0]);
// midi_out.sendMessage([0x90, 82, 4]);
for(let n1 = 0; n1 < 10000; n1+=1){
  await f_sleep_ms(11);//the minimum delay required to get a working update of the state// ca. 83 fps
  for(let n = 0; n< 64; n+=1){
    midi_out.sendMessage([0x90, n,[1,3,5][parseInt(Math.random()*3)]]);
  
  }
}



// for(let n = 0; n< 255; n+=1){
//   await f_sleep_ms(100);
//   let n2 = 64+n
//   console.log(n2)
//   // midi_out.sendMessage([0x90, n2,1]);
// }
