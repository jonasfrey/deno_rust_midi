use midir::{MidiInput, MidiOutput, MidiOutputConnection, Ignore};
use std::error::Error;
use std::io::{stdin, stdout, Write};
use std::thread;
use std::time::Duration;
use rand::Rng;

fn main() -> Result<(), Box<dyn Error>> {

    let mut midi_in = MidiInput::new("Rust MIDI Input")?;
    midi_in.ignore(Ignore::None);
    
    let in_ports = midi_in.ports();
    let in_port = select_midi_port(&midi_in, &in_ports, "input")?;

    let midi_out = MidiOutput::new("Rust MIDI Output")?;
    let out_ports = midi_out.ports();
    let out_port = select_midi_port(&midi_out, &out_ports, "output")?;

    println!("Listening for MIDI input. Press Enter to exit.");
    let _conn_in = midi_in.connect(&in_port, "rust-midi-in", move |_, message, _| {
        println!("Received MIDI message: {:?}", message);
    }, ())?;

    let mut conn_out = midi_out.connect(&out_port, "rust-midi-out")?;
    for n1 in 0..100{
        // thread::sleep(Duration::from_millis(10));// to fast i cannot see the updates
        // thread::sleep(Duration::from_millis(15));// very fast but i can see flikering
        // thread::sleep(Duration::from_millis(20));// quite fast i clearly can see flickering
        thread::sleep(Duration::from_millis(16));// fast but slow compared to the others
        for n in 0..64{
    
            let array = [1, 3, 5];
            let random_index = rand::thread_rng().gen_range(0..array.len());
            let random_value = array[random_index];
            // println!("{}", random_value);
    
            conn_out.send(&[0x90, n, random_value])?; // Example MIDI message: Note on
        }
    }
    Ok(())
}

fn select_midi_port<T: midir::MidiIO>(
    midi_io: &T,
    ports: &[T::Port],
    port_name: &str,
) -> Result<T::Port, Box<dyn Error>> {
    match ports.len() {
        0 => Err(format!("No MIDI {} ports available.", port_name).into()),
        1 => {
            println!("Choosing the only available MIDI {} port.", port_name);
            Ok(ports[0].clone())
        },
        _ => {
            println!("Available MIDI {} ports:", port_name);
            for (i, p) in ports.iter().enumerate() {
                println!("{}: {}", i, midi_io.port_name(p)?);
            }
            print!("Please select MIDI {} port: ", port_name);
            stdout().flush()?;
            let mut input = String::new();
            stdin().read_line(&mut input)?;
            if let Ok(index) = input.trim().parse::<usize>() {
                if index < ports.len() {
                    Ok(ports[index].clone())
                } else {
                    Err("Invalid MIDI port index.".into())
                }
            } else {
                Err("Invalid input.".into())
            }
        }
    }
}
