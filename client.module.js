import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@1.4/mod.js";


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

window.o_state = {
    a_s_midi_port_device: [], 
    a_o_inoutput: [], 
    o_inoutput: new O_inoutput('',0)
};

console.log(o_state.o_inoutput)
let o_gui = {
    o_js__a_s_midi_port_devices: null, 
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
o_gui.o_js__a_s_midi_port_devices = {
    f_o_js: function(){
        console.log('render')
        return {
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
    console.log(s_prop)
    if(s_prop == 'o_midi_message_input'){
        let o_inoutput = o_state.a_o_inoutput.find(o=>o.n_note_number == v.data.note);
        if(!o_inoutput){
            o_inoutput = new O_inoutput(
                '',
                v.data.note, 
            )
            o_state.a_o_inoutput.push(o_inoutput)
        }
        console.log(v)
        o_state.o_inoutput = o_inoutput
        
        o_gui.o_js__o_inoutput._f_render();
        console.log(v)
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
                o_gui.o_js__a_s_midi_port_devices, 
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

o_socket.addEventListener('open', function (event) {
    // console.log('Message from server ', event.data);
    // debugger
    // let a_o_state = JSON.parse(event.data);
    // o_state.a_o_state = a_o_state;
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