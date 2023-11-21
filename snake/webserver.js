import {
    f_o_cpu_stats__diff, 
    f_sleep_ms, 
    f_o_meminfo
} from "https://raw.githubusercontent.com/jonasfrey/handyhelpers/main/localhost/module.js" 
// from "https://deno.land/x/handyhelpers@1.5/mod.js"

import { Font } from "https://deno.land/x/font/mod.ts";
// Read the font data.
const a_n_u8__font = await Deno.readFile("./CG pixel 4x5.ttf");
// Parse it into the font type.
const o_font = new Font(a_n_u8__font);

import { midi } from "https://deno.land/x/deno_midi/mod.ts";

import {
    O_socket_message, O_monitor
} from "./classes.module.js"

import {
    f_update_o_state, 
    f_on_socket_message
} from "./functions.module.js"


const o_midi_input = new midi.Input();
const o_midi_output = new midi.Output();
// List the available ports.

console.log('please run with "deno run --unstable ..."')

let o_state = {
    a_s_midi_port_device: [],
    a_o_socket: [],
    a_n_u8_midi_message_sent_last: null,
}
let f_update_o_state_proxy = function(
    o_state,
    s_prop, 
    v
){
    console.log(s_prop)
    if(s_prop == 's_midi_port_device'){
        let n_idx = o_state.a_s_midi_port_device.indexOf(v);
        if(o_midi_input.open_port){
            // Close the port.
            o_midi_input.closePort();
            // It's still possible to open an other port, otherwise you can free the device.
            // await o_midi_input.freeDevice();            
        }
        if(o_midi_output.open_port){
            o_midi_output.closePort();
        }

        o_midi_output.openPort(n_idx);
        o_midi_input.openPort(n_idx);
        o_midi_input.on("message", ({ message: o_message, deltaTime }) => {
            console.log(o_message)
        for(let o_socket of o_state.a_o_socket){

            o_socket.send(
                JSON.stringify(
                    new O_socket_message(
                        'f_update_o_state', 
                        ['o_midi_message_input', o_message]
                    )
                )
            );
        }   

        });

    }
    if(s_prop == 'a_n_u8_midi_message_sent_last'){
        let a_n_u8_message = new Uint8Array(v);
        console.log(a_n_u8_message);
        if(o_midi_output.open_port){
            o_midi_output.sendMessage(a_n_u8_message)
        }
    }
    if(s_prop == 'o_text_rasterized'){
        
        // Rasterize and get the layout metrics for the letter 'g' at 17px.
        let { metrics, bitmap } = o_font.rasterize(v?.s_text, v?.n_y_px);
        
        let o_text_rasterized = {
            o_metrics: metrics, 
            a_n__bitmap: bitmap
        } 
        o_socket.send(
            JSON.stringify(
                new O_socket_message(
                    'f_update_o_state', 
                    ['o_text_rasterized', o_text_rasterized]
                )
            )
        );

    }
    return f_update_o_state(...arguments)
}
let o_s_name_function_f__exposed = {
    f_update_o_state: f_update_o_state_proxy
}

Deno.serve(async (req) => {

    if (req.headers.get("upgrade") != "websocket") {

        // console.log(req)
        let o_url = new URL(req.url);
        // console.log(o_url);
        let s_path_file = './client.html';
        if(o_url.pathname != '/'){
            s_path_file = `.`+o_url.pathname
        }
        let a_n_u8__file = null;
        try {
            a_n_u8__file = await Deno.readFile(s_path_file)
            let o_s_ending_s_mime = {
                'js': 'text/javascript',
                'html': 'text/html',
            }
            let s_mime = o_s_ending_s_mime[s_path_file.split('.').pop()];
            if(!s_mime){
                s_mime = 'text/plain'
            }
            return new Response(
                a_n_u8__file,
                { status: 200 , headers:{'Content-Type':s_mime}});
        } catch (error) {
            return new Response(
                'file not found',
                { status: 404 , headers:{type:'text/plain'}});
        }

    }
  
    const { socket: o_socket, response } = Deno.upgradeWebSocket(req);
    o_socket.addEventListener("open", () => {
        //   console.log("a client connected!");
        o_state.a_o_socket.push(
            o_socket
        );
        o_state.a_s_midi_port_device = o_midi_input.getPorts();
        
        o_socket.send(
            JSON.stringify(
                new O_socket_message(
                    'f_update_o_state', 
                    ['a_s_midi_port_device', o_state.a_s_midi_port_device]
                )
            )
        );
        o_socket.send(
            JSON.stringify(
                new O_socket_message(
                    'f_render_gui_comp', 
                    ['o_js__a_s_midi_port_devices']
                )
            )
        );
    });
  
    o_socket.addEventListener("message", async (event) => {
        f_on_socket_message(o_state, event, o_s_name_function_f__exposed);
    });
  
    return response;
  });