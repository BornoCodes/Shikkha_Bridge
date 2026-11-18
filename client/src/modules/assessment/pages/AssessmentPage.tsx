import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar';
import { Button } from '../../../shared/components/ui/Button';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ArrowRight, RotateCcw, Award } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { id } = useParams();

  const questions = [
    {
      id: 'q1',
      text: 'What is the standard algebraic factorization of x² - y²?',
      options: [
        '(x - y)(x + y)',
        '(x - y)²',
        '(x + y)²',
        'x² - 2xy + y²',
      ],
      correct: '(x - y)(x + y)',
    },
    {
      id: 'q2',
      text: 'In the polynomial P(x) = 2x³ - 5x + 7, what is the degree of the polynomial?',
      options: ['Degree 1', 'Degree 2', 'Degree 3', 'Degree 5'],
      correct: 'Degree 3',
    },
    {
      id: 'q3',
      text: 'According to the Factor Theorem, if P(a) = 0 for polynomial P(x), which is a factor?',
      options: ['(x + a)', '(x - a)', 'a * x', 'x / a'],
      correct: '(x - a)',
    },
    {
      id: 'q4',
      text: 'Factor completely: 4a² - 12ab + 9b²',
      options: [
        '(2a - 3b)²',
        '(2a + 3b)²',
        '(4a - 9b)(a - b)',
        '(2a - 3b)(2a + 3b)',
      ],
      correct: '(2a - 3b)²',
    },
    {
      id: 'q5',
      text: 'Which method is most suited for factorizing cubic polynomials without obvious common terms?',
      options: [
        'Vanishing Method (Trial & Remainder Theorem)',
        'Direct Quadratic Formula',
        'Binomial Distribution',
        'Elimination of variables',
      ],
      correct: 'Vanishing Method (Trial & Remainder Theorem)',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentIndex].id]: option,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitted(true);
      toast.success('Diagnostic Assessment Submitted!');
    }
  };

  // Calculate score
  let score = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correct) score++;
  });
  const scorePercent = Math.round((score / questions.length) * 100);

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-cream border border-parchment-dark rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-turmeric/20 text-turmeric-dark flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10" />
        </div>

        <h2 className="font-heading text-3xl font-bold text-matti mb-2">
          Diagnostic Evaluation Complete!
        </h2>
        <p className="text-sm text-matti-light mb-6">
          Your diagnostic score for Algebraic Polynomials & Factorization:
        </p>

        <div className="text-6xl font-extrabold text-terracotta mb-2 font-heading">
          {scorePercent}%
        </div>
        <p className="text-xs text-matti-light mb-8">
          {score} out of {questions.length} questions answered correctly.
        </p>

        <div className="p-4 bg-parchment rounded-2xl text-left mb-8 border border-parchment-dark">
          <h4 className="font-heading font-bold text-sm text-matti mb-1">
            AI Diagnostic Assessment Feedback:
          </h4>
          <p className="text-xs text-matti-light leading-relaxed">
            {scorePercent >= 80
              ? 'Great foundational grasp! You are ready to tackle advanced problem-solving.'
              : 'Knowledge gap confirmed in polynomial factorization. An adaptive catch-up path has been calibrated for you.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/student/recovery-plans">
            <Button variant="primary" size="md">
              <span>View Personalized Recovery Path</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setIsSubmitted(false);
              setCurrentIndex(0);
              setSelectedAnswers({});
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
            Diagnostic Knowledge Check
          </span>
          <h2 className="font-heading text-xl font-bold text-matti">
            Algebraic Polynomials & Factorization
          </h2>
        </div>
        <span className="text-xs font-bold text-matti-light">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <ProgressBar progress={progressPercent} showPercent={false} color="terracotta" />

      <QuestionCard
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        questionText={currentQ.text}
        options={currentQ.options}
        selectedOption={selectedAnswers[currentQ.id] || null}
        onSelectOption={handleSelectOption}
      />

      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          size="md"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          Previous
        </Button>

        <Button
          variant="primary"
          size="md"
          disabled={!selectedAnswers[currentQ.id]}
          onClick={handleNext}
        >
          {currentIndex === questions.length - 1 ? 'Submit Diagnostic' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
