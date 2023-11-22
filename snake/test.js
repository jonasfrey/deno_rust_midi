import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

// x  x xxxx x    x     xx      x  x  xx  xxx  x    xxx      x
// x  x x    x    x    x  x     x  x x  x x  x x    x  x     x
// xxxx xxx  x    x    x  x     x  x x  x xxx  x    x  x     x
// x  x x    x    x    x  x     xxxx x  x x x  x    x  x      
// x  x xxxx xxxx xxxx  xx      x  x  xx  x  x xxxx xxx      x

import { Font } from "https://deno.land/x/font/mod.ts";
// Read the font data.
const a_n_u8__font = await Deno.readFile("./CG pixel 4x5.ttf");
// Parse it into the font type.
const o_font = new Font(a_n_u8__font);

let f_o_rasterized_text = function(
    s_text,
    n_y
){

    console.log(s_text, n_y)
    let a_s_char = s_text.split('')
    let a_o = s_text.split('').map(
        (s_char, n_idx)=>{
            let o = o_font.rasterize(s_char, n_y);
            o.s_char = s_char
            return o
        }
    )
    let o_scl = new O_vec2(0,0);
    let n_factor_char_space_x = 1/5;
    let n_x_max = 0;
    let n_x_avg = 0;
    for(let o of a_o){
        n_x_max = Math.max(o.metrics.width, n_x_max);
        o_scl.n_x += o.metrics.width;
        o_scl.n_y = Math.max(o_scl.n_y, o.metrics.height);
        n_x_avg += o.metrics.width;
    }
    let n_num_of_space_chars = a_s_char.filter(s=>s == ' ').length;
    n_x_avg += n_num_of_space_chars*n_x_max;
    n_x_avg = parseInt(n_x_avg/s_text.length);

    let n_x_space_per_char = Math.ceil(n_x_max*n_factor_char_space_x);
    // console.log(n_x_space_per_char)
    o_scl.n_x += (s_text.length-1)*n_x_space_per_char;// spaces between chars
    o_scl.n_x += n_num_of_space_chars*n_x_avg;// spaces for real space characters ' '
    let a_n_u8__bitmap = new Uint8Array(o_scl.compsmul()).fill(0);
    let o_trn_char = new O_vec2(0)
    for(let o of a_o){
        // console.log(o)
        let o_scl_char = new O_vec2(
            (o.metrics.width == 0) ? n_x_avg : o.metrics.width,
            (o.metrics.height == 0) ? o_scl.n_y : o.metrics.height,
        );
        // console.log(o_scl_char)

        // // console.log(o_scl_char.toString())
        for(let n_idx  = 0; n_idx < o.bitmap.length; n_idx+=1){
            let n_u8 = o.bitmap[n_idx];
            let o_trn_bitmap = o_scl_char.from_index(
                n_idx
            )
            let o_trn_big = o_trn_bitmap.add(o_trn_char);

            let n_idx_big = o_trn_big.to_index(o_scl)
            a_n_u8__bitmap[n_idx_big] = n_u8
        }

        o_trn_char = o_trn_char.add(o_scl_char.n_x, 0).add(n_x_space_per_char, 0)
        // console.log(o_trn_char)
        // console.log(o)
    }
    let o2 = {
        o_scl,
        n_factor_char_space_x,
        n_x_max,
        n_x_avg,
        n_num_of_space_chars,
        // a_n_u8__bitmap,
        a_n__bitmap: [...a_n_u8__bitmap],//json stringify fucking converts a typed array to an object wtfffff
        o_trn_char,
    }
    return o2
}

export {
    f_o_rasterized_text
}
if(Deno.args[0] == 'test_f_o_rasterized_text'){

    let o = f_o_rasterized_text(
    
        'Hello World !',
        5
    );
    console.log(o)
    let s = ''
    for(let n = 0; n<o.a_n__bitmap.length; n+=1){
        if(n%o.o_scl.n_x == 0){
            console.log(s);
            s = ''
        }
        s+=(o.a_n__bitmap[n]) ? 'x': ' ';
    }
    console.log(s);
}
