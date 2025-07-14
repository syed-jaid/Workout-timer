import React, { useEffect, useState, useRef } from "react";

const TimerLoop = () => {
  const [phase, setPhase] = useState("idle");
  const [count, setCount] = useState(0);

  const [countUpSeconds, setCountUpSeconds] = useState(7);
  const [countDownSeconds, setCountDownSeconds] = useState(14);

  const intervalRef = useRef(null);

  const releaseAudio = useRef(new Audio("/stop-rest.mp3"));
  const readyAudio = useRef(new Audio("/ready-fight.mp3"));
  const tickingAudio = useRef(new Audio("/clock-ticking.mp3"));

  useEffect(() => {
    releaseAudio.current.volume = 0.5;
    readyAudio.current.volume = 0.5;
    tickingAudio.current.volume = 0.1;
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (phase === "Exercise") {
      setCount(1);
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev >= countUpSeconds) {
            clearInterval(intervalRef.current);
            setPhase("release");
            releaseAudio.current.play();
            return countUpSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }

    if (phase === "release") {
      setTimeout(() => {
        setCount(1);
        setPhase("Rest");
      }, 1000);
    }

    if (phase === "Rest") {
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev >= countDownSeconds) {
            clearInterval(intervalRef.current);
            setPhase("ready");
            readyAudio.current.play();
            return countDownSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }

    if (phase === "ready") {
      setTimeout(() => {
        setCount(1);
        setPhase("Exercise");
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const handleStart = () => {
    if (phase === "idle") {
      readyAudio.current.play();
      tickingAudio.current.loop = true;
      tickingAudio.current.play();
      setCount(1);
      setPhase("Exercise");
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setCount(0);
    setPhase("idle");
    tickingAudio.current.pause();
    tickingAudio.current.currentTime = 0;
  };

  return (
    <div className="container">
      <h1 className="title">⏱️ Workout Timer</h1>
      <h1 className="counter">{count}</h1>

      <div className="inputs">
        <div>
          <label>Single Set time</label>
          <input
            type="number"
            min={1}
            value={countUpSeconds}
            onChange={(e) => setCountUpSeconds(Number(e.target.value))}
            disabled={phase !== "idle"}
          />
        </div>

        <div>
          <label>Rest time</label>
          <input
            type="number"
            min={1}
            value={countDownSeconds}
            onChange={(e) => setCountDownSeconds(Number(e.target.value))}
            disabled={phase !== "idle"}
          />
        </div>
      </div>

      <div className="status">{phase === "idle" ? "Press Start" : phase}</div>

      <div className="buttons">
        <button onClick={handleStart} disabled={phase !== "idle"}>
          Start
        </button>
        <button onClick={handleReset}>Stop</button>
      </div>
    </div>
  );
};

export default TimerLoop;
