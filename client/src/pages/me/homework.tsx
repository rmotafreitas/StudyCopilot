import { HomeworkParams } from "@/App";
import {
  HomeworkQuestion,
  HomeworkQuestionSplitterDownArrow,
} from "@/components/homework-question";
import { Navbar } from "@/components/navbar";
import { getHomework } from "@/lib/api";
import { hankoApi } from "@/lib/hanko";
import { IHomeWork, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MyHomeworkPage() {
  const router = useNavigate();
  const { id } = useParams<HomeworkParams>();
  const { fetchUserFromCookies } = useAuth();
  const [homework, setHomework] = useState<IHomeWork | null>(null);

  useEffect(() => {
    fetchUserFromCookies().then((res) => {
      if (!res) {
        router("/auth");
        return;
      }
    });

    if (!id) {
      router("/me/workspaces");
      return;
    }

    getHomework(id).then((res) => {
      if (!res) {
        router("/me/workspaces");
        return;
      }

      setHomework(res);
    });

    register(hankoApi).catch((error) => {
      console.error(error);
      // handle error
    });
  }, []);

  return (
    homework && (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <section className="flex-1 flex flex-col items-center my-4">
          <p className="text-2xl font-bold">
            Homework from {new Date(homework.created_at).toLocaleDateString()}
            {" 📅"}
          </p>
          {homework?.questions.map((question) => (
            <>
              <HomeworkQuestion key={question.id} {...question} />
              {question !==
                homework.questions[homework.questions.length - 1] && (
                <HomeworkQuestionSplitterDownArrow />
              )}
            </>
          ))}
        </section>
      </div>
    )
  );
}
