import { CONTENT, BLOB_FIELD_NAME } from "./decoder";
import ContentQuestion from "./ContentQuestion";

interface Props {
  content: CONTENT;
}

function ContentRender({ content }: Props) {
  return (
    <div className="bg-white text-black h-full flex-1 p-10">
      {content.data[BLOB_FIELD_NAME.questions].map(
        (questionType, index, _array) => {
          return (
            <ContentQuestion
              questionType={questionType}
              className="mb-[200px] text-sm"
              depth={0}
              level={index}
            />
          );
        }
      )}
    </div>
  );
}

export default ContentRender;
