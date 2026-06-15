import React from 'react';

export default function StepIndicator({ currentStep, totalSteps, title }) {
  return (
    <div className="bg-[#C0392B] px-8 py-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${idx + 1 <= currentStep
                  ? 'bg-[#F1C40F] text-[#1a1a1a]'
                  : 'bg-white bg-opacity-20 text-white'
                }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <span className="text-white text-sm font-semibold ml-2">
          Step {currentStep} of {totalSteps} — {title}
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
        <div
          className="bg-[#F1C40F] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
