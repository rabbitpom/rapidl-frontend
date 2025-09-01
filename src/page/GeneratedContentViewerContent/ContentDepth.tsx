export function GetQuestionLabel(Depth: number, Sequence: number): string {
  if (Depth < 0 || Sequence < 0) {
    throw new Error("Invalid input: Depth and Sequence must be non-negative.");
  }
  const AdjustedDepth = Depth % 3;

  if (AdjustedDepth === 0) {
    return (Sequence + 1).toString();
  }

  if (AdjustedDepth === 1) {
    return String.fromCharCode(96 + Sequence + 1); // 96 is the ASCII code for 'a' - 1
  }

  if (AdjustedDepth === 2) {
    return ToRoman(Sequence + 1);
  }

  throw new Error("Unsupported Depth. Only Depth 0, 1, and 2 are supported.");
}

export function ToRoman(Num: number): string {
  if (Num <= 0) return "";

  const RomanNumerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ] as const;

  let Result = "";
  for (const [Letter, Value] of RomanNumerals) {
    while (Num >= Value) {
      Result += Letter;
      Num -= Value;
    }
  }
  return Result.toLowerCase();
}
