import { BLOB_SINGLE_FIELD_NAME, BLOB_QUESTION_TYPE_SINGLE } from "./decoder";
import { MathJax } from "better-react-mathjax";

interface Props {
  single: BLOB_QUESTION_TYPE_SINGLE;
}

export function IsContentBodyRendered({ single }: Props) {
  return (
    single[BLOB_SINGLE_FIELD_NAME.latex_text].length > 0 &&
    single[BLOB_SINGLE_FIELD_NAME.raw_text].length > 0
  );
}

function ContentBody({ single }: Props) {
  return (
    single[BLOB_SINGLE_FIELD_NAME.latex_text].length > 0 &&
    single[BLOB_SINGLE_FIELD_NAME.raw_text].length > 0 && (
      <div className="mb-6">
        <MathJax>{single[BLOB_SINGLE_FIELD_NAME.latex_text]}</MathJax>
      </div>
    )
  );
}

export default ContentBody;
