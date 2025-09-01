import { BLOB_SINGLE_FIELD_NAME, BLOB_QUESTION_TYPE_SINGLE } from "./decoder";
import ContentQuestionLabel from "./ContentQuestionLabel";
import ContentHeader from "./ContentHeader";
import ContentBody, { IsContentBodyRendered } from "./ContentBody";

interface Props {
  single: BLOB_QUESTION_TYPE_SINGLE;
  depth?: number;
  level?: number;
  className?: string;
}

function ContentSingleQuestion({
  single,
  className,
  depth = 0,
  level = 0,
}: Props) {
  return (
    <div className={className} style={{ marginLeft: `${depth * 1.25}rem` }}>
      {IsContentBodyRendered({ single }) ? (
        <>
          <ContentHeader
            header={single[BLOB_SINGLE_FIELD_NAME.header]}
            close={true}
          />
          <div className="flex">
            <ContentQuestionLabel depth={depth} level={level} />
            <div>
              <ContentBody single={single} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex">
            <ContentQuestionLabel depth={depth} level={level} />
            <div>
              <ContentHeader header={single[BLOB_SINGLE_FIELD_NAME.header]} />
              <ContentBody single={single} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ContentSingleQuestion;
