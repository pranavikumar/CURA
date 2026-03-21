import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { RotateCcw } from "lucide-react";

interface AnkiCardProps {
  front: string;
  back: string;
  tags: string[];
  onAgain: () => void;
  onGood: () => void;
  onEasy: () => void;
}

export function AnkiCard({ front, back, tags, onAgain, onGood, onEasy }: AnkiCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4 flex gap-2 flex-wrap">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div 
          className="min-h-[200px] p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setFlipped(!flipped)}
        >
          {!flipped ? (
            <div>
              <div className="text-sm text-gray-500 mb-2">Question:</div>
              <div className="text-lg">{front}</div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-gray-500 mb-2">Question:</div>
              <div className="text-base mb-4 text-gray-700">{front}</div>
              <div className="text-sm text-gray-500 mb-2 mt-4 pt-4 border-t">Answer:</div>
              <div className="text-lg">{back}</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFlipped(!flipped)}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            {flipped ? "Hide Answer" : "Show Answer"}
          </Button>
        </div>

        {flipped && (
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onEasy();
                setFlipped(false);
              }}
            >
              Easy
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onGood();
                setFlipped(false);
              }}
            >
              Medium
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onAgain();
                setFlipped(false);
              }}
            >
              Hard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}