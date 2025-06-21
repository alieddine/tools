import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import type { Marker } from '../../helpers/formater';
import { Ace } from 'ace-builds';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/ext-searchbox";
import './textEditor.css';
import { X } from 'lucide-react';
 

type Props = {
  value: string;
  language: 'json' | 'xml';
  theme?: 'github' | 'vibrant_ink';
  onChange: (value: string) => void;
  annotations?: Ace.Annotation[];
  markers?: Marker[];
};

const TextEditor: React.FC<Props> = ({ value, theme = "vibrant_ink", language, onChange, annotations, markers }) => {
  const editorRef = useRef<AceEditor | null>(null);
  const updateTooltipPosition = React.useCallback(() => {
    const editor = editorRef.current?.editor;
    if (!annotations) return;
    if (!editor || annotations.length === 0){
      setTooltip(null);
      return;
    };

    const { row, column, text } = annotations[0];
    const coords = editor.renderer.textToScreenCoordinates(row, column);
    let x, y;
    if (coords.pageY < editor.renderer.layerConfig.offset) {
        x = coords.pageY + editor.renderer.layerConfig.offset - 90;
    }
    else {
        x = coords.pageY + editor.renderer.layerConfig.offset - 140;
    }
    if (coords.pageX + 670 > editor.container.clientWidth) {
      y = coords.pageX - 670;
    } else {
      y = coords.pageX + 10;
    }
    setTooltip({
      top: x,
      left: y,
      text: text,
    });
  }, [annotations, editorRef]);
  

  useEffect(() => {
    const editor = editorRef.current?.editor;


    if (editor) {
      editor.commands.addCommand({
        name: "showSearchBox",
        exec: function (editor: Ace.Editor) {
          editor.execCommand("find");
        },
      });

    }
  }, []);
  const [tooltip, setTooltip] = React.useState<{ top: number; left: number; text: string } | null>(null);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (!annotations) return;
    if (!editor || annotations.length === 0) {
      setTooltip(null);
      return;
    };
    const { row , column} = annotations[0];
    editor.scrollToLine(row + 1, true, true, () => {
      
      updateTooltipPosition();
    });
    editor.renderer.scrollToY(row * editor.renderer.lineHeight);
    const container = editor.container;
    if (container.clientWidth < column * editor.renderer.characterWidth){
      editor.renderer.scrollToX(column * editor.renderer.characterWidth);
    }

    setTimeout(() => updateTooltipPosition(), 100);
  }, [annotations, updateTooltipPosition]);
  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (!annotations) return;
    if (!editor || annotations.length === 0) {
      setTooltip(null);
      return;
    };

    const onScroll = () => updateTooltipPosition();

    editor.session.on('changeScrollTop', onScroll);
    editor.session.on('changeScrollLeft', onScroll);
  
    return () => {
      editor.session.off('changeScrollTop', onScroll);
      editor.session.off('changeScrollLeft', onScroll);
    };
  }, [annotations, updateTooltipPosition]);
  
  return (
    <div className="w-full h-[93%] mb-3 overflow-hidden">
      <AceEditor
        mode={language}
        theme={theme}
        value={value}
        onChange={onChange}
        name="UNIQUE_ID"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="100%"
        annotations={annotations}
        markers={markers}

        setOptions={{
          useWorker: false,
          fontSize: 17,
          showLineNumbers: true,
          tabSize: 2,
        }}
        ref={editorRef}
      />
      {tooltip && (
        <div
          id="tooltip error"
          style={{ top: tooltip.top, left: tooltip.left }}
          className="absolute gap-6 bg-red-100 text-nowrap flex border border-red-500 text-red-700 p-2 rounded z-[100] shadow-lg"
        >
          {tooltip.text}
          <X className=" w-5 cursor-pointer" onClick={() => setTooltip(null)} />
        </div>
      )}

    </div>
  );
};

export default TextEditor;

