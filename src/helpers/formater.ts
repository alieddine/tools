import type { Ace } from 'ace-builds';
import vkbeautify from 'vkbeautify';

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



export const format = ({ code, type, amountOfWhitespaces = 2 }: { code: string; type: 'json' | 'xml'; amountOfWhitespaces?: number; }): FormatResult => {
    if (!code) return { success: false, formatted: '', annotations: [] };
    try {
        if (type === 'json') {
            const parsed = JSON.parse(code);
            return { success: true, formatted: vkbeautify.json(parsed, amountOfWhitespaces), annotations: [], markers: [] };
        } else if (type === 'xml') {
            return { success: true, formatted: vkbeautify.xml(code, amountOfWhitespaces), annotations: [], markers: [] };
        }
        return { success: false };
    } catch (error: unknown) {
        console.error(`Invalid ${type}`, error);
        const annotations: Ace.Annotation[] = [];
        const markers: Marker[] = [];
        const match = (error instanceof Error ? error.message : '').match(/at position (\d+)(?:.*\(line (\d+) column (\d+)\))?/i);
        let row = 0;
        let column = 0;
        if (match) {
            const pos = parseInt(match[1], 10);
            if (match[2] && match[3]) {
                row = parseInt(match[2], 10) - 1;
                column = parseInt(match[3], 10) - 1;
            } else {
                const upToError = code.slice(0, pos);
                const lines = upToError.split("\n");
                row = lines.length - 1;
                column = lines[lines.length - 1].length;
            }
        } else {
            const fragmentMatch = (error instanceof Error ? error.message : '').match(/Unexpected token [^,]+, (?:\.{3})?([^.]+)(?:\.{3}|is not valid JSON)/i);
            if (fragmentMatch) {
                let snippet = fragmentMatch[1].trim();
                snippet = snippet.replace(/^[^"]*"/, '"').replace(/",.*$/, '"').trim();
                let firstMatch = code.indexOf(snippet);

                if (firstMatch === -1) {
                    const partialMatch = snippet.match(/"([^"]+)"/);
                    if (partialMatch) {
                        const partialSnippet = partialMatch[1];
                        firstMatch = code.indexOf(partialSnippet);
                    }
                }
                if (firstMatch !== -1) {
                    const errorChunkStart = firstMatch;
                    const errorChunk = code.slice(errorChunkStart, errorChunkStart + 100);
                    const charMatch = (error instanceof Error ? error.message : '').match(/Unexpected token '([^']+)'/);
                    if (charMatch) {
                        const badChar = charMatch[1];
                        const exactPos = errorChunk.indexOf(badChar);
                        if (exactPos !== -1) {
                            const errorPosition = errorChunkStart + exactPos;
                            const upToBadChar = code.slice(0, errorPosition);
                            const lines = upToBadChar.split("\n");
                            row = lines.length - 1;
                            column = lines[lines.length - 1].length;
                        }
                    }
                    if (row === undefined) {
                        const upToError = code.slice(0, firstMatch);
                        const lines = upToError.split("\n");
                        row = lines.length - 1;
                        column = lines[lines.length - 1].length;
                    }
                }
            }
        }
        annotations.push({
            row,
            column,
            type: "error",
            text: (error instanceof Error ? error.message : "Invalid JSON"),
        },
        );
        markers.push({
            startRow: row,
            startCol: column,
            endRow: row,
            endCol: column + 1,
            className: "ace_error-highlight",
            type: "text",
        });



        return { success: false, annotations, markers };
    }
}