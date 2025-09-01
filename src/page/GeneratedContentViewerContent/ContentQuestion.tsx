import { BLOB_QUESTION_TYPE } from "./decoder";
import ContentSingleQuestion from "./ContentSingleQuestion";
import ContentGroupedQuestion from "./ContentGroupedQuestion";

interface Props {
  questionType: BLOB_QUESTION_TYPE;
  depth?: number;
  level?: number;
  className?: string;
}

export default function ContentQuestion({
  questionType,
  className,
  depth = 0,
  level = 0,
}: Props) {
  return (
    <>
      {questionType.Single && (
        <ContentSingleQuestion
          single={questionType.Single}
          className={className}
          depth={depth}
          level={level}
        />
      )}
      {questionType.Grouped && (
        <ContentGroupedQuestion
          grouped={questionType.Grouped}
          className={className}
          depth={depth}
          level={level}
        />
      )}
    </>
  );
}
