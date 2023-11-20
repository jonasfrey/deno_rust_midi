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
    O_socket_message
} from "./classes.module.js"


import {
    f_on_socket_message,
    f_update_o_monitor
} from "./functions.module.js"

window.o_state = {
    a_o_cpu_stats__diff: [],
    a_o_meminfo: [],
    a_o_monitor: [], 
    a_o_graph_prop: [],
    b_show_add_prop: false,
    s_text_a_o_graph_prop_filter: ''
};

let f_s_html_highlighted = function(inputText, searchText) {
    // Create a regular expression, escaping special characters in the search text
    // and setting it to be case-insensitive ('i') and to find all matches ('g')
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    // Replace the found text with highlighted span
    return inputText.replace(regex, function(match) {
        return `<span class='highlight'>${match}</span>`;
    });
}
class O_graph_prop{
    constructor(
        s_name, 
        s_color,
        b_active, 
    ){
        this.s_name = s_name, 
        this.s_color = s_color,
        this.b_active = b_active 
    }
}
let o_js__a_o_graph_prop = null;
let o_js__a_o_graph_prop_active = null; 
let o_js__a_o_graph_prop_selection = null; 


let f_draw_percentage_lines = function(
    o_canvas,
    o_ctx, 
    n_lines = 4
){
    let o_scl_canvas = new O_vec2(o_canvas?.clientWidth, o_canvas?.clientHeight);

    for(let n_x = 0; n_x < n_lines; n_x+=1){
        let o_trn = o_scl_canvas.div(n_lines).mul(n_x);
        o_ctx.strokeStyle = 'white';
        o_ctx.fillStyle = 'white';
        o_ctx.beginPath()
        o_ctx.moveTo(0,o_trn.n_y);
        o_ctx.lineTo(o_scl_canvas.n_x, o_trn.n_y);
        o_ctx.stroke()
        let s_text = (o_trn.n_y/o_scl_canvas.n_y).toFixed(2)
        
        let n_px = parseInt((o_scl_canvas.n_y/n_lines)/2)
        o_ctx.font = `${n_px}px monospace`;
        let o_text = o_ctx.measureText(s_text);
        o_ctx.fillText(s_text, o_scl_canvas.n_x-o_text.width, o_scl_canvas.n_y -o_trn.n_y);
    }
}

let f_init_a_o_monitor = function(
    o_state, 
    a_o_monitor
){
    o_state.a_o_monitor = a_o_monitor
    f_update_array(
        o_state,
        'a_o_cpu_stats__diff', 
        null, 
        o_state.a_o_monitor.find(o=>o.s_name == 'cpu').n_max
    )
    f_update_array(
        o_state,
        'a_o_meminfo', 
        null, 
        o_state.a_o_monitor.find(o=>o.s_name == 'ram').n_max
    )


    let f_o_js__o_monitor = function(o_monitor){
        return {
            f_o_js: function(){
                return {
                    class: o_monitor.s_name, 
                    a_o: [
                        {
                            s_tag: "canvas", 
                        }, 

                        {
                            a_o: [
                                {
                                    class: "inputs",
                                    a_o: [

                                        {
                                            s_tag: "label", 
                                            innerText: "n_fps"
                                        },
                                        {
                                            s_tag: 'input',
                                            class: "clickable",
                                            type: "number",
                                            value: o_monitor.n_fps,
                                            oninput: function(o_e){
                                                o_monitor.n_fps = parseInt(o_e.target.value)
                                                o_socket.send(
                                                    JSON.stringify(
                                                        new O_socket_message(
                                                            'f_update_o_monitor', 
                                                            [
                                                                o_monitor, 
                                                                o_state
                                                            ]
                                                        )
                                                    )
                                                )
                                            }
                                        },
                                        {
                                            s_tag: "label", 
                                            innerText: "n_max"
                                        },
                                        {
                                            s_tag: 'input',
                                            type: "number",
                                            class: "clickable",
                    
                                            value: o_monitor.n_max,
                                            oninput: function(o_e){
                                                o_monitor.n_max = parseInt(parseInt(o_e.target.value))
                                                o_socket.send(
                                                    JSON.stringify(
                                                        new O_socket_message(
                                                            'f_update_o_monitor', 
                                                            [
                                                                o_monitor, 
                                                                o_state
                                                            ]
                                                        )
                                                    )
                                                )
                                                f_update_array(
                                                    o_state,
                                                    (o_monitor.s_name == 'cpu') ? 'a_o_cpu_stats__diff': 'a_o_meminfo', 
                                                    null, 
                                                    o_monitor.n_max
                                                )
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    o_js__a_o_graph_prop_selection = {
        f_o_js: function(){
            return {
                a_o : [
                    ...o_state.a_o_graph_prop
                    .filter(o=>{
                        let b = !o.b_active
                        if(o_state.s_text_a_o_graph_prop_filter.trim() != ''){
                            b = b && o.s_name.toLowerCase().includes(o_state.s_text_a_o_graph_prop_filter.toLowerCase().trim())
                        }
                        return b
                    })
                    .map(o_graph_prop=>{
                        console.log(o_graph_prop)
                    return {
                        style: `display:${(o_state.b_show_add_prop)?"block": 'none'}`,
                        // b_render: o_state.b_show_add_prop,
                        a_o: [
                            {
                                s_tag: "label", 
                                innerHTML: (()=>{
                                    return f_s_html_highlighted(
                                        o_graph_prop.s_name, 
                                        o_state.s_text_a_o_graph_prop_filter
                                    )
                                })()
                            }, 
                            {
                                s_tag: "input", 
                                type: "color", 
                                value: o_graph_prop.s_color,
                                oninput: function(o_e){
                                    o_graph_prop.s_color = o_e.target.value
                                }
                            }, 
                            {
                                s_tag: 'button', 
                                class: "clickable",
                                innerText: "add", 
                                onclick: function(){
                                    o_graph_prop.b_active = true;
                                    o_state.b_show_add_prop = false;
                                    o_js__a_o_graph_prop_active._f_render();
                                    o_js__a_o_graph_prop_selection._f_render();
                                }
                            }
                        ]
                    }
                }), 
                ]
            }
        }
    }
    o_js__a_o_graph_prop_active = {
        f_o_js: function(){
            return {
                a_o:[
                    ...o_state.a_o_graph_prop.filter(o=>o.b_active).map(o_graph_prop=>{
                        return {
                            a_o: [
                                {
                                    s_tag: "label", 
                                    innerText: o_graph_prop.s_name
                                }, 
                                {
                                    s_tag: "input", 
                                    type: "color", 
                                    value: o_graph_prop.s_color,
                                    oninput: function(o_e){
                                        o_graph_prop.s_color = o_e.target.value
                                    }
                                }, 
                                {
                                    s_tag: 'button', 
                                    class: "clickable",
                                    innerText: "remove", 
                                    onclick: function(){
                                        o_graph_prop.b_active = false;
                                        o_js__a_o_graph_prop_active._f_render();
                                    }
                                }    
                            ]
                        }
                    }), 
                ]
            }
        }
    }
    o_js__a_o_graph_prop = {
        f_o_js: function(){

            return {
                a_o: [
                    {
                        s_tag: "label", 
                        innerText: "add property", 
                        class: "clickable"
                    },
                    {
                        s_tag: 'input', 
                        type: "text",
                        class: "clickable",
                        // onblur: function(){
                        //     o_state.b_show_add_prop = false;
                        //     o_js__a_o_graph_prop_selection._f_render()
                        // },
                        onfocus: function(){
                            o_state.b_show_add_prop = true;
                            o_js__a_o_graph_prop_selection._f_render()
                        },
                        oninput: function(o_e){
                            o_state.s_text_a_o_graph_prop_filter = o_e.target.value;
                            o_state.b_show_add_prop = true;

                            o_js__a_o_graph_prop_selection._f_render()
                        }
                    },
                    
                ]
            }
        }
    }
    let o_js__all= {
        f_o_js: function(){
            return {

                a_o:[
                    ...o_state.a_o_monitor.map((o_monitor)=>{
                        return f_o_js__o_monitor(o_monitor)
                    }),
                    o_js__a_o_graph_prop,
                    o_js__a_o_graph_prop_active,
                    o_js__a_o_graph_prop_selection
        
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

    let f_animate = async function(){
        let o_canvas = document.querySelector('.ram canvas');
        let o_ctx = o_canvas?.getContext('2d');
        let o_scl_canvas = new O_vec2(o_canvas?.clientWidth, o_canvas?.clientHeight);
        
        o_ctx.fillStyle = 'black';
        o_ctx.fillRect(
            0,0,
            ...o_scl_canvas.a_n_comp, 
            
            )
        o_ctx.fill();
        f_draw_percentage_lines(o_canvas, o_ctx)

        let a_o_graph_prop_active = o_state.a_o_graph_prop.filter(o=>o.b_active);
        for(let n_idx_o_meminfo in o_state.a_o_meminfo){
            n_idx_o_meminfo = parseInt(n_idx_o_meminfo)
            let o_meminfo = o_state.a_o_meminfo[n_idx_o_meminfo];
            let o_meminfo_last = o_state.a_o_meminfo[n_idx_o_meminfo+1];
            if(!o_meminfo || !o_meminfo_last){
                continue
            }
            
            for(let o_graph_prop of a_o_graph_prop_active){
                
                let n_nor = o_meminfo[`o_meminfo_property_${o_graph_prop.s_name}`].n_nor_by_mem_total
                let n_nor_last = o_meminfo_last[`o_meminfo_property_${o_graph_prop.s_name}`].n_nor_by_mem_total
                let o_trn_o_meminfo = o_scl_canvas
                .div(o_state.a_o_meminfo.length, 1)
                .mul(n_idx_o_meminfo, 1);
                let o_trn_o_meminfo_last = o_scl_canvas
                .div(o_state.a_o_meminfo.length, 1)
                .mul(n_idx_o_meminfo+1, 1);
    
                // console.log(o_scl_canvas
                    // .div(o_state.a_o_meminfo.length, 1))
                o_ctx.fillStyle = o_graph_prop.s_color//'rgba(0,255,0,0.5)';
                o_ctx.strokeStyle = o_graph_prop.s_color//'rgba(0,255,0,0.5)';
                o_ctx.beginPath()
                o_ctx.moveTo(
                    o_scl_canvas.n_x - o_trn_o_meminfo_last.n_x,
                    (1.-n_nor_last) * o_scl_canvas.n_y
                )
                o_ctx.lineTo(
                    o_scl_canvas.n_x - o_trn_o_meminfo.n_x,
                    (1.-n_nor) * o_scl_canvas.n_y
                )
                // o_ctx.fillRect(
                //     o_scl_canvas.n_x - o_trn_o_meminfo.n_x, 
                //     (1.-n_nor) * o_scl_canvas.n_y, 
                //     10, 
                //     10
                // )
                // o_ctx.fill();
                o_ctx.stroke();

            }
            
        }
        await f_sleep_ms(1000/a_o_monitor.find(o=>o.s_name == 'ram').n_fps)
        f_animate();
    }
    f_animate();

}
let f_s_hex__from_hsla = function(h,s,l){
    // Convert normalized hue to degrees
    h *= 360;

    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
    
}
let f_update_a_o_graph_prop = function(){
    if(
        o_state.a_o_cpu_stats__diff[0]
        && 
        o_state.a_o_meminfo[0]
        && 
        o_state.a_o_graph_prop.length == 0
    ){
        o_state.a_o_graph_prop.push(
            ...o_state.a_o_cpu_stats__diff[0].a_o_cpu_core_stats__diff.map(
                    (o_cpu_core_stats__diff, n_idx) =>{
                        let n_idx_nor = n_idx / o_state.a_o_cpu_stats__diff[0].a_o_cpu_core_stats__diff.length
                        
                        return new O_graph_prop(
                            `cpu${n_idx}`, 
                            f_s_hex__from_hsla(n_idx_nor, 1.,0.5),
                            // fucking html color ppicker does not support hsla //`hsla(${parseInt(n_idx_nor*360)}, 100%, 50%, 0.8)`, 
                            false
                        )
                    }
    
                ),
            ...o_state.a_o_meminfo[0].a_o_meminfo_property.map(
                (o_meminfo_property,n_idx) =>{
                    let n_idx_nor = n_idx / (o_state.a_o_meminfo[0].a_o_meminfo_property.length)
                    return new O_graph_prop(
                        `${o_meminfo_property.s_name}`, 
                        f_s_hex__from_hsla(n_idx_nor, 1.,0.5),
                        // fucking html color ppicker does not support hsla //`hsla(${parseInt(n_idx_nor*360)}, 100%, 50%, 0.8)`, 
                        false
                    )
                }
            )
        )
    }
}

let f_update_array = function(
    o_state,
    s_name_array, 
    o, 
    n_len_max
){
    let a = o_state[s_name_array]
    // console.log(a)
    if(o){
        a.pop()
        a.unshift(o);
        // console.log(a)
        f_update_a_o_graph_prop()
    }
    if(n_len_max){
        if(n_len_max < a.length){
            o_state[s_name_array] = a.slice(0, n_len_max)
        }else{
            o_state[s_name_array] = [
                ...a, 
                ...new Array(n_len_max-a.length).fill(null)
            ]
        }
    }
}


let o_s_name_function_f__exposed = {
    f_update_o_monitor, 
    f_init_a_o_monitor,
    f_update_array,
}

import {
    O_vec2
} from "https://deno.land/x/vector@0.6/mod.js"



// Create a new WebSocket.
var o_socket = new WebSocket('ws://localhost:8000/');

// Connection opened
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




// let o_canvas = document.createElement('canvas');
// let o_ctx = o_canvas.getContext('2d');
// document.body.appendChild(o_canvas);

let f_resize_canvas = function(){
    let a_o_canvas = Array.from(document.querySelectorAll('canvas'));
    for(let o_canvas of a_o_canvas){
        let o_box = o_canvas.parentElement.getBoundingClientRect();
        o_canvas.width = o_box.width;
        o_canvas.height = o_box.height;
        
    }
}

window.onresize = f_resize_canvas
f_resize_canvas();

// let o_scl__cpu_usage = new O_vec2()
// let f_render = function(){
//     o_ctx.fillStyle = 'rgba(0,0,0,1.0)'
//     o_ctx.fillRect(
//         0,0,
//         ...o_scl_canvas.a_n_comp
//     );
//     o_ctx.fill();

//     for(let n_idx in a_o_diff){
//         n_idx = parseInt(n_idx)
//         let o_diff = a_o_diff[n_idx];
//         let o_diff_last = a_o_diff[parseInt(n_idx)+1];

//         if(!o_diff){
//             continue
//         }
//         for(let n_idx2 in o_diff.a_o_cpu_core_stats__diff){
//             n_idx2 = parseInt(n_idx2)
//             let n_y_max_nor = 0.9;
//             let n_y_max_original = (o_scl_canvas.n_y / o_diff.a_o_cpu_core_stats__diff.length);
//             let n_y_base_original = n_y_max_original*parseInt(n_idx2);
//             let n_y_max = n_y_max_original*n_y_max_nor;
//             let n_y_base = n_y_base_original + ((1.-n_y_max_nor)*n_y_max)/2;
//             let o_cpu_core_stats__diff = o_diff.a_o_cpu_core_stats__diff[n_idx2];
//             let o_trn = new O_vec2(
//                 o_scl_canvas.n_x-(parseInt(n_idx)/a_o_diff.length)*o_scl_canvas.n_x, 
//                 n_y_base+n_y_max*(1.-o_cpu_core_stats__diff.n_usage_nor)
//             )

//                 // console.log(o_cpu_core_stats__diff.n_usage_nor)
//             let n_idx_nor = parseInt(n_idx2) /o_diff.a_o_cpu_core_stats__diff.length

//             // o_ctx.fillStyle = 'white'

//             // o_ctx.fillRect(
//             //     ...o_trn.a_n_comp,
//             //     ...[10,10]
//             // );
//             if(o_diff_last){

//                 let o_cpu_core_stats__diff__last = o_diff_last.a_o_cpu_core_stats__diff[n_idx2];
//                 let o_trn_last = new O_vec2(
//                     o_scl_canvas.n_x-((parseInt(n_idx)+1)/a_o_diff.length)*o_scl_canvas.n_x, 
//                     n_y_base+n_y_max*(1.-o_cpu_core_stats__diff__last.n_usage_nor)
//                 )
//                 o_ctx.lineWidth = 2;
//                 o_ctx.strokeStyle = 'rgba(255,255,255,.5)'
//                 o_ctx.fill();
//                 o_ctx.beginPath();
//                 o_ctx.moveTo(...o_trn.add(0,1).a_n_comp)
//                 o_ctx?.lineTo(...o_trn_last.add(0,1).a_n_comp);
//                 o_ctx?.stroke();
//                 o_ctx.fill();

//                 let s_color = 
//                 `hsla(${parseInt(n_idx_nor*360)}, 100%, 50%,0.9)`
//                 o_ctx.fillStyle = s_color;
//                 o_ctx.strokeStyle = s_color;
//                 o_ctx.lineWidth = 2;
//                 // tried out interpolation but failed
//                 // // let n_y_min = Math.min(o_trn.n_y, o_trn_last.n_y);
//                 // // let n_y_max = Math.max(o_trn.n_y, o_trn_last.n_y);
//                 // let n_x_min = Math.min(o_trn.n_x, o_trn_last.n_x);
//                 // let n_x_max = Math.max(o_trn.n_x, o_trn_last.n_x);
//                 // // let n_y_range = n_y_max - n_y_min;
//                 // let n_x_range = n_x_max - n_x_min;
//                 // let n_interpolation_steps = 10;
//                 // let n_x_per_step = n_x_range / n_interpolation_steps;
//                 // let n_y_range = o_trn.n_y - o_trn_last.n_y;

//                 // for(let n_istep = 0; n_istep < n_interpolation_steps; n_istep+=1){
//                 //     let n_istep_nor = n_istep / n_interpolation_steps;
//                 //     let n_istep_nor_next = (n_istep+1) / n_interpolation_steps;
//                 //     // debugger
//                 //     o_ctx.beginPath();
//                 //     o_ctx.moveTo(
//                 //         o_trn.n_x + n_istep_nor * n_x_range,
//                 //           (o_trn.n_y) + n_istep_nor * n_y_range
//                 //         )
//                 //     o_ctx?.lineTo(
//                 //         o_trn.n_x + n_istep_nor_next * n_x_range,
//                 //         (o_trn.n_y) + n_istep_nor_next * n_y_range
//                 //     );
//                 //     o_ctx?.stroke();
//                 // }
//                 o_ctx.beginPath();
//                 let n_factor = ((o_trn_last.n_y - o_trn.n_y) < 0.0) ? -1 : 1;
//                 let o_trn_middle = o_trn_last.add(o_trn).mul(0.5);
//                 let o_trn_orthogonal = o_trn_middle.add(o_trn.sub(o_trn_last).yx.mul(-1,1).mul(0.1*n_factor));
//                 let o_trn_orthogonal2 = o_trn_middle.add(o_trn.sub(o_trn_last).yx.mul(-1,1).mul(0.1*n_factor));
//                 let o_trn_orthogonal3 = o_trn_middle.add(o_trn.sub(o_trn_last).yx.mul(-1,1).mul(0.1*n_factor*-1));
//                 // let n_y_mid = (o_trn_last.n_y + o_trn.n_y) / 2; 
//                 // let n_x_mid = (o_trn_last.n_x + o_trn.n_x) / 2; 
//                 // let n_p1p2_orthogonal = 

//                 o_ctx.moveTo(...o_trn.a_n_comp)
//                 o_ctx.strokeStyle = 'rgba(255,255,255,.7)'
//                 o_ctx.beginPath();
//                 o_ctx.moveTo(o_trn.n_x, n_y_base_original)
//                 o_ctx?.lineTo(o_trn_last.n_x, n_y_base_original);
//                 o_ctx?.stroke();
//             }

//             if(n_idx == 0){
//                 let n_px = parseInt((o_scl_canvas.n_y/o_diff.a_o_cpu_core_stats__diff.length)*0.8)
//                 // o_ctx.strokeStyle = 'rgba(255,255,255,.5)'
//                 o_ctx.font = `bold ${n_px}px monospace` 
//                 o_ctx?.fillText(
//                     `${(o_cpu_core_stats__diff.n_usage_nor*100).toFixed(0).padStart(4,' ')}%`,
//                     o_scl_canvas.n_x-(n_px*5), n_y_base+n_px
//                 );
//                 o_ctx?.stroke();
//             }


//         }


//     }

//     let a_o_diff__filtered = a_o_diff.filter(v=>v)
//     for(let n_idx in a_o_diff__filtered){
//         n_idx = parseInt(n_idx)

//         let a_o_cpu_core_stats__diff = a_o_diff__filtered[0].a_o_cpu_core_stats__diff;
//         for(let n_idx2 in a_o_cpu_core_stats__diff){
            
//             n_idx2 = parseInt(n_idx2)
//             let n_idx_nor = parseInt(n_idx2) /a_o_cpu_core_stats__diff.length
//             let n_y_max_nor = 0.9;
//             let n_y_max_original = (o_scl_canvas.n_y / a_o_cpu_core_stats__diff.length);
//             let n_y_base_original = n_y_max_original*parseInt(n_idx2);
//             let n_y_max = n_y_max_original*n_y_max_nor;
//             let n_y_base = n_y_base_original + ((1.-n_y_max_nor)*n_y_max)/2;

//             let a_o_trn__for_cubic_bezier = []
//             if((n_idx) % 1 == 0 && ((n_idx)+3) < a_o_diff__filtered.length && a_o_diff__filtered[n_idx+3]){
//                 a_o_trn__for_cubic_bezier.push(
//                     new O_vec2(
//                         o_scl_canvas.n_x-(parseInt(n_idx+0)/a_o_diff.length)*o_scl_canvas.n_x, 
//                         n_y_base+n_y_max*(1.-a_o_diff__filtered[n_idx+0].a_o_cpu_core_stats__diff[n_idx2].n_usage_nor)
//                     )
//                 )
//                 a_o_trn__for_cubic_bezier.push(
//                     new O_vec2(
//                         o_scl_canvas.n_x-(parseInt(n_idx+1)/a_o_diff.length)*o_scl_canvas.n_x, 
//                         n_y_base+n_y_max*(1.-a_o_diff__filtered[n_idx+1].a_o_cpu_core_stats__diff[n_idx2].n_usage_nor)
//                     )
//                 )
//                 a_o_trn__for_cubic_bezier.push(
//                     new O_vec2(
//                         o_scl_canvas.n_x-(parseInt(n_idx+2)/a_o_diff.length)*o_scl_canvas.n_x, 
//                         n_y_base+n_y_max*(1.-a_o_diff__filtered[n_idx+2].a_o_cpu_core_stats__diff[n_idx2].n_usage_nor)
//                     )
//                 )
//                 a_o_trn__for_cubic_bezier.push(
//                     new O_vec2(
//                         o_scl_canvas.n_x-(parseInt(n_idx+3)/a_o_diff.length)*o_scl_canvas.n_x, 
//                         n_y_base+n_y_max*(1.-a_o_diff__filtered[n_idx+3].a_o_cpu_core_stats__diff[n_idx2].n_usage_nor)
//                     )
//                 )

//             }


//             let s_color = 
//             `hsla(${parseInt(n_idx_nor*360)}, 100%, 50%,0.3)`
//             o_ctx.fillStyle = s_color;
//             o_ctx.strokeStyle = s_color;
//             o_ctx.lineWidth = 2;

//             o_ctx.beginPath();

//             if(a_o_trn__for_cubic_bezier.length > 0){

//                 o_ctx.moveTo(a_o_trn__for_cubic_bezier[0].n_x, a_o_trn__for_cubic_bezier[0].n_y)
//                 // o_ctx?.quadraticCurveTo(...o_trn_orthogonal.a_n_comp,o_trn_last.n_x, o_trn_last.n_y);
//                 o_ctx?.bezierCurveTo(
//                     ...a_o_trn__for_cubic_bezier[1].a_n_comp,
//                     ...a_o_trn__for_cubic_bezier[2].a_n_comp,
//                     ...a_o_trn__for_cubic_bezier[3].a_n_comp
//                     );
//                 // o_ctx?.lineTo(...o_trn_orthogonal.a_n_comp);
//                 o_ctx?.stroke();
//             }



//         }


//     }


//     // o_ctx.fillStyle = 'red'

//     // o_ctx.beginPath();
//     // o_ctx.arc(
//     //     Math.sin(n_id__request_animation_frame)*200,
//     //     Math.cos(n_id__request_animation_frame)*200,
//     //     10,
//     //     0,
//     //     2 * Math.PI);
//     // o_ctx.fill();
// }
// let n_ms_window_performance_now = window.performance.now();
// let n_id__request_animation_frame = null;
// let f_request_animation_frame = function(){

//     let n_ms_diff = 1000 / o_state.n_fps
//     n_id__request_animation_frame = requestAnimationFrame(f_request_animation_frame);
//     let n_ms_window_performance_now2 = window.performance.now();
//     if(
//         n_ms_window_performance_now2-n_ms_window_performance_now
//         > n_ms_diff
//         ){
//             f_render()
//             n_ms_window_performance_now = n_ms_window_performance_now2;
//         }
// }

// n_id__request_animation_frame = requestAnimationFrame(f_request_animation_frame);







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