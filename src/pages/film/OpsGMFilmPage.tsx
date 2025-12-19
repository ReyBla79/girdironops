import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OpsGMChat from '@/components/OpsGMChat';

const PROMPT_CHIPS = [
  "What killed us on 3rd down last game?",
  "Clip all Inside Zone vs Odd Front.",
  "Show every Cover 3 bust and likely cause.",
  "What are our top tendencies by down & distance?",
];

const OpsGMFilmPage = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">Ops GM — Film Intelligence</h1>
        <p className="text-muted-foreground">
          Ask questions → get coach-ready answers using your film tags, tendencies, and mock tracking.
        </p>
      </div>

      {/* Prompt Chips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PROMPT_CHIPS.map((chip) => (
              <Badge
                key={chip}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-3"
                onClick={() => setSelectedPrompt(chip)}
              >
                {chip}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ops GM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OpsGMChat initialPrompt={selectedPrompt} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OpsGMFilmPage;
