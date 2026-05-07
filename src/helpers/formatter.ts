import type { Ace } from 'ace-builds';
import xmlFormatter from "xml-formatter";

export type Marker = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    className: string;
    type: "fullLine" | "screenLine" | "text" | Ace.MarkerRenderer;
};

type FormatResult = {
    success: boolean;
    formatted?: string;
    annotations?: Ace.Annotation[];
    markers?: Marker[];
};



export const format = ({
  code,
  type,
  amountOfWhitespaces = 2,
}: {
  code: string;
  type: "json" | "xml";
  amountOfWhitespaces?: number;
}): FormatResult => {
  if (!code?.trim()) {
    return { success: false, formatted: "", annotations: [], markers: [] };
  }

  try {
    if (type === "json") {
      const parsed = JSON.parse(code);

      return {
        success: true,
        formatted: JSON.stringify(parsed, null, amountOfWhitespaces),
        annotations: [],
        markers: [],
      };
    }

    if (type === "xml") {
      const formatted = xmlFormatter(code, {
        indentation: " ".repeat(amountOfWhitespaces),
        collapseContent: true, // avoids extra \n
        lineSeparator: "\n",
        whiteSpaceAtEndOfSelfclosingTag: false,
      });

      return {
        success: true,
        formatted,
        annotations: [],
        markers: [],
      };
    }

    return { success: false, formatted: "", annotations: [], markers: [] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid input";

    let row = 0;
    let column = 0;

    // Better position detection (works for both JSON & XML parsers)
    const match = message.match(/position (\d+)/i);

    if (match) {
      const pos = Number(match[1]);
      const lines = code.slice(0, pos).split("\n");
      row = lines.length - 1;
      column = lines.at(-1)?.length || 0;
    }

    return {
      success: false,
      annotations: [
        {
          row,
          column,
          type: "error",
          text: message,
        },
      ],
      markers: [
        {
          startRow: row,
          startCol: column,
          endRow: row,
          endCol: column + 1,
          className: "ace_error-highlight",
          type: "text",
        },
      ],
    };
  }
};
