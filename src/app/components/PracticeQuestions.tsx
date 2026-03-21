import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import type { PracticeQuestion } from "../data/mockData";

interface PracticeQuestionsProps {
  questions: PracticeQuestion[];
}

export function PracticeQuestions({ questions }: PracticeQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    setScore(prev => ({
      correct: prev.correct + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Reset to beginning
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-500" />
          <h3 className="text-lg font-semibold mb-2">AI-Generated Practice Questions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click "Again" on a flashcard to generate targeted practice questions based on concepts you're struggling with.
          </p>
          <Badge variant="secondary">Powered by Claude</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        {score.total > 0 && (
          <div className="text-sm">
            Score: <span className="font-semibold">{score.correct}/{score.total}</span>
            {" "}
            ({Math.round((score.correct / score.total) * 100)}%)
          </div>
        )}
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showAsCorrect = showExplanation && isCorrect;
            const showAsIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${!showExplanation && isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${showAsCorrect ? 'border-green-500 bg-green-50' : ''}
                  ${showAsIncorrect ? 'border-red-500 bg-red-50' : ''}
                  ${!showExplanation ? 'hover:border-gray-300 cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${isSelected && !showExplanation ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    ${showAsCorrect ? 'border-green-500 bg-green-500' : ''}
                    ${showAsIncorrect ? 'border-red-500 bg-red-500' : ''}
                  `}>
                    {isSelected && !showExplanation && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                    {showAsCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                    {showAsIncorrect && <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm flex-1">{option}</span>
                </div>
              </button>
            );
          })}

          {showExplanation && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold text-sm mb-2">Explanation:</h4>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t">
            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Restart Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
