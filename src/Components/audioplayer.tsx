import { useEffect, useRef, useState } from "react";
import hitSong from "Assets/audio/hitsong.mp3";
import hitlogo from "Assets/Images/hit-logo.png";
import "Styles/shake.css";

function ImageAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const shakeRef = useRef<HTMLImageElement>(null);
  const intervalRef = useRef(null);

  // Function to add and remove the shaking class
  const triggerShake = () => {
    if (shakeRef.current) {
      shakeRef.current.classList.add("shake");
      setTimeout(() => {
        if (shakeRef.current) {
          shakeRef.current.classList.remove("shake");
        }
      }, 820); // Duration of the shake animation
    }
  };

  useEffect(() => {
    // Delay the first shake by 3 seconds after the component is mounted
    const timerInitial = setTimeout(() => {
      triggerShake();
      // Set an interval to shake the div every 10 seconds after the initial shake
      intervalRef.current = setInterval(triggerShake, 10000) as any;
    }, 3000);

    // Cleanup function to clear timeouts and intervals
    return () => {
      clearTimeout(timerInitial);
      clearInterval(intervalRef.current as any);
    };
  }, []);

  const handleImageClick = () => {
    if (isPlaying) {
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
    clearInterval(intervalRef.current as any);
    if (shakeRef.current) {
      shakeRef.current.classList.remove("shake");
    }
  };

  return (
    <div className="c-c-c">
      <img
        src={hitlogo}
        alt="Descriptive alt text"
        onClick={handleImageClick}
        ref={shakeRef}
        className={`${isPlaying ? "bouncing" : undefined} w-10`}
        style={{ cursor: "pointer" }}
      />{" "}
      <audio
        ref={audioRef}
        src={hitSong}
        style={{ display: "none" }}
        onEnded={() => setIsPlaying(false)}
      />{" "}
    </div>
  );
}

export default ImageAudioPlayer;
