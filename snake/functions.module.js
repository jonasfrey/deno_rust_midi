let f_update_o_state = function(
    o_state,
    s_prop, 
    v
){
    o_state[s_prop] = v
}

let f_on_socket_message = function(
    o_state, 
    event, 
    o_s_name_function_f__exposed
){

    let v_o_socket_request = JSON.parse(event.data);
    let s_name_function = v_o_socket_request.s_name_function;
    if(typeof s_name_function != 'string'){
        console.log('event must be json parsable O_socket_message')
    }
    // console.log(o_s_name_function_f__exposed)

    let f = o_s_name_function_f__exposed[s_name_function];
    if(typeof f != 'function'){
        console.log(`function ${v_o_socket_request.s_name_function} not found on object`)
    }
    return f(o_state, ...v_o_socket_request.v_data);        
}
export {
    f_update_o_state, 
    f_on_socket_message
}