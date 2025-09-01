import { BLOB_HEADER_FIELD_NAME, BLOB_QUESTION_HEADER } from "./decoder";
import { MathJax } from "better-react-mathjax";

interface Props {
  header: BLOB_QUESTION_HEADER;
  close?: boolean;
}

function ContentHeader({ header, close = false }: Props) {
  return (
    header[BLOB_HEADER_FIELD_NAME.latex_text].length > 0 &&
    header[BLOB_HEADER_FIELD_NAME.raw_text].length > 0 && (
      <div className={close ? "mb-1" : "mb-4"}>
        <MathJax>{header[BLOB_HEADER_FIELD_NAME.latex_text]}</MathJax>
      </div>
    )
  );
}

export default ContentHeader;
