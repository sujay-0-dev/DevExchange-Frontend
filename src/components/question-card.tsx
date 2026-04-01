import Link from 'next/link';
import { MessageSquare, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Question {
  _id: string;
  title: string;
  description: string;
  votes: number;
  tags: string[];
  createdAt: string;
  author?: {
    _id: string;
    name: string;
    reputation: number;
  };
}

export function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b hover:bg-muted/30 transition-colors">
      <div className="flex sm:flex-col gap-4 sm:gap-2 items-center sm:items-end justify-start sm:w-24 shrink-0 text-muted-foreground text-sm">
        <div className="flex flex-col items-center sm:items-end">
          <span className="font-medium text-foreground">{question.votes}</span>
          <span>votes</span>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <span className="font-medium text-foreground">0</span>
          <span>answers</span> {/* NOTE: Would need answers count from backend */}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <Link href={`/questions/${question._id}`}>
          <h3 className="text-lg font-semibold text-blue-500 hover:text-blue-400 mb-1 line-clamp-2">
            {question.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {question.description.replace(/[#*`~>\[\]\(\)-]/g, '')}
        </p>
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
            {question.author && (
              <div className="flex items-center gap-1">
                <span className="text-blue-400">{question.author.name}</span>
                <span className="font-semibold">• {question.author.reputation}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
