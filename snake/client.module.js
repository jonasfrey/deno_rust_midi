import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@1.4/mod.js";

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

import {
    f_sleep_ms, 
// } from "https://raw.githubusercontent.com/jonasfrey/handyhelpers/main/localhost/module.js" 
} from "https://deno.land/x/handyhelpers@1.5/mod.js"

import {
    f_add_css,
    f_s_css_prefixed
} from "https://deno.land/x/f_add_css@0.6/mod.js"

import {
    O_inoutput,
    O_socket_message
} from "./classes.module.js"


import {
    f_on_socket_message,
    f_update_o_state
} from "./functions.module.js"


let o_state = {
    a_s_midi_port_device: [], 
    a_o_inoutput: [], 
    o_inoutput: new O_inoutput('',0), 
    a_o_game_object: [],
    a_o_game_object__food: [],
    o_scl__canvas: new O_vec2(8),
    o_canvas: null, 
    o_ctx: null, 
    n_fps: 30,//60, 
    n_raf_id: 0,
    n_render_id: 0
};
window.o_state = o_state

let a_n_u32__image = new Uint32Array(o_state.o_scl__canvas.compsmul());
let a_n_u32__image__last = new Uint32Array(a_n_u32__image.length);
a_n_u32__image__last.set(a_n_u32__image);


class O_color{
    constructor(
        n_hex_rgba,
        n_midi 
    ){
        this.n_hex_rgba = n_hex_rgba

        // Extract the bytes
        const byte1 = (this.n_hex_rgba >> 24) & 0xff;
        const byte2 = (this.n_hex_rgba >> 16) & 0xff;
        const byte3 = (this.n_hex_rgba >> 8) & 0xff;
        const byte4 = this.n_hex_rgba & 0xff;

        this.n_hex_abgr = (byte1 << 0) | (byte2 << 8) | (byte3 << 16) | (byte4 << 24);
        this.n_midi = n_midi
    }
}
let o_color__black = new O_color(0x000000ff,0);
let o_color__green = new O_color(0x00e440ff,1);
let o_color__red = new O_color(0xff001dff,3);
let o_color__orange = new O_color(0xff8500ff, 5);

let a_o_color = [
    o_color__black,
    o_color__green,
    o_color__red,
    o_color__orange,
]
class O_game_object{
    constructor(
        o_trn, 
        f_render, 
        o_color
    ){
        this.o_trn = o_trn, 
        this.f_render = f_render, 
        this.o_color = o_color
    }
}
let f_spawn_snake = function(){
    o_state.o_game_object__snake = new O_game_object(
        new O_vec2(0),
        function(){
            if(!this.n_render_modulo){
                this.n_render_modulo = 10; // every tenth frame, can be used as speed
            }
            // debugger
            if(!this.o_trn_last){
                this.o_trn_last = this.o_trn.clone()
            }
            if(!this.o_trn__speed){
                this.o_trn__speed = new O_vec2(1,0);
            }
            if(!this.a_o_game_object){
                this.a_o_game_object = [];
            }
            if((o_state.n_render_id % this.n_render_modulo) == 0){
                
                this.o_trn = this.o_trn.add(this.o_trn__speed)
                .wrap(//.mul(0.1)); if we use sub integer values we have problems with collisions happening on same field multiple times
                    new O_vec2(0), 
                    o_state.o_scl__canvas
                );
    
                    // console.log(this.o_trn.toString())
                let o_game_object__collided_with = o_state.a_o_game_object.find(
                    o=>{
                        if(o == this){return false}
                        return o.o_trn.to_int().toString() == this.o_trn.to_int().toString();
                    }
                )
                
                if(o_game_object__collided_with){
                    let n_idx = o_state.a_o_game_object__food.indexOf(o_game_object__collided_with);
                    if(n_idx == -1){
                        let s_text = 'GAME OVER ! ';
                        o_socket.send(
                            JSON.stringify(
                                new O_socket_message(
                                    'f_update_o_state',
                                    [
                                        'o_rasterized_text',
                                        {
                                            s_text: s_text, 
                                            n_y_px: 5,
                                        }
                                    ]
                                )
                            )
                        )
                    }else{
                        console.log(this.a_o_game_object)
                        let o_trn = this.a_o_game_object?.at(-1)?.o_trn;
                        // console.log(this.a_o_game_object)
                        // debugger
                        if(!o_trn){
                            o_trn = this.o_trn_last; 
                        }
                        let o = new O_game_object(
                            o_trn.clone(),
                            ()=>{},
                            this.o_color
                        );
                        o_state.a_o_game_object.push(o)
                        this.a_o_game_object.push(o)
                    }
                    o_state.a_o_game_object.splice(
                        o_state.a_o_game_object.indexOf(o_game_object__collided_with),
                    1
                    );
                    o_state.a_o_game_object__food.splice(
                        o_state.a_o_game_object__food.indexOf(o_game_object__collided_with),
                    1
                    );
                    f_spawn_food()
                }
                for(
                    let n_idx_reverse = this.a_o_game_object.length-1;
                    n_idx_reverse >=0;
                    n_idx_reverse-=1
                ){
                    let o_trn_before = this.o_trn_last.clone()
                    if(n_idx_reverse > 0){
                        o_trn_before = this.a_o_game_object[n_idx_reverse-1].o_trn.clone()
                    }
                    this.a_o_game_object[n_idx_reverse].o_trn = o_trn_before;
                }
        
                this.o_trn_last = this.o_trn.clone()
                
            }
    
        },
        o_color__red
    )
    o_state.a_o_game_object.push(o_state.o_game_object__snake);
}


// Function to handle keydown events
function handleKeyDown(event) {
    // Check the keyCode or key property of the event
    // to identify which key was pressed
    switch (event.key) {
      case "a":
        o_state.o_game_object__snake.o_trn__speed = new O_vec2(-1,0);
        break;
      case "s":
        o_state.o_game_object__snake.o_trn__speed = new O_vec2(0,1);
        break;
      case "d":
        o_state.o_game_object__snake.o_trn__speed = new O_vec2(1,0);
        break;
      case "w":
        o_state.o_game_object__snake.o_trn__speed = new O_vec2(0,-1);
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }

// Add event listeners for the "keydown" event on the window
window.addEventListener("keydown", handleKeyDown);

let f_spawn_food = function(){
    let o_game_object__food = new O_game_object(
        (()=>{
            let o_game_object = true;
            let o_trn = null;
            while(o_game_object){
                o_trn = o_state.o_scl__canvas.mul(Math.random(), Math.random()).to_inteq();
                o_game_object = o_state.a_o_game_object.find(
                    o=>{
                        return o.o_trn.to_int().toString() == o_trn.toString();
                    }
                )
            } 
            return o_trn
        })(),
        function(){
            // debugger
            if(!this.n_frames_to_live){
                this.n_frames_to_live = Math.random()*1000
            }
            this.n_frames_to_live -=1
            if(this.n_frames_to_live < 0){
                
                o_state.a_o_game_object.splice(
                    o_state.a_o_game_object.indexOf(this)
                    , 1
                );
                window.setTimeout(function(){
                    f_spawn_food();

                },Math.random()*2000)
            }
            // console.log(this.o_trn.toString())
    
        },
        o_color__green
    )
    o_state.a_o_game_object.push(o_game_object__food);
    o_state.a_o_game_object__food.push(o_game_object__food);
}
f_spawn_food();

let o_gui = {
    o_js__a_s_midi_port_device: null, 
    o_js__o_inoutput: null
}
o_gui.o_js__o_inoutput = {
    f_o_js: function(){
        return {
            a_o:[
                {
                    s_tag: "input", 
                    value: o_state.o_inoutput.s_name,
                    oninput: function(o_e){
                        o_state.o_inoutput.s_name = o_e.target.value
                    }
                },
                {
                    innerText: `note: ${o_state.o_inoutput.n_note_number}`
                }
            ]
        }
    }
}
o_gui.o_js__a_s_midi_port_device = {
    f_o_js: function(){
        // console.log('render')
        return {
            style: "position: absolute; top:0; left: 0;z-index:1;background:transparent;",
            a_o: [
                ...o_state.a_s_midi_port_device.map(s=>{
                    console.log(s)
                    return {
                        class : 'clickable',
                        innerText: s, 
                        onclick: function(){
                            o_socket.send(
                                JSON.stringify(
                                    new O_socket_message(
                                        'f_update_o_state', 
                                        ['s_midi_port_device',s]
                                    )
                                )
                            )
                        }
                    }
                })
            ]
        }
    }
}

let n_ms_wpn = window.performance.now();
let n_ms_wpn2 = window.performance.now();
let n_ms_diff_max = 1000/o_state.n_fps;
let n_ms_diff = 0;
let f_raf = function(){
    o_state.n_raf_id = window.requestAnimationFrame(f_raf)

    n_ms_wpn2 = window.performance.now();
    n_ms_diff = n_ms_wpn2-n_ms_wpn;
    if(n_ms_diff > n_ms_diff_max){
        f_render();
        n_ms_wpn = n_ms_wpn2
    }
}
o_state.n_raf_id = window.requestAnimationFrame(f_raf)

let f_update_midi_screen = function(){
    let b_update_whole_screen = true;
    for(let n_idx = 0; n_idx < a_n_u32__image.length; n_idx+=1){
        let n_u32 = a_n_u32__image[n_idx]
        if(
            a_n_u32__image__last[n_idx]!= n_u32
            || b_update_whole_screen
        ){
            // only update things that did change
            let n_color_midi = a_o_color.find(
                o=>{
                    return new Uint32Array([o.n_hex_abgr])[0] == 
                    new Uint32Array([n_u32])[0]
                }
                )?.n_midi;
            // console.log(n_color_midi)
            if(!n_color_midi){
                n_color_midi = 0
            }
            let n_x = n_idx % 8;
            let n_y = parseInt(n_idx / 8);
            n_y = 7-n_y; 
            let n_idx_akai = n_x + n_y*8;
            let a_n_u8_message = [0x90, n_idx_akai, n_color_midi]
            // console.log(a_n_u8_message)
            o_socket.send(
                JSON.stringify(
                    new O_socket_message(
                        'f_update_o_state',
                        [
                            'a_n_u8_midi_message_sent_last',
                            a_n_u8_message
                        ]
                    )
                )
            )

        }
    }

    a_n_u32__image__last = new Uint32Array(a_n_u32__image.length);
    a_n_u32__image__last.set(a_n_u32__image);

}

let o_s_controloption_a_n_midinum = {
    'up': [64,7],
    'down': [65,71],
    'left': [66,70],
    'right': [67,98],
    'restart': [82]
}
let f_render = function(){
    // light up the arrow keys
    [
        [0x90, 64, 1],
        [0x90, 65, 1],
        [0x90, 66, 1],
        [0x90, 67, 1],
    ].map(a=>{
        o_socket.send(
            JSON.stringify(
                new O_socket_message(
                    'f_update_o_state',
                    [
                        'a_n_u8_midi_message_sent_last',
                        a
                    ]
                )
            )
        )
    })

    o_state.n_render_id += 1;
    // for(let n = 0; n<o_state.o_scl__canvas.compsmul(); n+=1){
    //     let o_color = a_o_color[parseInt(Math.random()*a_o_color.length)]
    //     a_n_u32__image[n] = o_color.n_hex_abgr
    // }
    // clear 
    a_n_u32__image = new Uint32Array(o_state.o_scl__canvas.compsmul());
    for(let o_game_object of o_state.a_o_game_object){
        o_game_object.f_render();
        if(
            o_game_object.o_trn.n_x > o_state.o_scl__canvas.n_x 
            ||
            o_game_object.o_trn.n_y > o_state.o_scl__canvas.n_y 
            ||
            o_game_object.o_trn.n_x < 0
            ||
            o_game_object.o_trn.n_y < 0 

        ){
            continue
            // dont even try to render when not inside canvas
        }
        // console.log('o_game_object.o_trn')
        // console.log(o_game_object.o_trn)
        let n_idx = o_game_object.o_trn.to_int().to_index(o_state.o_scl__canvas);
        // console.log(n_idx)
        a_n_u32__image[n_idx] = o_game_object.o_color.n_hex_abgr
    }
    // for(let n_x = 0; n_x < o_state.o_scl__canvas.n_x; n_x+=1){
    //     for(let n_y = 0; n_y < o_state.o_scl__canvas.n_y; n_y+=1){
    //         let o_color = a_o_color[parseInt(Math.random()*a_o_color.length)]
    //         o_state.o_ctx.fillStyle = `#${(o_color.n_hex>>>8).toString(16).padStart(6,'0').toUpperCase()}`
    //         o_state.o_ctx.fillRect(n_x, n_y, 1, 1);
    //     }
    // }
    var o_image_data = new ImageData(
        new Uint8ClampedArray(a_n_u32__image.buffer),
        ...o_state.o_scl__canvas.a_n_comp
    );


    // console.log(o_image_data)

    o_state.o_ctx.putImageData(o_image_data, 0, 0);

    f_update_midi_screen();

}
let f_render_gui_comp = function(
    o_state, 
    s_prop
){
    console.log(s_prop)
    o_gui[s_prop]?._f_render();
}
let f_update_o_state_proxy = function(
    o_state,
    s_prop, 
    v
){
    if(s_prop == 'o_rasterized_text'){

        let o_rasterized_text = v;
        let o =o_rasterized_text;
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
        let a_o = o_rasterized_text.a_n__bitmap.map(
                (n_val, n_idx)=>{
                    if(n_val == 0) {return false} 
                    let o_scl = new O_vec2(
                        o_rasterized_text.o_scl
                    )
                    // let o_trn = o_scl.from_index(n_idx);
                    let n_x = n_idx % o_scl.n_x; 
                    let n_y = parseInt(n_idx / o_scl.n_x);
                    let o_trn = new O_vec2(n_x, n_y)
                    // debugger
                    return new O_game_object(
                        o_trn.clone(),
                        function(){
                            this.o_trn = this.o_trn
                            .add(
                                -0.3, 
                                0// Math.sin((o_state.n_render_id*0.00000001)*.5+.5)*3
                            )
                            .wrap(
                                new O_vec2(0), 
                                o_scl,
                            )
                            // console.log(this.o_trn)
                        }, 
                        (n_val >0)?o_color__orange : o_color__black
                    )

                }
            ).flat().filter(v=>v)
        o_state.a_o_game_object = a_o
        
    }
    if(s_prop == 'o_midi_message_input'){

        if(v?.type == 144){
            if( o_s_controloption_a_n_midinum.down.includes(v?.data?.note)){
                o_state.o_game_object__snake.o_trn__speed = new O_vec2(0,1);
            }
            if( o_s_controloption_a_n_midinum.up.includes(v?.data?.note)){
                o_state.o_game_object__snake.o_trn__speed = new O_vec2(0,-1);
            }   
            if( o_s_controloption_a_n_midinum.left.includes(v?.data?.note)){
                o_state.o_game_object__snake.o_trn__speed = new O_vec2(-1,0);
            }
            if( o_s_controloption_a_n_midinum.right.includes(v?.data?.note)){
                o_state.o_game_object__snake.o_trn__speed = new O_vec2(1,0);
            }
            if( o_s_controloption_a_n_midinum.restart.includes(v?.data?.note)){
                o_state.a_o_game_object = []
                f_spawn_snake()
                f_spawn_food()
            }
        }
        o_socket.send(
            JSON.stringify(
                new O_socket_message(
                    'f_update_o_state',
                    [
                        'a_n_u8_midi_message_sent_last',
                        [0x90, v?.data?.note, (v?.type) ? 1: 0]
                    ]
                )
            )
        )
        let o_inoutput = o_state.a_o_inoutput.find(o=>o.n_note_number == v.data.note);
        if(!o_inoutput){
            o_inoutput = new O_inoutput(
                '',
                v.data.note, 
            )
            o_state.a_o_inoutput.push(o_inoutput)
        }
        // console.log(v)
        o_state.o_inoutput = o_inoutput
        
        o_gui.o_js__o_inoutput._f_render();
    }

    return f_update_o_state(...arguments)
}

let o_s_name_function_f__exposed = {
    f_update_o_state: f_update_o_state_proxy, 
    f_render_gui_comp
}

var o_socket = new WebSocket('ws://localhost:8000/');


let o_js__all= {
    f_o_js: function(){
        return {
            a_o:[
                {
                    s_tag: "canvas", 
                    
                },
                {
                    class: "clickable", 
                    onclick: function(){
                        o_socket.send(
                            JSON.stringify(
                                new O_socket_message(
                                    'f_update_a_s_midi_port_device'
                                )
                            )
                        )
                    }
                },
                o_gui.o_js__a_s_midi_port_device, 
                o_gui.o_js__o_inoutput
            ],
        }
    }
}

let o = {
    a_o:[
        o_js__all, 
    ]
}

var o_html = f_o_html_from_o_js(o);
document.body.className = 'theme_dark'
document.body.appendChild(o_html)

o_state.o_canvas = document.querySelector('canvas');
o_state.o_canvas.width = o_state.o_scl__canvas.n_x;
o_state.o_canvas.height = o_state.o_scl__canvas.n_x;
o_state.o_ctx = o_state.o_canvas.getContext("2d");


let f_resize_canvas = function(){
    let a_o_canvas = Array.from(document.querySelectorAll('canvas'));
    for(let o_canvas of a_o_canvas){
        let o_box = o_canvas.parentElement.getBoundingClientRect();
        o_canvas.style.width = o_box.width;
        o_canvas.style.height = o_box.height;
        o_canvas.style.imageRendering = 'pixelated';
    }
}

window.onresize = f_resize_canvas
f_resize_canvas();




o_socket.addEventListener('open', function (event) {
    // console.log('Message from server ', event.data);
    // debugger
    // let a_o_state = JSON.parse(event.data);
    // o_state.a_o_state = a_o_state;


    let s_text = 'PRESS START! ';
    o_socket.send(
        JSON.stringify(
            new O_socket_message(
                'f_update_o_state',
                [
                    'o_rasterized_text',
                    {
                        s_text: s_text, 
                        n_y_px: 5,
                    }
                ]
            )
        )
    )
    o_socket.send(
        JSON.stringify(
            new O_socket_message(
                'f_update_o_state',
                [
                    'a_n_u8_midi_message_sent_last',
                    [0x90, o_s_controloption_a_n_midinum.restart[0], 1]
                ]
            )
        )
    )

});

o_socket.addEventListener('message', function (event) {

    f_on_socket_message(
        o_state,
        event, 
        o_s_name_function_f__exposed
    )
});





let o_style = document.createElement('style');
o_style.innerHTML = `
*{
    margin:0;
    padding:0;
}
`
document.head.appendChild(o_style)
f_add_css(
    `
    .inputs{

        background:transparent;
    }
    body{
        overflow: hidden;
    }
    .highlight{
        
        background: orange !important;
    }
    canvas{
        width: 100%;
        height: 100%;
    }
    `
)
import "./css.js"