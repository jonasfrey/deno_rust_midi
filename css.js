

import {
    f_add_css,
    f_s_css_prefixed
} from "https://deno.land/x/f_add_css@0.6/mod.js"


f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
class O_hsla{
    constructor(n_h, n_s, n_l, n_a){
        this.n_h = n_h
        this.n_s = n_s
        this.n_l = n_l
        this.n_a = n_a
    }
}
let s_theme_light = 'theme_light'
let s_theme_dark = 'theme_dark'
let a_s_theme = [
    s_theme_light,
    s_theme_dark
]
let o_themes_props = {
    // foreground
    //      light
    [`o_hsla__fg${s_theme_light}`]:                 new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__fg_hover${s_theme_light}`]:           new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__fg_active${s_theme_light}`]:          new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__fg_active_hover${s_theme_light}`]:    new O_hsla(.0, .0, .1, .93), 
    //      dark
    [`o_hsla__fg${s_theme_dark}`]:                 new O_hsla(.0, .0, .8, .93), 
    [`o_hsla__fg_hover${s_theme_dark}`]:           new O_hsla(.0, .0, .9, .93), 
    [`o_hsla__fg_active${s_theme_dark}`]:          new O_hsla(.0, .0, .9, .93), 
    [`o_hsla__fg_active_hover${s_theme_dark}`]:    new O_hsla(.0, .0, .9, .93), 
    
    [`o_hsla__bg${s_theme_light}`]:                 new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__bg_hover${s_theme_light}`]:           new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__bg_active${s_theme_light}`]:          new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__bg_active_hover${s_theme_light}`]:    new O_hsla(.0, .0, .1, .93), 
    // 
    [`o_hsla__bg${s_theme_dark}`]:                 new O_hsla(.0, .0, .1, .93), 
    [`o_hsla__bg_hover${s_theme_dark}`]:           new O_hsla(.0, .0, .2, .93), 
    [`o_hsla__bg_active${s_theme_dark}`]:          new O_hsla(.0, .0, .2, .93), 
    [`o_hsla__bg_active_hover${s_theme_dark}`]:    new O_hsla(.0, .0, .2, .93), 

};

let f_s_hsla = function(o_hsla){
    return `hsla(${360*o_hsla?.n_h} ${o_hsla?.n_s*100}% ${o_hsla?.n_l*100}% / ${o_hsla?.n_a})`
}

let s_core_css = `
${a_s_theme.map(s_theme =>{
    let o_theme_props = Object.assign(
        {}, 
        ...Object.keys(o_themes_props).filter(s=>s.includes(s_theme)).map(
            s_prop => {
                let s_prop_without_s_theme = s_prop.replace(s_theme, '');

                return {
                    [s_prop_without_s_theme]: o_themes_props[s_prop], 
                }
            }
        )
    )
    return `
        .${s_theme} *{
            background: ${f_s_hsla(o_theme_props.o_hsla__bg)};
            color: ${f_s_hsla(o_theme_props.o_hsla__fg)};
        }
        .${s_theme} .clickable{
            padding:1rem;
            border-radius:3px;
        }
        .${s_theme} .clickable:hover{
            background: ${f_s_hsla(o_theme_props.o_hsla__bg_hover)};
            color: ${f_s_hsla(o_theme_props.o_hsla__fg_hover)};
            cursor:pointer;
        }
        .${s_theme} .input{
            border: 1px solid ${f_s_hsla(o_theme_props.o_hsla__bg_hover)};
        }
        .${s_theme} .clickable.clicked{
            background: ${f_s_hsla(o_theme_props.o_hsla__bg_active)};
            color: ${f_s_hsla(o_theme_props.o_hsla__fg_active)};
            cursor:pointer;
        }
        .${s_theme} .clickable.clicked:hover{
            background: ${f_s_hsla(o_theme_props.o_hsla__bg_active_hover)};
            color: ${f_s_hsla(o_theme_props.o_hsla__fg_active_hover)};
            cursor:pointer;
        }
    `
}).join("\n")}
.position_relative{
    position:relative
}
.o_js_s_name_month_n_year{
    position:absolute;
    top:100%;
    left:0;
    width:100%;
}
input, button{
    border:none;
    outline:none;
    flex: 1 1 auto;
}

.input{
    display:flex;
}

.d_flex{
    display: flex;
    flex-wrap: wrap;
}

.w_1_t_7{
    align-items: center;
    display: flex;
    justify-content: center;
    flex: 1 1 calc(100%/7);
}

.w_1_t_3{
    align-items: center;
    display: flex;
    justify-content: center;
    flex:1 1 calc(100%/3);
}
*{
    font-size: 1.2rem;
    color: rgb(25 25 25 / 50%);
    background:white;
    padding: 0;
    margin:0;
}
.border_shadow_popup{
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.theme_dark .border_shadow_popup{
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
*{
    font-family:helvetica;
}
.info, .info *{
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.loading, .loading *{
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.success, .success *{
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
.error, .error *{
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
.warning, .warning *{
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.spinn_360_degrees_infinity{
    <i class="fa-solid fa-spinner"></i>
}
.o_notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 2rem;
    opacity: 0.8;
    align-items: center;
    justify-content: center;
}
${(new Array(40).fill(0)).map(
    function(n, n_idx){
        let num = (n_idx /10)
        let s_n = num.toString().split('.').join('_');
        return `
            .p-${s_n}_rem{padding: ${num}rem}
            .pl-${s_n}_rem{padding-left: ${num}rem}
            .pr-${s_n}_rem{padding-right: ${num}rem}
            .pt-${s_n}_rem{padding-top: ${num}rem}
            .pb-${s_n}_rem{padding-bottom: ${num}rem}
        `
    }
).join("\n")} `;
let s_css = `
        ${s_core_css}
        .fullscreen{
            width: 100vw;
            height: 100vh;
            overflow:hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .inputs{
            position:fixed;
            width: 100%;
            height: auto;
            bottom:0;
            opacity:0.4;
        }
        canvas{
            max-width: 100vw;
            max-height: 100vh;
            object-fit: contain;
        }

        .classic_window{
            box-shadow: 3px 3px 8px 2px black;
        }
        .minimize, .maximize {
            margin: 0rem .2rem;
            background:#1a1a1a !important;
            width: 1.2rem;
            height: 1.2rem;
            border: 3px outset;
            box-shadow: 1px 2px 0px 1px black;
            position: relative;
        }
        .minimize:active, .maximize:active{
            border:inset;
        }

        .minimize > div {
            width: 50%;
            height: 16%;
            background: #9a9a9a;
            position: absolute;
            top: 75%;
            left: 50%;
            transform:translate(-50%, -50%)
        }
        .maximize > div {
            height: 50%;
            width: 50%;
            border:2px solid #9a9a9a;
            border-top:4px solid ;
            position: absolute;
            top: 50%;
            left: 50%;
            transform:translate(-50%, -50%)
        }
        .top_bar{
            display:flex;
            padding: 0.5rem;
            justify-content: space-between;
        }
        .top_bar, .bg_blue{
            background:blue;
        }
        .canvas_container{
            position:relative;
        }
        .div {
            width: 20vw;
            height: 20vw;
            position: absolute;
            left: 0;
            top: 50%;
            border: 1px solid #ff0000;
            z-index: 14;
        }

        
`;
// let s_css_prefixed = f_s_css_prefixed(
//     s_css,
//     `.${s_version_class}`
// );
f_add_css(s_css)