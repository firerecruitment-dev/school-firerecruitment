"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockStats = {
  testsCompleted: 3,
  averageScore: 78,
  strongestCategory: "Math Reasoning",
  weakestCategory: "Spatial Orientation",
};

const mockAttempts = [
  {
    id: "attempt-1",
    testName: "CPS Mock Exam #1",
    score: 82,
    date: "Feb 2, 2026",
    status: "Pass",
  },
  {
    id: "attempt-2",
    testName: "Mechanical Reasoning Quiz",
    score: 74,
    date: "Jan 30, 2026",
    status: "Pass",
  },
  {
    id: "attempt-3",
    testName: "Spatial Orientation Drill",
    score: 68,
    date: "Jan 25, 2026",
    status: "Review",
  },
];

const categoryProgress = [
  { category: "Math Reasoning", score: 84 },
  { category: "Mechanical Reasoning", score: 79 },
  { category: "Problem Sensitivity", score: 76 },
  { category: "Information Ordering", score: 72 },
  { category: "Spatial Orientation", score: 64 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, Recruit</h1>
          <p className="text-muted-foreground">Track your CPS prep progress and stay ready for your next exam.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">View Study Plan</Button>
          <Button>Start New Practice Test</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Tests Completed</CardDescription>
            <CardTitle className="text-3xl">{mockStats.testsCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Keep the streak going.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{mockStats.averageScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={mockStats.averageScore} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Strongest Category</CardDescription>
            <CardTitle>{mockStats.strongestCategory}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Keep sharpening</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Needs Focus</CardDescription>
            <CardTitle>{mockStats.weakestCategory}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">Priority</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress Breakdown</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Review your category scores and focus on weak areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryProgress.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.category}</span>
                    <span>{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
              <CardDescription>See how your last practice sessions went.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">{attempt.testName}</TableCell>
                      <TableCell>{attempt.score}%</TableCell>
                      <TableCell>{attempt.date}</TableCell>
                      <TableCell>
                        <Badge variant={attempt.status === "Review" ? "destructive" : "secondary"}>
                          {attempt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline">View Full History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
