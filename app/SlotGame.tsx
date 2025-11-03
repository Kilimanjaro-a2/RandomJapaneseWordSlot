'use client';

import { useState, useEffect, useRef } from 'react';

const HIRAGANA_CHARS = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん'
];

const INITIAL_REELS = ['あ', 'あ', 'あ'];
const DEFAULT_TARGET_WORD = 'ありが';
const HIRAGANA_PATTERN = /^[\u3040-\u309F]{3}$/;

export default function SlotGame() {
  const [reels, setReels] = useState<string[]>(INITIAL_REELS);
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCleared, setGameCleared] = useState(false);
  const [targetWord, setTargetWord] = useState<string>(DEFAULT_TARGET_WORD);
  const intervalRefs = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

  useEffect(() => {
    // Load target word from configuration file
    fetch('/config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.targetWord && 
            data.targetWord.length === 3 &&
            HIRAGANA_PATTERN.test(data.targetWord)) {
          setTargetWord(data.targetWord);
        }
      })
      .catch(error => {
        console.error('Failed to load configuration:', error);
        // Keep default value if config fails to load
      });
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup intervals on unmount
      intervalRefs.current.forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  useEffect(() => {
    // Check if game is cleared
    if (reels.join('') === targetWord && !spinning.some(s => s)) {
      if (gameStarted) {
        setGameCleared(true);
      }
    }
  }, [reels, spinning, gameStarted, targetWord]);

  const startGame = () => {
    setGameStarted(true);
    setGameCleared(false);
    setSpinning([true, true, true]);

    // Start spinning all reels
    intervalRefs.current.forEach((_, index) => {
      if (intervalRefs.current[index]) {
        clearInterval(intervalRefs.current[index]!);
      }
      
      intervalRefs.current[index] = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = HIRAGANA_CHARS[Math.floor(Math.random() * HIRAGANA_CHARS.length)];
          return newReels;
        });
      }, 100);
    });
  };

  const stopReel = (index: number) => {
    if (!spinning[index]) return;

    // Stop the reel
    if (intervalRefs.current[index]) {
      clearInterval(intervalRefs.current[index]!);
      intervalRefs.current[index] = null;
    }

    setSpinning(prev => {
      const newSpinning = [...prev];
      newSpinning[index] = false;
      return newSpinning;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-purple-600">
          日本語スロットゲーム
        </h1>
        <p className="text-center text-gray-600 mb-8">
          目標: <span className="font-bold text-2xl text-purple-700">{targetWord}</span>
        </p>

        {/* Reels */}
        <div className="flex justify-center gap-4 mb-8">
          {reels.map((char, index) => (
            <div
              key={index}
              className={`w-32 h-40 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-lg shadow-lg flex items-center justify-center border-4 border-yellow-600 ${
                spinning[index] ? 'animate-pulse' : ''
              }`}
            >
              <span className="text-6xl font-bold text-gray-800">
                {char}
              </span>
            </div>
          ))}
        </div>

        {/* Stop Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => stopReel(index)}
              disabled={!spinning[index]}
              className={`w-32 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                spinning[index]
                  ? 'bg-red-500 hover:bg-red-600 cursor-pointer shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {spinning[index] ? 'ストップ' : '停止中'}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={startGame}
            disabled={spinning.some(s => s)}
            className={`px-12 py-4 rounded-lg font-bold text-white text-xl transition-all ${
              spinning.some(s => s)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 cursor-pointer shadow-lg hover:shadow-xl'
            }`}
          >
            スタート
          </button>
        </div>

        {/* Game Status */}
        {gameCleared && (
          <div className="text-center p-6 bg-green-100 border-4 border-green-500 rounded-lg animate-bounce">
            <p className="text-3xl font-bold text-green-700">
              🎉 ゲームクリア！ 🎉
            </p>
            <p className="text-xl text-green-600 mt-2">
              おめでとうございます！
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="font-bold text-blue-800 mb-2">遊び方：</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>1. 「スタート」ボタンを押してゲームを開始</li>
            <li>2. 各リールの「ストップ」ボタンで止める</li>
            <li>3. 目標の言葉「{targetWord}」を揃えるとクリア！</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
