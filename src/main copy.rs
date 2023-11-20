use midir::{MidiInput, MidiOutput, MidiOutputConnection, Ignore};
use std::error::Error;
use std::io::{stdin, stdout, Write};
use std::thread;
use std::time::Duration;
use image::io::Reader as ImageReader;
use walkdir::WalkDir;
use std::path::{Path, PathBuf};
use std::fs;
use image::{ImageResult, imageops::FilterType};
use minifb::{Window, WindowOptions};
extern crate image;

fn extract_number_from_filename(filename: &str) -> Option<u32> {
    filename.split('_').last()?.split('.').next()?.parse().ok()
}



fn resize_image(image_path: &Path, output_path: &Path) -> Result<(), image::ImageError> {
    // Open the image
    let img = image::open(image_path)?;

    // Resize the image to 8x8 pixels
    let resized = img.resize_exact(64,64, FilterType::Nearest);

    // Save the resized image
    resized.save(output_path)?;

    Ok(())
}

fn main() -> Result<(), image::ImageError> {
    let input_dir = "./bad_apple/image_sequence";  // Directory containing the original images
    let output_dir = "./bad_apple_downsized_64x64"; // Directory to save resized images

    // Create output directory if it doesn't exist
    fs::create_dir_all(output_dir)?;

    // Iterate over each image in the input directory
    for entry in fs::read_dir(input_dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() {
            // Construct the output path
            let output_path = Path::new(output_dir).join(path.file_name().unwrap());

            // Resize the image
            resize_image(&path, &output_path)?;
        }
    }

    Ok(())
}


// fn main() -> Result<(), Box<dyn Error>> {

//     const WIDTH: usize = 800;
//     const HEIGHT: usize = 600;
//     // Initialize window
//     let mut window = Window::new(
//         "Image Display",
//         WIDTH,
//         HEIGHT,
//         WindowOptions::default(),
//     )
//     .expect("Unable to open window");


//     let mut midi_in = MidiInput::new("Rust MIDI Input")?;
//     midi_in.ignore(Ignore::None);
    
//     let in_ports = midi_in.ports();
//     let in_port = select_midi_port(&midi_in, &in_ports, "input")?;

//     let midi_out = MidiOutput::new("Rust MIDI Output")?;
//     let out_ports = midi_out.ports();
//     let out_port = select_midi_port(&midi_out, &out_ports, "output")?;

//     println!("Listening for MIDI input. Press Enter to exit.");
//     let _conn_in = midi_in.connect(&in_port, "rust-midi-in", move |_, message, _| {
//         println!("Received MIDI message: {:?}", message);
//     }, ())?;

//     let mut conn_out = midi_out.connect(&out_port, "rust-midi-out")?;
//     conn_out.send(&[144, 60, 1])?; // Example MIDI message: Note on
//     // let mut n_id = 0;
//     // while true{
//     //     thread::sleep(Duration::from_millis(16));
//     //     n_id = (n_id+1)%10;
//     //     for n_idx in 0..8*8{
//     //         println!("{}",n_idx);
//     //         conn_out.send(&[0x90, n_idx, n_id%6])?;
//     //     }
//     // }


//     let dir_path = "./bad_apple/image_sequence"; // Directory to read images from

//     let mut paths: Vec<PathBuf> = Vec::new();

//     // Collect all image paths
//     let mut entries: Vec<_> = fs::read_dir(dir_path)?
//         .filter_map(|entry| entry.ok())
//         .filter_map(|entry| entry.path().file_name()?.to_str().map(String::from))
//         .collect();
//     entries.sort_by(|a, b| {
//         let filename_a = a.path()
//                           .file_name()
//                           .and_then(|f| f.to_str())
//                           .unwrap_or_default();
//         let filename_b = b.path()
//                           .file_name()
//                           .and_then(|f| f.to_str())
//                           .unwrap_or_default();
    
//         let num_a = extract_number_from_filename(filename_a).unwrap_or(0);
//         let num_b = extract_number_from_filename(filename_b).unwrap_or(0);
    
//         num_a.cmp(&num_b)
//     });

//     // Process each image
//     for path in paths {
//         match open_image(&path, &mut conn_out, &mut window) {
//             Ok(_) => println!("Processed image: {}", path.display()),
//             Err(e) => println!("Failed to process {}: {}", path.display(), e),
//         }
//     }

//     fn open_image<P: AsRef<Path>>(path: P, conn_out:
//         &mut MidiOutputConnection, 
    
//         window: &mut Window,
//     ) -> image::ImageResult<()> {

//         let img = image::open(path)?;

//         // Display the original image in the window
//         // Resize the image to fit the window, maintaining aspect ratio
//         let resized = img.resize(WIDTH as u32, HEIGHT as u32, image::imageops::FilterType::Nearest);

//         let mut buffer = vec![0u32; WIDTH * HEIGHT]; // Buffer of u32

//         for (x, y, pixel) in resized.to_rgba8().enumerate_pixels() {
//             if x < WIDTH as u32 && y < HEIGHT as u32 {
//                 let offset = (y as usize * WIDTH + x as usize);
//                 if offset < buffer.len() {
//                     // Combine RGBA components into a single u32 value
//                     buffer[offset] = ((pixel[0] as u32) << 24) | 
//                                      ((pixel[1] as u32) << 16) | 
//                                      ((pixel[2] as u32) << 8)  | 
//                                       (pixel[3] as u32);
//                 }
//             }
//         }
//         window.update_with_buffer(&buffer, WIDTH, HEIGHT)
//         .expect("Failed to update window");
//         // Resize the image to 8x8
//         let small_img = img.resize_exact(8, 8, image::imageops::FilterType::Nearest);
//         // Convert the dynamic image to an image buffer
//         let img_buffer = small_img.to_rgba8();

//             // Iterate over each pixel
//         // Iterate over each pixel
//         let mut n_idx = 0;
//         thread::sleep(Duration::from_millis((1000 as f64 /29.97 as f64)as u64));

//         for (x, y, pixel) in img_buffer.enumerate_pixels() {
//             // println!("Pixel at ({}, {}) has data: {:?}", x, y, pixel);
//             let n_x = n_idx % 8;
//             let mut n_y = n_idx / 8;
//             n_y = 7-n_y; 
//             let n_idx_akai = n_x + n_y*8;
//             if pixel[0] > 0 {
//                 conn_out.send(&[0x90, n_idx_akai, 5]);
//             }else{
//                 conn_out.send(&[0x90, n_idx_akai, 0]);
//             }
//             n_idx+=1;

//         }
            
//         Ok(())

//     }

//     let mut input = String::new();
//     stdin().read_line(&mut input)?; // Wait for Enter key

//     Ok(())
// }

// fn select_midi_port<T: midir::MidiIO>(
//     midi_io: &T,
//     ports: &[T::Port],
//     port_name: &str,
// ) -> Result<T::Port, Box<dyn Error>> {
//     match ports.len() {
//         0 => Err(format!("No MIDI {} ports available.", port_name).into()),
//         1 => {
//             println!("Choosing the only available MIDI {} port.", port_name);
//             Ok(ports[0].clone())
//         },
//         _ => {
//             println!("Available MIDI {} ports:", port_name);
//             for (i, p) in ports.iter().enumerate() {
//                 println!("{}: {}", i, midi_io.port_name(p)?);
//             }
//             print!("Please select MIDI {} port: ", port_name);
//             stdout().flush()?;
//             let mut input = String::new();
//             stdin().read_line(&mut input)?;
//             if let Ok(index) = input.trim().parse::<usize>() {
//                 if index < ports.len() {
//                     Ok(ports[index].clone())
//                 } else {
//                     Err("Invalid MIDI port index.".into())
//                 }
//             } else {
//                 Err("Invalid input.".into())
//             }
//         }
//     }
// }
