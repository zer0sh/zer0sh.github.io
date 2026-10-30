import React, { useState, useEffect, useRef } from 'react';

const WORDS = [
  'INFRASTRUCTURE',
  'DEVELOPMENT',
  'BACKEND',
  'FRONTEND',
  'DEVOPS',
  'SEO',
];

const DISPLAY_DURATION_MS = 30000; // 30 seconds per word
const TYPING_SPEED_MS = 65; // ms per typed letter
const DELETING_SPEED_MS = 35; // ms per deleted letter

export const DynamicWatermark = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(WORDS[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const isVisibleRef = useRef(true);

  // Pause when browser tab is inactive to preserve zero CPU consumption
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let timeoutId;

    const currentTargetWord = WORDS[wordIndex];

    if (!isDeleting && displayText === currentTargetWord) {
      // Word is fully typed: wait 30 seconds before deleting
      timeoutId = setTimeout(() => {
        if (isVisibleRef.current) {
          setIsDeleting(true);
        }
      }, DISPLAY_DURATION_MS);
    } else if (isDeleting && displayText === '') {
      // Word is fully erased: advance to next word and start typing
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    } else {
      // Animating character by character
      const speed = isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS;
      timeoutId = setTimeout(() => {
        if (!isVisibleRef.current) return;

        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setDisplayText(currentTargetWord.slice(0, displayText.length + 1));
        }
      }, speed);
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, wordIndex]);

  // Click handler to manually fast-forward to next word
  const handleFastForward = () => {
    setIsDeleting(false);
    const nextIdx = (wordIndex + 1) % WORDS.length;
    setWordIndex(nextIdx);
    setDisplayText(WORDS[nextIdx]);
  };

  return (
    <div
      aria-hidden="true"
      onClick={handleFastForward}
      title="Click to cycle next domain"
      className="select-none neon-text-infra font-black uppercase tracking-[-0.04em] text-[clamp(2.5rem,7.5vw,6.5rem)] leading-none mb-3 sm:mb-4 relative z-0 pl-1 sm:pl-3 cursor-default"
    >
      <span className="inline-block break-all">
        {displayText}
        <span className="inline-block animate-pulse text-[#10b981] ml-1 opacity-80">
          _
        </span>
      </span>
    </div>
  );
};
