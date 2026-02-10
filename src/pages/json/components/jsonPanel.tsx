import TextEditor from '@/components/custom/textEditor';
import { useEffect, useState } from 'react';
import { GetJsonTheme } from '../../../helpers/theme.ts';
import { format } from '../../../helpers/formater.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { deleteFile, getFile, listFilesByType, saveNewFile, updateFile } from '../../../helpers/manage-db.ts';
import { Button } from '@/components/ui/button.tsx';
import type { FileEntry } from '@/helpers/db.ts';
import { type Ace } from 'ace-builds';
import type { Marker } from '../../../helpers/formater';
import { CarbonExecutableProgram, MaterialSymbolsAddNotes, MdiCodeJson, MdiContentCopy, MdiContentSave, MdiDeleteForever, MdiMathLog } from '@/components/custom/svgs.tsx';
import { useEditorThemeContext } from '@/context/EditorThemeContext.tsx';


type FileListItem = {
  id: number;
  name: string;
};


function JsonPanel() {

  const [selectedFile, setSelectedFile] = useState<FileEntry>({
    name: '',
    type: 'json',
    content: '',
    createdAt: new Date().toISOString(),
  });
  const [annotations, setAnnotations] = useState<Ace.Annotation[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const { editorTheme } = useEditorThemeContext();
  return (
    <div className="flex flex-col h-[800px] text-text  scale-x-100 min-w-[400px] items-start justify-start">
      <ControlMenu selectedFile={selectedFile} setSelectedFile={setSelectedFile} setAnnotations={setAnnotations} setMarkers={setMarkers} />
      <div className="flex relative flex-1 h-full  w-full">
        <div className=" bg-card w-full h-full text-text">
          <TextEditor
            value={selectedFile?.content ?? ""}
            language="json"
            theme={editorTheme || GetJsonTheme()}
            onChange={(val) => setSelectedFile({ ...selectedFile, content: val })}
            annotations={annotations}
            markers={markers}
          />
        </div>

      </div>
    </div>
  )
}


const ControlMenu = ({
  selectedFile,
  setSelectedFile,
  setAnnotations,
  setMarkers,
}: {
  selectedFile: FileEntry;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileEntry>>;
  setAnnotations: React.Dispatch<React.SetStateAction<Ace.Annotation[]>>;
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>;
}) => {
  const [fileList, setFileList] = useState<FileListItem[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [openFileNamePopover, setOpenFileNamePopover] = useState<boolean>(false);
  const [updateFileList, setUpdateFileList] = useState<boolean>(false);

  const formatJson = () => {
    if (!selectedFile) {
      console.error('No file selected for formatting');
      return;
    }
    const formattedJson = format({ code: selectedFile.content, type: 'json' });
    if (formattedJson.success && formattedJson.formatted) {
      setSelectedFile({ ...selectedFile, content: formattedJson.formatted });
      setAnnotations([]);
      setMarkers([]);
    } else if (!formattedJson.success) {
      setAnnotations(formattedJson.annotations || []);
      setMarkers(formattedJson.markers || []);
    }
  };

  const deleteText = () => {
    if (!selectedFile) {
      console.error('No file selected for deletion');
      return;
    }
    const fileId = selectedFile.id;
    if (!fileId) {
      setSelectedFile({ ...selectedFile, content: '' });
    } else {
      deleteFile(fileId);
      initializeNewFile();
      setUpdateFileList(!updateFileList);
    }
  };

  const copyToClipboard = () => {
    if (!selectedFile) {
      console.error('No file selected for copying');
      return;
    }
    navigator.clipboard.writeText(selectedFile.content)
      .then(() => { })
      .catch(err => {
        console.error('Failed to copy JSON: ', err);
      });
  };

  const flatJson = () => {
    if (!selectedFile) {
      console.error('No file selected for flattening');
      return;
    }
    try {
      const parsedJson = JSON.parse(selectedFile.content);
      const flattenedJson = JSON.stringify(parsedJson);
      setSelectedFile({ ...selectedFile, content: flattenedJson });
    } catch (error) {
      console.error('Error flattening JSON:', error);
    }
  };

  const saveJsonFile = async () => {
    if (fileName.trim() === '') {
      alert('Please enter a file name');
      return;
    }
    if (!selectedFile) {
      return alert('No file selected to save');
    }
    if (selectedFile.id) {
      const result = await updateFile(selectedFile);
      if (result.success) {
        setUpdateFileList(!updateFileList);
      } else {
        console.error('Error updating file:', result.error);
      }
    } else {
      const result = await saveNewFile(fileName, 'json', selectedFile.content);
      if (result.success && result.file) {
        setSelectedFile(result.file);
        setUpdateFileList(!updateFileList);
      } else {
        console.error('Error saving file:', result.error);
      }
    }
    setOpenFileNamePopover(false);
  }

  const getSelectedFile = async (value: string) => {
    const fileId = parseInt(value, 10);
    const fileContent = await getFile(fileId);
    if (fileContent.success && fileContent.data) {
      setSelectedFile(fileContent.data);
      setFileName(fileContent.data.name);
      setAnnotations([]);
      setMarkers([]);
    } else {
      console.error("Error fetching file content:", fileContent.error);
    }
  };
  const initializeNewFile = () => {
    setSelectedFile({
      name: '',
      type: 'json',
      content: '',
      createdAt: new Date().toISOString(),
    });
    setFileName('');
  };


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await listFilesByType("json");
        if (files.success && files.files) {
          setFileList(files.files);
        } else {
          console.error('Error fetching files:', files.error);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [updateFileList]);

  const logsFormatJson = () => {
    if (!selectedFile?.content) {
      console.error('No file content found');
      return;
    }
  
    const content = selectedFile.content;
  
    const firstCurly = content.indexOf('{');
    const firstSquare = content.indexOf('[');
  
    if (firstCurly === -1 && firstSquare === -1) {
      console.error('No JSON brackets found');
      return;
    }
  
    let startIndex;
    let closingChar;
  
    if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
      startIndex = firstCurly;
      closingChar = '}';
    } else {
      console.log("a" , firstSquare);
      const nextcar = content.charAt(firstSquare + 1);
      console.log("a" , nextcar);
      if (nextcar !== '{' && nextcar !== '[') {
        startIndex = firstCurly;
        closingChar = '}';
      } else {
        startIndex = firstSquare;
        closingChar = ']';
      }
    }
  
    const endIndex = content.lastIndexOf(closingChar);
  
    if (endIndex === -1 || startIndex >= endIndex) {
      console.error(`Could not find matching closing bracket: ${closingChar}`);
      return;
    }
  
    const cleanedJson = content.slice(startIndex, endIndex + 1);
  
    try {
      console.log('Parsed JSON:', cleanedJson);
      const parsed = JSON.parse(cleanedJson);
      setSelectedFile({ ...selectedFile, content: JSON.stringify(parsed, null, 2) });
      setAnnotations([]);
      setMarkers([]);
    } catch (e) {
      console.error('Parsing failed. The content between brackets is not valid JSON.', e);
    }
  };

  return <div className="flex  w-full h-10 items-center pe-2 border-border border-b">
    <div className="flex items-center">
      <Select value={String(selectedFile.id)} onValueChange={getSelectedFile}>
        <SelectTrigger disabled={fileList.length == 0} className="w-[180px] border-l-0 border-r-2">
          <SelectValue placeholder={fileList.length == 0 ? "No files found" : "Select/Save file"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fileList.length != 0 && fileList.map((file) => (
              <SelectItem key={file.id} value={String(file.id)}>
                {file.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-row-reverse items-center  gap-x-2 w-full justify-start  ">


      <TooltipCustom content={selectedFile.id ? "Delete file" : "Delete JSON"}>
        <MdiDeleteForever className="size-7 cursor-pointer fill-danger hover:scale-110 ease-in-out duration-200" onClick={deleteText} />
      </TooltipCustom>
      <TooltipCustom content="Remove logs and Format JSON">
        <MdiMathLog className='size-7 cursor-pointer fill-success hover:scale-110 ease-in-out duration-200 ' onClick={logsFormatJson} />
      </TooltipCustom>

      <TooltipCustom content="Flatten JSON">
        <CarbonExecutableProgram className='size-7 cursor-pointer fill-success hover:scale-110 ease-in-out duration-200 ' onClick={formatJson} />
      </TooltipCustom>
      <TooltipCustom content="Copy JSON to clipboard">
        <MdiContentCopy className="size-6 cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" onClick={copyToClipboard} />
      </TooltipCustom>

      <Popover open={openFileNamePopover} onOpenChange={setOpenFileNamePopover}>
        <PopoverTrigger className="flex ">
          <TooltipCustom content="Save JSON file">
            <MdiContentSave className="size-7 cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" />
          </TooltipCustom>
        </PopoverTrigger>
        <PopoverContent className="text-text border-border w-80">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Save JSON</h3>
            <p className="text-sm text-muted-foreground">Enter a name for your JSON file:</p>
            <input
              type="text"
              placeholder="File name"
              className="border border-border rounded-md p-2 w-full"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  saveJsonFile();
                }
              }}
            />
            <Button onClick={saveJsonFile}>save</Button>
          </div>
        </PopoverContent>

      </Popover>
      <TooltipCustom content="Add new JSON file">
        <MaterialSymbolsAddNotes className="size-6 cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" onClick={initializeNewFile} />
      </TooltipCustom>
      <TooltipCustom content="Add new JSON file">
        <MdiCodeJson className="size-6 cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" onClick={flatJson} />
      </TooltipCustom>
    </div>
  </div>
}

const TooltipCustom = ({ children, content }: { children: React.ReactNode; content: string; }) => {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-pointer">
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
export default JsonPanel;
