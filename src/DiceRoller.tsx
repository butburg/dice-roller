import { useState } from 'react';

export default function DiceRoller() {
  const [numDice, setNumDice] = useState(3);
  const [maxNumber, setMaxNumber] = useState(6);
  const [currentRoll, setCurrentRoll] = useState([3, 3, 3]);
  const [lastRoll, setLastRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hue, setHue] = useState(0); // 0-360 for hue rotation

  const rollDice = () => {
    setIsRolling(true);
    setLastRoll(currentRoll);

    // Animate the roll
    let count = 0;
    const interval = setInterval(() => {
      const tempRoll = Array.from({ length: numDice }, () =>
        Math.floor(Math.random() * maxNumber) + 1
      );
      setCurrentRoll(tempRoll);
      count++;

      if (count >= 10) {
        clearInterval(interval);
        // Final roll with crypto random for better randomness
        const finalRoll = Array.from({ length: numDice }, () => {
          const array = new Uint32Array(1);
          crypto.getRandomValues(array);
          return (array[0] % maxNumber) + 1;
        });
        setCurrentRoll(finalRoll);
        setIsRolling(false);
      }
    }, 100);
  };

  // Calculate colors based on hue
  const getColor = (baseHue, saturation = 70, lightness = 50) => {
    return `hsl(${(baseHue + hue) % 360}, ${saturation}%, ${lightness}%)`;
  };

  const primaryColor = getColor(45, 80, 55); // Yellow-ish base
  const primaryDark = getColor(45, 80, 45);
  const secondaryColor = getColor(0, 70, 50); // Red-ish base
  const secondaryDark = getColor(0, 70, 40);
  const accentColor = getColor(270, 70, 50); // Purple-ish base
  const accentDark = getColor(270, 60, 30);
  const borderColor = getColor(45, 80, 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4 gap-6"
      style={{
        background: `linear-gradient(to bottom right, ${accentDark}, ${secondaryDark}, black)`
      }}>
      <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 max-w-2xl w-full"
        style={{ borderColor: borderColor }}>
        <h1 className="text-5xl font-bold text-center mb-8"
          style={{ color: primaryColor }}>
          <span className="inline-block">🎰</span> DICE ROLLER <span className="inline-block">🎰</span>
        </h1>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block mb-2 font-semibold" style={{ color: primaryColor }}>Number of Dice</label>
            <select
              value={numDice}
              onChange={(e) => setNumDice(Number(e.target.value))}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-lg font-bold border-2"
              style={{ borderColor: borderColor }}
              disabled={isRolling}
            >
              <option value={1}>1 Die</option>
              <option value={2}>2 Dice</option>
              <option value={3}>3 Dice</option>
              <option value={4}>4 Dice</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: primaryColor }}>Max Number</label>
            <input
              type="number"
              min="2"
              max="100"
              value={maxNumber}
              onChange={(e) => setMaxNumber(Number(e.target.value))}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-lg font-bold border-2"
              style={{ borderColor: borderColor }}
              disabled={isRolling}
            />
          </div>
        </div>

        {/* Current Roll Display */}
        <div className="rounded-2xl p-8 mb-6 border-4 shadow-xl"
          style={{
            background: `linear-gradient(to bottom right, ${secondaryColor}, ${secondaryDark})`,
            borderColor: primaryColor
          }}>
          <div className="flex justify-center items-center gap-4">
            {currentRoll.map((die, index) => (
              <div
                key={index}
                className={`bg-black rounded-xl p-6 min-w-[80px] text-center border-4 shadow-2xl transform transition-all ${isRolling ? 'scale-110 animate-pulse' : 'scale-100'
                  }`}
                style={{
                  color: primaryColor,
                  borderColor: borderColor
                }}
              >
                <div className="text-6xl font-bold tabular-nums">
                  {die}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-xl font-bold"
            style={{ color: primaryDark }}>
            Total: {currentRoll.reduce((a, b) => a + b, 0)}
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full text-black font-bold text-2xl py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
            borderColor: primaryColor
          }}
        >
          {isRolling ? '🎲 ROLLING... 🎲' : '🎲 ROLL DICE 🎲'}
        </button>

        {/* Last Roll History */}
        {lastRoll && (
          <div className="mt-6 bg-gray-900/50 rounded-xl p-4 border-2 border-gray-700">
            <h3 className="font-semibold mb-2" style={{ color: primaryColor }}>Last Roll:</h3>
            <div className="flex gap-2 items-center">
              {lastRoll.map((die, index) => (
                <div
                  key={index}
                  className="bg-gray-800 text-gray-400 rounded-lg px-4 py-2 text-2xl font-bold border-2"
                  style={{ borderColor: getColor(45, 30, 40) }}
                >
                  {die}
                </div>
              ))}
              <span className="text-gray-400 ml-2">
                (Total: {lastRoll.reduce((a, b) => a + b, 0)})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Settings & Info Panel */}
      <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 max-w-2xl w-full"
        style={{ borderColor: borderColor }}>
        {/* Color Theme Slider */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-semibold">🎨 Color Theme</label>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                hsl(0, 70%, 50%),
                hsl(60, 70%, 50%),
                hsl(120, 70%, 50%),
                hsl(180, 70%, 50%),
                hsl(240, 70%, 50%),
                hsl(300, 70%, 50%),
                hsl(360, 70%, 50%))`
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pt-2 border-t border-gray-700">
          Made with love by <a href="https://weedygallery.de" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 underline" style={{ color: primaryColor }}>weedy</a>
        </div>
        <div className="mt-3 flex justify-center">
          <a
            href="https://www.buymeacoffee.com/butburg"
            className="inline-flex"
            style={{ cursor: 'pointer' }}
          >
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy me an ice cream&emoji=🍦&slug=butburg&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff"
              className="h-12 w-auto"
              alt="Buy me an ice cream"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
