#!/bin/bash

# Check if an argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <video_file.mp4>"
    exit 1
fi

# The video file to process
VIDEO_FILE=$1

# Directory where extracted images will be stored
IMAGE_DIR="${VIDEO_FILE%.*}_frames"
mkdir -p "$IMAGE_DIR"

# Extract frames
# -i: input file
# -vf fps=1: extract one frame per second (adjust this value as needed)
# $IMAGE_DIR/frame_%04d.png: output filename pattern
ffmpeg -i "$VIDEO_FILE" -vf fps=30 "$IMAGE_DIR/frame_%04d.png"

echo "Frames extracted to $IMAGE_DIR"
