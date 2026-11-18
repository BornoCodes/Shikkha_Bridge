import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div className="bg-cream border border-parchment-dark rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex justify-between items-center text-xs font-semibold text-matti-light mb-4">
        <span className="text-terracotta uppercase tracking-wider">
          Diagnostic Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="font-heading text-xl sm:text-2xl font-bold text-matti leading-snug mb-6">
        {questionText}
      </h3>

      <div className="space-y-3">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption(opt)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-terracotta bg-terracotta/10 text-matti font-semibold shadow-xs'
                  : 'border-parchment-dark bg-parchment/40 text-matti hover:border-terracotta/40 hover:bg-parchment'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected
                      ? 'bg-terracotta text-white'
                      : 'bg-parchment-dark text-matti-light'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm">{opt}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
