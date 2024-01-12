import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breakDisplay, setBreakDisplay] = useState(5 * 60);
  const [sessionDisplay, setSessionDisplay] = useState(25 * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(sessionDisplay);
  const [alarmTimeout, setAlarmTimeout] = useState(null);

  const soundAlerm = document.getElementById('beep');

  useEffect(() => {
      let countdown;
      if (isRunning && timer > 0) {
        countdown = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      }else if(timer === 0){
        setIsSession((prevIsSession) => !prevIsSession);
        setTimer(isSession ? breakDisplay : sessionDisplay);
        soundAlerm.play();

        const timeoutId = setTimeout(() => {
          soundAlerm.pause();
          soundAlerm.currentTime = 0;
        }, 3000);

        setAlarmTimeout(timeoutId);
      }
      return () => {clearInterval(countdown);
      if(alarmTimeout) {
        clearTimeout(alarmTimeout);
      }
    };
    }, [isRunning, timer, isSession, sessionDisplay, breakDisplay]);

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const toggleTimer = () => {
      setIsRunning((prevIsRunning) => !prevIsRunning);
    };

  const pushReset = () => {
    setBreakDisplay(5 * 60);
    setSessionDisplay(25 * 60);
    setTimer(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    soundAlerm.pause();
    soundAlerm.currentTime = 0;
  };

  const pushBreakDecrement = () => {
    if(!isRunning) {
      setBreakDisplay((prevBreakDisplay) => Math.max(prevBreakDisplay - 60, 60));
    }
  };

  const pushBreakIncrement = () => {
    if(!isRunning) {
      setBreakDisplay((prevBreakDisplay) => Math.min(prevBreakDisplay + 60, 60 * 60));
    }
  };
  const pushSessionDecrement = () => {
    if(!isRunning) {
      setSessionDisplay((prevSessionDisplay) => Math.max(prevSessionDisplay - 60, 60));
      setTimer((prevTimer) => Math.max(prevTimer - 60, 60));
    }
  };
  const pushSessionIncrement = () => {
    if(!isRunning) {
      setSessionDisplay((prevSessionDisplay) => Math.min(prevSessionDisplay + 60, 60 * 60));
      setTimer((prevTimer) => Math.min(prevTimer + 60, 60 * 60));
    }
  };

  return (
    <div className="App">
      <div id='wrapper'>Pomodoro Timer
      <div id="break-label">
        Break Length
        </div>
        <button id='break-decrement' onClick={pushBreakDecrement}>↓</button>
      <div id='break-length' className="inline-block">{breakDisplay / 60}</div>
      <button id='break-increment' className="inline-block" onClick={pushBreakIncrement}>↑</button>
      <div id="session-label">
        Session Length
        </div>
          <button id='session-decrement' onClick={pushSessionDecrement}>↓</button>
      <div id='session-length' className="inline-block">{sessionDisplay / 60}</div>
      <button id='session-increment' className="inline-block" onClick={pushSessionIncrement}>↑</button>
      <div id='timer-label'>{isSession ? 'Session' : 'Break'}</div>


      <div id="time-left"
      >{formatTime(timer)}
      <audio id='beep' src='https://wav-sounds.com/wp-content/uploads/2017/09/Cartoon-02.wav' />
      </div>
      <button id="start_stop" onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
      <button id="reset" onClick={pushReset}>Reset</button>
      </div>
    </div>
  );
}

export default App;
