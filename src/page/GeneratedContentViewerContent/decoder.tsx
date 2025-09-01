import msgpack from "tiny-msgpack";

export type RAW_CONTENT_PAYLOAD = {
  status: "Working" | "Failed" | "Waiting" | "Success";
  content: null | RAW_CONTENT_BLOB;
};

export type RAW_CONTENT_BLOB = {
  blob: string;
  createdat: string;
  finishedon: string | null;
  displayname: string;
  options: string;
  category: string;
  creditsused: number;
};

export type LOCAL_TIME = {
  date: string;
  time: string;
};

export type CONTENT = {
  status: "Working" | "Failed" | "Waiting" | "Success";
  creditsused: number;
  createdat: LOCAL_TIME;
  finishedon: LOCAL_TIME;
  name: string;
  options: string[];
  category: string;
  data: BLOB;
};

export const BLOB_FIELD_NAME = {
  questions: 0,
  created_by: 1,
  created_on: 2,
  generated_catagory: 3,
  generated_options: 4,
} as const;

export const BLOB_GROUPED_FIELD_NAME = {
  header: 0,
  questions: 1,
} as const;

export const BLOB_SINGLE_FIELD_NAME = {
  header: 0,
  raw_text: 1,
  latex_text: 2,
  mark_scheme: 3,
} as const;

export const BLOB_HEADER_FIELD_NAME = {
  raw_text: 0,
  latex_text: 1,
} as const;

export const BLOB_MARK_SCHEME_FIELD_NAME = {
  raw_text: 0,
  latex_text: 1,
} as const;

export type BLOB_MARK_SCHEME = {
  [BLOB_MARK_SCHEME_FIELD_NAME.raw_text]: string;
  [BLOB_MARK_SCHEME_FIELD_NAME.latex_text]: string;
};

export type BLOB_QUESTION_HEADER = {
  [BLOB_HEADER_FIELD_NAME.raw_text]: string;
  [BLOB_HEADER_FIELD_NAME.latex_text]: string;
};

export type BLOB_QUESTION_TYPE_GROUPED = {
  [BLOB_GROUPED_FIELD_NAME.header]: BLOB_QUESTION_HEADER;
  [BLOB_GROUPED_FIELD_NAME.questions]: BLOB_QUESTION_TYPE[];
};

export type BLOB_QUESTION_TYPE_SINGLE = {
  [BLOB_SINGLE_FIELD_NAME.header]: BLOB_QUESTION_HEADER;
  [BLOB_SINGLE_FIELD_NAME.raw_text]: string;
  [BLOB_SINGLE_FIELD_NAME.latex_text]: string;
  [BLOB_SINGLE_FIELD_NAME.mark_scheme]: BLOB_MARK_SCHEME;
};

export type BLOB_QUESTION_TYPE = {
  Grouped: BLOB_QUESTION_TYPE_GROUPED | null;
  Single: BLOB_QUESTION_TYPE_SINGLE | null;
};

export type BLOB_CREATED_BY_USER_ID = number;
export type BLOB_CREATED_ON = string;
export type BLOB_GENERATED_CATAGORY = string;
export type BLOB_GENERATED_OPTION = string;
export type BLOB_GENERATED_OPTIONS = BLOB_GENERATED_OPTION[];

export type BLOB = {
  [BLOB_FIELD_NAME.questions]: BLOB_QUESTION_TYPE[];
  [BLOB_FIELD_NAME.created_by]: BLOB_CREATED_BY_USER_ID;
  [BLOB_FIELD_NAME.created_on]: BLOB_CREATED_ON;
  [BLOB_FIELD_NAME.generated_catagory]: BLOB_GENERATED_CATAGORY;
  [BLOB_FIELD_NAME.generated_options]: BLOB_GENERATED_OPTIONS;
};

export function FormatUTCDateTime(utcTimestamp: string | null) {
  if (!utcTimestamp) {
    return [];
  }

  const utcDate = new Date(utcTimestamp);
  const utcTime = utcDate.getTime();

  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  const localTime = utcTime - timezoneOffset;
  const localDate = new Date(localTime);

  const dateFormatter = new Intl.DateTimeFormat("en-CA", { dateStyle: "long" });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const localDateStr = dateFormatter.format(localDate);
  const localTimeStr = timeFormatter.format(localDate);

  return [localDateStr, localTimeStr];
}

export async function DecodeBlob(base64String: string) {
  const binaryString = atob(base64String);
  const binaryData = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    binaryData[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([binaryData]);
  const decompressedBlob = await DecompressBlob(blob);
  return decompressedBlob;
}

export async function DecompressBlob(blob: Blob) {
  let ds = new DecompressionStream("gzip");
  let decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

export function BlobToUint8Array(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const arrayBuffer = reader.result;
      if (arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
        resolve(uint8Array);
      } else {
        reject(new Error("Failed to read Blob as ArrayBuffer"));
      }
    };

    reader.onerror = function () {
      reject(new Error("Failed to read Blob"));
    };

    reader.readAsArrayBuffer(blob);
  });
}

export async function ParseRawContent(
  id: string,
  rawContent: RAW_CONTENT_PAYLOAD
): Promise<CONTENT | void> {
  if (rawContent.status != "Success") {
    return;
  }
  if (rawContent.content == null) {
    return;
  }
  if (rawContent.content.finishedon == null) {
    return;
  }
  let blob = await DecodeBlob(rawContent.content.blob);
  let [createdDate, createdTime] = FormatUTCDateTime(
    rawContent.content.createdat
  );
  let [finishedDate, finishedTime] = FormatUTCDateTime(
    rawContent.content.finishedon
  );
  return {
    status: rawContent.status,
    creditsused: rawContent.content.creditsused,
    name:
      rawContent.content.displayname.length == 0
        ? id
        : rawContent.content.displayname,
    category: rawContent.content.category,
    options: rawContent.content.options.split(","),
    createdat: { date: createdDate, time: createdTime },
    finishedon: { date: finishedDate, time: finishedTime },
    data: msgpack.decode(await BlobToUint8Array(blob)),
  };
}
