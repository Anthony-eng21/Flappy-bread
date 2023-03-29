// https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

/**
 * Internal game mechanics below
 * No need to edit this file
 */
const max_fps = 90,
  timestep = 1000 / 30;

let last_frame_time = 0,
  delta = 0,
  fps = 60,
  frames_this_second = 0,
  last_fps_update = 0,
  is_running = false,
  has_started = false,
  frame_id = 0;

/**
 * Reset the delta value
 */
function panic() {
  delta = 0;
}

function stop() {
  is_running = false;
  has_started = false;
  cancelAnimationFrame(frame_id);

  // Call the end function to cleanup anything
  if (end && end instanceof Function) end();
}

function start() {
  if (!has_started) {
    has_started = true;
    frame_id = requestAnimationFrame((timestamp) => {
      draw(1);
      is_running = true;
      last_frame_time = timestamp;
      last_fps_update = timestamp;
      frames_this_second = 0;
      frame_id = requestAnimationFrame(game_loop);
    });

    // Call the begin function to initialize anything
    if (begin && begin instanceof Function) begin();
  }
}

function game_loop(timestamp) {
  if (has_died) return stop();

  if (timestamp < last_frame_time + 1000 / max_fps) {
    frame_id = requestAnimationFrame(game_loop);
    return;
  }

  delta += timestamp - last_frame_time;
  last_frame_time = timestamp;

  if (timestamp > last_fps_update + 1000) {
    fps = 0.25 * frames_this_second + 0.75 * fps;
    last_fps_update = timestamp;
    frames_this_second = 0;
  }
  frames_this_second++;

  let num_update_steps = 0;
  while (delta >= timestep) {
    // Update positions and data in the update function
    update(timestep);
    delta -= timestep;
    if (++num_update_steps >= 240) {
      panic();
      break;
    }
  }

  // Draw/update elements in the window
  draw(delta / timestep);

  // Set the new id for the frame
  frame_id = requestAnimationFrame(game_loop);
}
