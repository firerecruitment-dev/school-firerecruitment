import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "General",
  "CPS Prep",
  "Interviewing",
  "Fitness",
  "Resume/Cover Letter",
];

const mockThreads = [
  {
    id: "thread-1",
    title: "Best way to structure CPS practice schedule?",
    category: "CPS Prep",
    replies: 12,
    lastActivity: "2h ago",
  },
  {
    id: "thread-2",
    title: "Panel interview etiquette tips",
    category: "Interviewing",
    replies: 5,
    lastActivity: "6h ago",
  },
  {
    id: "thread-3",
    title: "Cardio benchmarks before testing",
    category: "Fitness",
    replies: 8,
    lastActivity: "1d ago",
  },
];

export default function ForumPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Community Forum</h1>
        <p className="text-muted-foreground">
          Ask questions, share strategies, and get feedback from other candidates.
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="All" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {mockThreads.map((thread) => (
                <Card key={thread.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{thread.category}</Badge>
                      <Badge variant="outline">{thread.replies} replies</Badge>
                    </div>
                    <CardTitle className="text-lg">{thread.title}</CardTitle>
                    <CardDescription>Last activity {thread.lastActivity}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Start a new thread</CardTitle>
                <CardDescription>Sign in to create a new discussion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thread-title">Title</Label>
                  <Input id="thread-title" placeholder="Enter a descriptive title" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thread-category">Category</Label>
                  <Input id="thread-category" placeholder="Select a category" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thread-body">Message</Label>
                  <Textarea id="thread-body" placeholder="Share details or questions" disabled />
                </div>
                <Button className="w-full" disabled>
                  Create thread (Sign in required)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Clerk auth + Convex mutations will power this in the next iteration.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
