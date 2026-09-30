import cv2
import numpy as np
import subprocess
import time
import imageio_ffmpeg

def process_video():
    input_path = 'design/Video Project 6.mp4'
    output_path = 'frontend/public/landing-bg.mp4'
    
    print(f'Opening input video: {input_path}')
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError('Failed to open input video')
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f'Input video info: {width}x{height} @ {fps} fps, {total_frames} total frames')
    
    # Text bounding boxes: (y1, y2, x1, x2)
    boxes = [
        (80, 140, 140, 320),    # 'lrsttogen' logo
        (80, 135, 350, 850),    # top nav menu items
        (80, 140, 1250, 1430),  # sign up button
        (320, 375, 140, 280),   # tag
        (370, 445, 140, 670),   # headline line 1
        (440, 515, 140, 680),   # headline line 2
        (510, 575, 140, 680),   # subtitle text
        (580, 665, 140, 380),   # 'Learn Now' button
    ]
    
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg_exe, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{width}x{height}',
        '-pix_fmt', 'bgr24',
        '-r', str(fps),
        '-i', '-',
        '-an',
        '-vcodec', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'medium',
        '-crf', '19',
        '-movflags', '+faststart',
        output_path
    ]
    
    print('Starting ffmpeg encoder process...')
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    # Skip the initial 3 glitch/white flash frames
    start_frame = 3
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    t0 = time.time()
    frame_idx = start_frame
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mask = np.zeros(gray.shape, dtype=np.uint8)
        
        for y1, y2, x1, x2 in boxes:
            sub = gray[y1:y2, x1:x2]
            mask[y1:y2, x1:x2] = (sub > 26).astype(np.uint8) * 255
            
        mask = cv2.dilate(mask, kernel, iterations=1)
        
        # Inpaint text cleanly
        clean = cv2.inpaint(frame, mask, 11, cv2.INPAINT_NS)
        
        # Apply Gaussian blur for smooth cinematic background
        clean_blur = cv2.GaussianBlur(clean, (27, 27), 9)
        
        proc.stdin.write(clean_blur.tobytes())
        frame_idx += 1
        
        if (frame_idx - start_frame) % 50 == 0:
            elapsed = time.time() - t0
            fps_proc = (frame_idx - start_frame) / elapsed
            print(f'Processed {frame_idx - start_frame}/{total_frames - start_frame} frames ({fps_proc:.1f} fps)')
            
    cap.release()
    proc.stdin.close()
    proc.wait()
    
    total_time = time.time() - t0
    print(f'Successfully rendered video in {total_time:.2f} seconds to {output_path}!')

if __name__ == '__main__':
    process_video()
