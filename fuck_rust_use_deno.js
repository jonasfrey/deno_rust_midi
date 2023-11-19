import { midi } from "https://deno.land/x/deno_midi/mod.ts";

import { decode } from "https://deno.land/x/pngs/mod.ts";

import {
    f_sleep_ms
} from "https://deno.land/x/handyhelpers@0.6/mod.js"



const midi_out = new midi.Output();
console.log(midi_out.getPorts());


midi_out.openPort(1);

for(let n = 0; n<100; n+=1){
    // no dealy at all does not work 
    // await f_sleep_ms(5)// does not work, not enought delay
    // await f_sleep_ms(10)// does not work, not enought delay
    await f_sleep_ms(15) // does work
    // await f_sleep_ms(20)// does work
    for(let n_index_pixel = 0; n_index_pixel<64; n_index_pixel+=1){
        midi_out.sendMessage([0x90, n_index_pixel, [1,3,5][parseInt(Math.random()*3)]]);
    }
}
Deno.exit()

// // Can also be sent with a helper class for better readability.
// midi_out.sendMessage(new midi.NoteOn({ note: 0x3C, velocity: 0x7F }));
// // Send a note off after 1 second.
// setTimeout(() => {
//   midi_out.sendMessage([0x80, 0x3C, 0x2F]);
//   midi_out.sendMessage(new midi.NoteOff({ note: 0x3C, velocity: 0x7F }));
// }, 1000);j

let s_path = './bad_apple_downsized2/';

let a_s_path_file = []
for await (const o_entry of Deno.readDir(s_path)) {
    if(o_entry.isFile){
        a_s_path_file.push(`${s_path}/${o_entry.name}`)
    }
}
a_s_path_file.sort((s1,s2)=>{
    let n1 = s1.split('/').pop().split('.').shift().split('_').pop();
    let n2 = s2.split('/').pop().split('.').shift().split('_').pop();
    // console.log(n1)
    return parseInt(n1) - parseInt(n2)
});
console.log(a_s_path_file)
let n_fps = 29.97;
let n_ms_target = 1000/n_fps;
let n_ms_wpn = window.performance.now();

let a_o_img = []
console.log('loading image files and decoding')
for(let s_path_file of a_s_path_file){
    let a_n_u8_image_encoded = await Deno.readFile(s_path_file);
    let o_img = decode(a_n_u8_image_encoded);
    // console.log(o_img);
    a_o_img.push(o_img)
    // console.log(s_path_file)
}

for(let o_img of a_o_img){

    let n_idx_image = a_o_img.indexOf(o_img)
    if(n_idx_image == 6302){
        let n2 = 0;
        let s = '';
        for(let n of o_img.image){
            if(n2 % 8 == 0){
                console.log(s)
                s = '';
            }
            s+=(n > 0) ? 'x': ' ';
            n2+=1;
        }
        console.log(o_img.image);
    }else{
        continue
    }
    // console.log(`image ${n_idx_image} of ${a_o_img.length}`)
    let n_ms_wpn2 = window.performance.now();
    let n_ms_wpn_diff = Math.abs(n_ms_wpn2-n_ms_wpn);
    // console.log(o_img)

    if(o_img.image.length != 64){
        continue
    }

    for(let n_idx = 0; n_idx < o_img.image.length; n_idx+=1){

        // println!("Pixel at ({}, {}) has data: {:?}", x, y, pixel);
        let n_x = n_idx % 8;
        let n_y = parseInt(n_idx / 8);
        n_y = 7-n_y; 
        let n_idx_akai = n_x + n_y*8;
        let a_n_midi = new Uint8Array([0x90, n_idx_akai, 0x05])
        if(o_img.image[n_idx] == 0) {
            a_n_midi[2] = 0
        }
        console.log(a_n_midi)
        midi_out.sendMessage(a_n_midi);
        
        // console.log(n_idx_akai)
    }

    await f_sleep_ms(100)

    if(Math.abs(n_ms_wpn_diff - n_ms_target) > 2){
        console.log(`script is to slow to keep up with target of ${n_fps} fps, ddiff ms ${n_ms_wpn_diff}`)
    }else{
        let n_ms_diff2 = n_ms_target - n_ms_wpn_diff;
        
        await f_sleep_ms(n_ms_diff2)
    }

    n_ms_wpn = n_ms_wpn2;
}
