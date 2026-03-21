import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Target, CheckCircle2 } from "lucide-react";

interface SchedulePlannerProps {
  totalCards: number;
}

export function SchedulePlanner({ totalCards }: SchedulePlannerProps) {
  const [endDate, setEndDate] = useState<string>("");
  const [studyPlan, setStudyPlan] = useState<any[]>([]);

  const generateStudyPlan = () => {
    if (!endDate) return;

    const today = new Date();
    const end = new Date(endDate);
    const daysUntilEnd = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilEnd <= 0) {
      alert("Please select a future date!");
      return;
    }

    // Calculate cards per day
    const cardsPerDay = Math.ceil(totalCards / daysUntilEnd);
    const plan = [];

    for (let i = 0; i < daysUntilEnd; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const startCard = i * cardsPerDay + 1;
      const endCard = Math.min((i + 1) * cardsPerDay, totalCards);
      
      if (startCard <= totalCards) {
        plan.push({
          day: i + 1,
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          cardsToStudy: endCard - startCard + 1,
          startCard,
          endCard,
          completed: false
        });
      }
    }

    setStudyPlan(plan);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Study Schedule Planner
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create a personalized study schedule for your {totalCards} flashcards
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Target Completion Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generateStudyPlan}
                className="w-full sm:w-auto"
                disabled={!endDate}
              >
                <Target className="w-4 h-4 mr-2" />
                Generate Schedule
              </Button>
            </div>
          </div>

          {studyPlan.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm">Study Plan Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Days:</span>
                  <span className="ml-2 font-semibold">{studyPlan.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Cards/Day:</span>
                  <span className="ml-2 font-semibold">
                    {Math.ceil(totalCards / studyPlan.length)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {studyPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Daily Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studyPlan.map((day) => (
                <div
                  key={day.day}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    day.completed
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Badge variant={day.completed ? "default" : "outline"}>
                          Day {day.day}
                        </Badge>
                        <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Cards {day.startCard} - {day.endCard}
                        </div>
                        <div className="text-xs text-gray-600">
                          {day.cardsToStudy} cards to review
                        </div>
                      </div>
                    </div>
                    <div>
                      {day.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
