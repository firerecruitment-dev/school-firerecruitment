"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

const sampleQuestions = [
  {
    id: "q1",
    category: "Mathematical Reasoning",
    question: "A firefighter is using a 1.75-inch handline that flows 150 GPM. If the friction loss is 30 PSI per 100 feet, what is the total friction loss for a 200-foot hose lay?",
    options: ["30 PSI", "45 PSI", "60 PSI", "90 PSI"],
    correctAnswerIndex: 2,
  },
  {
    id: "q2",
    category: "Mechanical Reasoning",
    question: "In a 3:1 mechanical advantage system, if a firefighter pulls 30 feet of rope, how far will the load move?",
    options: ["10 feet", "15 feet", "30 feet", "90 feet"],
    correctAnswerIndex: 0,
  }
];

export default function ExamPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(undefined);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</span>
          <span>{currentQuestion.category}</span>
        </div>
        <Progress value={progress} className="h-2" />
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
              <div key={index} className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline">Flag for Review</Button>
          <Button onClick={handleNext} disabled={selectedOption === undefined}>
            {currentQuestionIndex === sampleQuestions.length - 1 ? "Finish Exam" : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
