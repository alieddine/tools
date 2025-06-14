import React from 'react';
import AceEditor from 'react-ace';

// Import modes and themes you use
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';

type Props = {
    value: string;
    language: 'json' | 'xml';
    theme?: 'monokai' | 'github';
    onChange: (value: string) => void;
};

const TextEditor: React.FC<Props> = ({ value, theme, language, onChange }) => {
    return (
        <div className="w-full h-[90%] mb-3 border border-gray-700 rounded-md overflow-hidden">
            <AceEditor
                mode={language}
                theme={theme}
                value={value}
                onChange={onChange}
                name="UNIQUE_ID"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                height="100%"
                setOptions={{
                    useWorker: false,
                    fontSize: 17,

                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        </div>
    );
};

export default TextEditor;

