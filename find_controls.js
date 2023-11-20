import { midi } from "https://deno.land/x/deno_midi/mod.ts";

import { decode } from "https://deno.land/x/pngs/mod.ts";

import {
    f_sleep_ms
} from "https://deno.land/x/handyhelpers@0.6/mod.js"



const midi_out = new midi.Output();
console.log(midi_out.getPorts());


midi_out.openPort(1);
// midi_out.sendMessage([0x90, 0, 1]);

for(let n = 0; n<127; n+=1){
    // no dealy at all does not work 
    // await f_sleep_ms(5)// does not work, not enought delay
    // await f_sleep_ms(10)// does not work, not enought delay
    // await f_sleep_ms(15) // does work
    await f_sleep_ms(10)// does work

    for(let n_idx = 0; n_idx<127; n_idx+=1){
        await f_sleep_ms(30)
        console.log(n)
        midi_out.sendMessage([0x90, n_idx%(8*8+8+8), n % 6]);
    }
}
Deno.exit()
