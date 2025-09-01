import { MathJax } from "better-react-mathjax";
import { GetQuestionLabel } from "./ContentDepth";
import { cn } from "@/lib/utils";

interface Props {
  depth: number;
  level: number;
  className?: string;
}

function ContentQuestionLabel({ depth, level, className }: Props) {
  return depth == 0 ? (
    <MathJax className={cn(className, "mr-4")}>{`\\(\\mathbf{${GetQuestionLabel(
      depth,
      level
    )}}\\)`}</MathJax>
  ) : (
    <MathJax className={cn(className, "mr-2")}>{`\\((\\text{${GetQuestionLabel(
      depth,
      level
    )}})\\)`}</MathJax>
  );
}

export default ContentQuestionLabel;
