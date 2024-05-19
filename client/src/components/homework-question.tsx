import api from "@/lib/api/api";
import { IQuestion } from "@/lib/hooks/useAuth";

export function HomeworkQuestion({ prompt, answer, screenshot }: IQuestion) {
  return (
    <div className="w-full flex flex-row-reverse items-center p-8 gap-8">
      <div className="flex flex-col justify-between gap-4 w-1/2 h-full flex-1">
        <AnswerOrQuestion text={prompt} isAnswer={false} />
        <AnswerOrQuestion text={answer} isAnswer={true} />
      </div>
      {screenshot && (
        <img
          className="w-1/2 h-1/2 object-contain border-4 border-primary rounded-lg"
          src={`${api.getUri()}/uploads/${screenshot}`}
          alt="screenshot"
        />
      )}
    </div>
  );
}

export function HomeworkQuestionSplitterDownArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  );
}

function AnswerOrQuestion({
  text,
  isAnswer,
}: {
  text: string;
  isAnswer: boolean;
}) {
  return (
    <p
      className={`text-2xl bg-muted p-4 rounded-md font-semibold ${
        isAnswer ? "text-primary" : ""
      }`}
    >
      {`${isAnswer ? "Copilot 🤖" : "You 😀"}: ${text}`}
    </p>
  );
}
