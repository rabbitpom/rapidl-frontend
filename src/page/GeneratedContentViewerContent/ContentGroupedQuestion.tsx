import { BLOB_GROUPED_FIELD_NAME, BLOB_QUESTION_TYPE_GROUPED } from "./decoder";
import ContentQuestionLabel from "./ContentQuestionLabel";
import ContentQuestion from "./ContentQuestion";
import ContentHeader from "./ContentHeader";

interface Props {
  grouped: BLOB_QUESTION_TYPE_GROUPED;
  depth?: number;
  level?: number;
  className?: string;
}

function ContentGroupedQuestion({
  grouped,
  className,
  depth = 0,
  level = 0,
}: Props) {
  return (
    <div className={className} style={{ marginLeft: `${depth * 1.25}rem` }}>
      <div className="flex">
        <ContentQuestionLabel depth={depth} level={level} />
        <div>
          <ContentHeader header={grouped[BLOB_GROUPED_FIELD_NAME.header]} />
          <div>
            {grouped[BLOB_GROUPED_FIELD_NAME.questions].map(
              (questionType, index) => {
                return (
                  <ContentQuestion
                    questionType={questionType}
                    depth={depth + 1}
                    level={index}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGroupedQuestion;
