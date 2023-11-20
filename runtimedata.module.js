import {
    O_inoutput,
    O_midi_device,
} from "./classes.module.js"

let o_midi_device__akai_apc_mini = new O_midi_device(
    'akai apc mini',
    [
        ...new Array(64).fill(0).map((n,n_idx)=>{
            return new O_inoutput(`clip_${n_idx}`, n_idx)
        }),
        new O_inoutput('arrow_up', 64),
        new O_inoutput('arrow_down', 65),
        new O_inoutput('arrow_left', 66),
        new O_inoutput('arrow_right', 67),
        new O_inoutput('VOLUME', 68),
        new O_inoutput('PAN', 69),
        new O_inoutput('SEND', 70),
        new O_inoutput('DEVICE', 71),
        new O_inoutput('CLIP STOP', 82),
        new O_inoutput('SOLO', 83),
        new O_inoutput('MUTE', 84),
        new O_inoutput('SELECT', 85),
        new O_inoutput('scene_launch_6', 86),
        new O_inoutput('scene_launch_7', 87),
        new O_inoutput('STOP ALL CLIPS', 88),
        new O_inoutput('STOP ALL CLIPS', 89),
    ]
);