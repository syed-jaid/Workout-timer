import React, { useEffect, useState, useRef } from "react";

const TimerLoop = () => {
  const [phase, setPhase] = useState("idle"); // 'idle' | 'countUp' | 'release' | 'countDown' | 'ready'
  const [count, setCount] = useState(1);

  const [countUpSeconds, setCountUpSeconds] = useState(6);
  const [countDownSeconds, setCountDownSeconds] = useState(10);

  const intervalRef = useRef(null);

  const releaseAudio = useRef(new Audio("/stop-rest.mp3"));
  const readyAudio = useRef(new Audio("/ready-fight.mp3"));

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (phase === "countUp") {
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
        setPhase("countDown");
      }, 1000);
    }

    if (phase === "countDown") {
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
        setPhase("countUp");
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const handleStart = () => {
    if (phase === "idle") {
      setCount(1);
      setPhase("countUp");
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setCount(1);
    setPhase("idle");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">⏱️ Custom Loop Timer</h1>
      <h1 className="text-6xl font-bold mb-2">{count}</h1>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1">Count Up Seconds</label>
          <input
            type="number"
            min={1}
            value={countUpSeconds}
            onChange={(e) => setCountUpSeconds(Number(e.target.value))}
            disabled={phase !== "idle"}
            className="text-black px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Countdown Seconds</label>
          <input
            type="number"
            min={1}
            value={countDownSeconds}
            onChange={(e) => setCountDownSeconds(Number(e.target.value))}
            disabled={phase !== "idle"}
            className="text-black px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="text-2xl capitalize mb-6">
        {phase === "idle" ? "Press Start" : phase}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={phase !== "idle"}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded"
        >
          Start
        </button>

        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerLoop;
