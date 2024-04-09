type CountdownProps = {
  timer: number;
};

const Countdown = ({ timer }: CountdownProps) => {
  const countdown = timer * 1000;
  const formatedCountdown = {
    minutes: new Date(countdown).getUTCMinutes(),
    seconds: new Date(countdown).getUTCSeconds(),
  };

  return (
    <div className="flex justify-start">
      <div className=" rounded-lg p-3">
        <span className="text-orange-400 text-right font-mono text-lg lg:text-xl">
          {formatedCountdown.minutes < 10
            ? `0${formatedCountdown.minutes}`
            : formatedCountdown.minutes}
          :
          {formatedCountdown.seconds < 10
            ? `0${formatedCountdown.seconds}`
            : formatedCountdown.seconds}
        </span>
      </div>
    </div>
  );
};

export default Countdown;
