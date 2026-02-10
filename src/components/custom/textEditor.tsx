import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import type { Marker } from '../../helpers/formatter';
import { Ace } from 'ace-builds';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/theme-cloud9_night';
import 'ace-builds/src-noconflict/theme-cloud9_night_low_color';
import 'ace-builds/src-noconflict/theme-cloud_editor';
import 'ace-builds/src-noconflict/theme-cloud_editor_dark';
import 'ace-builds/src-noconflict/theme-clouds';
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-crimson_editor';
import 'ace-builds/src-noconflict/theme-dawn';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-dreamweaver';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-github_light_default';
import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard';
import 'ace-builds/src-noconflict/theme-gruvbox_light_hard';
import 'ace-builds/src-noconflict/theme-idle_fingers';
import 'ace-builds/src-noconflict/theme-iplastic';
import 'ace-builds/src-noconflict/theme-katzenmilch';
import 'ace-builds/src-noconflict/theme-kr_theme';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-merbivore';
import 'ace-builds/src-noconflict/theme-merbivore_soft';
import 'ace-builds/src-noconflict/theme-mono_industrial';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-vibrant_ink';
import 'ace-builds/src-noconflict/theme-xcode';
import "ace-builds/src-noconflict/ext-searchbox";

import './textEditor.css';
import { X } from 'lucide-react';
import type { ThemeType } from '@/lib/themes';


type Props = {
  value: string;
  language: 'json' | 'xml';
  theme?: ThemeType;
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
