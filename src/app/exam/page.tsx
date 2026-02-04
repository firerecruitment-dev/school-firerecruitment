"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const sampleQuestions = [
  {
    id: "q1",
    category: "Mathematical Reasoning",
    question: "A firefighter is using a 1.75-inch handline that flows 150 GPM. If the friction loss is 30 PSI per 100 feet, what is the total friction loss for a 200-foot hose lay?",
    options: ["30 PSI", "45 PSI", "60 PSI", "90 PSI"],
    correctAnswerIndex: 2,
    explanation: "Friction loss is cumulative: 30 PSI per 100ft × 2 = 60 PSI.",
  },
  {
    id: "q2",
    category: "Mechanical Reasoning",
    question: "In a 3:1 mechanical advantage system, if a firefighter pulls 30 feet of rope, how far will the load move?",
    options: ["10 feet", "15 feet", "30 feet", "90 feet"],
    correctAnswerIndex: 0,
    explanation: "In a 3:1 system, the load moves one third of the rope pulled: 30ft ÷ 3 = 10ft.",
  },
  {
    id: "q3",
    category: "Problem Sensitivity",
    question: "You are ventilating a roof and notice the decking feels 'spongy' under your feet. What is the most immediate danger?",
    options: ["Equipment failure", "Flashover", "Structural collapse", "Backdraft"],
    correctAnswerIndex: 2,
    explanation: "Spongy decking indicates compromised structural integrity and collapse risk.",
  }
];

const TOTAL_TIME_SECONDS = 20 * 60;

type Answer = {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
};

type ExamMode = "inProgress" | "review" | "results";

export default function ExamPage() {
  const [mode, setMode] = useState<ExamMode>("inProgress");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  const isTimeUp = timeRemaining <= 0;

  useEffect(() => {
    if (mode !== "inProgress" || isTimeUp) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isTimeUp]);

  const effectiveAnswers = useMemo(() => {
    if (!isTimeUp || selectedOption === undefined || answers[currentQuestion.id]) {
      return answers;
    }
    return {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionIndex: Number(selectedOption),
        isCorrect: Number(selectedOption) === currentQuestion.correctAnswerIndex,
      },
    };
  }, [answers, currentQuestion, isTimeUp, selectedOption]);

  const score = useMemo(() => {
    const values = Object.values(effectiveAnswers);
    if (values.length === 0) return 0;
    const correct = values.filter((answer) => answer.isCorrect).length;
    return Math.round((correct / sampleQuestions.length) * 100);
  }, [effectiveAnswers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recordAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
        isCorrect: optionIndex === currentQuestion.correctAnswerIndex,
      },
    }));
  };

  const handleFinish = () => {
    if (selectedOption === undefined) return;
    const answeredIds = new Set(Object.keys(answers));
    if (!answeredIds.has(currentQuestion.id)) {
      answeredIds.add(currentQuestion.id);
    }
    const unanswered = sampleQuestions.length - answeredIds.size;
    if (unanswered > 0 && !window.confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) {
      return;
    }
    recordAnswer(Number(selectedOption));
    setMode("results");
  };

  const handleNext = () => {
    if (selectedOption === undefined) return;
    recordAnswer(Number(selectedOption));
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = sampleQuestions[nextIndex];
      const existing = answers[nextQuestion.id];
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(existing ? existing.selectedOptionIndex.toString() : undefined);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    if (selectedOption !== undefined) {
      recordAnswer(Number(selectedOption));
    }
    const prevIndex = currentQuestionIndex - 1;
    const prevQuestion = sampleQuestions[prevIndex];
    const existing = answers[prevQuestion.id];
    setCurrentQuestionIndex(prevIndex);
    setSelectedOption(existing ? existing.selectedOptionIndex.toString() : undefined);
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleReview = () => {
    if (selectedOption !== undefined) {
      recordAnswer(Number(selectedOption));
    }
    setMode("review");
    const firstQuestion = sampleQuestions[0];
    const existing = answers[firstQuestion.id];
    setCurrentQuestionIndex(0);
    setSelectedOption(existing ? existing.selectedOptionIndex.toString() : undefined);
  };

  const handleRestart = () => {
    setMode("inProgress");
    setCurrentQuestionIndex(0);
    setSelectedOption(undefined);
    setAnswers({});
    setFlagged({});
    setTimeRemaining(TOTAL_TIME_SECONDS);
  };

  const handleReturnToExam = () => {
    const question = sampleQuestions[currentQuestionIndex];
    const existing = answers[question.id];
    setSelectedOption(existing ? existing.selectedOptionIndex.toString() : undefined);
    setMode("inProgress");
  };

  const handleViewResultsFromReview = () => {
    const unanswered = sampleQuestions.length - Object.keys(effectiveAnswers).length;
    if (!isTimeUp && unanswered > 0 && !window.confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) {
      return;
    }
    setMode("results");
  };

  if (mode === "review") {
    return (
      <div className="container mx-auto py-10 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
            <CardDescription>Compare your answers with the correct solutions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={index === currentQuestionIndex ? "secondary" : "outline"}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  Q{index + 1}
                </Button>
              ))}
            </div>
            {(() => {
              const question = sampleQuestions[currentQuestionIndex];
              const answer = effectiveAnswers[question.id];
              const selectedIndex = answer?.selectedOptionIndex;
              return (
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{question.category}</span>
                    {flagged[question.id] && <Badge variant="secondary">Flagged</Badge>}
                  </div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm">
                    Your answer: {selectedIndex !== undefined ? question.options[selectedIndex] : "Not answered"}
                  </p>
                  <p className="text-sm">
                    Correct answer: {question.options[question.correctAnswerIndex]}
                  </p>
                  <p className="text-xs text-muted-foreground">{question.explanation}</p>
                </div>
              );
            })()}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleReturnToExam} disabled={isTimeUp}>Back to Exam</Button>
            <Button onClick={handleViewResultsFromReview}>View Results</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (mode === "results" || isTimeUp) {
    return (
      <div className="container mx-auto py-10 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Exam Results</CardTitle>
            <CardDescription>Your CPS practice results and next steps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Final Score</span>
              <div className="text-4xl font-semibold">{score}%</div>
              <Progress value={score} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              {score >= 70 ? (
                <Badge variant="secondary">Pass benchmark (70%)</Badge>
              ) : (
                <Badge variant="destructive">Below benchmark</Badge>
              )}
              <Badge variant="outline">Time Remaining: {formatTime(timeRemaining)}</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button onClick={handleReview}>Review Answers</Button>
            <Button variant="outline" onClick={handleRestart}>Restart Exam</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</span>
        <span>{currentQuestion.category}</span>
      </div>

      <div className="flex items-center justify-between">
        <Progress value={progress} className="h-2 w-full" />
        <span className={`ml-4 text-sm font-medium ${timeRemaining <= 60 ? "text-destructive animate-pulse" : ""}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription>Select the best answer from the options below.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={`${currentQuestion.id}-${index}`} className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value={index.toString()} id={`${currentQuestion.id}-option-${index}`} />
                <Label htmlFor={`${currentQuestion.id}-option-${index}`} className="flex-1 cursor-pointer font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-3 border-t p-6">
          <Button variant={flagged[currentQuestion.id] ? "secondary" : "outline"} onClick={handleToggleFlag}>
            {flagged[currentQuestion.id] ? "Flagged" : "Flag for Review"}
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleReview}>
              Review Mode
            </Button>
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={selectedOption === undefined}>
              {currentQuestionIndex === sampleQuestions.length - 1 ? "Finish Exam" : "Next Question"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
