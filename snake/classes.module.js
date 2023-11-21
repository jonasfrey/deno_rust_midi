class O_output_led{

}
class O_inoutput{
    constructor(
        s_name, 
        n_note_number, 
    ){
        this.s_name = s_name
        this.n_note_number = n_note_number 
    }
}
class O_midi_device{
    constructor(
        s_name, 
        a_o_inoutput
    ){
        this.s_name = s_name
        this.a_o_inoutput = a_o_inoutput
    }
}

class O_socket_message{
    constructor(
        s_name_function, 
        v_data
    ){
        this.s_name_function = s_name_function
        this.v_data = v_data
    }
}
class O_monitor{ 
    constructor(
        s_name, 
        n_fps, 
        n_max, 
        v_custom_data 
    ){
        this.s_name = s_name, 
        this.n_fps = n_fps, 
        this.n_max = n_max
        this.v_custom_data = v_custom_data
    }
}

export {
    O_socket_message, 
    O_monitor,
    O_output_led, 
    O_inoutput, 
    O_midi_device
}

