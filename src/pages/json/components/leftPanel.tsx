// import { Textarea } from '@/components/ui/textarea'
import TextEditor from '@/components/custom/textEditor';
import { Copy, FileJson, Save, Trash2 } from 'lucide-react'
import { useState } from 'react';
import { formatJson } from '../../../helpers/formater.ts'; 
import { GetJsonTheme } from '../../../helpers/theme.ts'; 

function LeftPanel() {
  const [leftJson, setLeftJson] = useState<string>('{\n  "hello": "world"\n}');
  const formatJsonData = async () => {
    const formattedJson = await formatJson(leftJson);
    console.log(formattedJson);
    setLeftJson(formattedJson);
  }
  return (
    <div className="flex flex-col h-[800px] text-text  scale-x-100 min-w-[400px] items-start justify-start">

      <div className="flex flex-row-reverse bg-red-200 w-full h-10 items-center px-2 justify-start gap-x-2 border-border border-b">
        <Trash2 className="size-6 cursor-pointer  text-danger" />
        <Copy className="size-6 cursor-pointer text-text" />
        <Save className="size-6 cursor-pointer text-text" />
        <FileJson className='size-6 cursor-pointer text-text' onClick={formatJsonData}/>
      </div>
      <div className="flex relative flex-1 h-full  w-full">
        <div className=" bg-card w-full h-full text-text">
          <h1 className="text-xl font-bold mb-4">Ace Editor - JSON</h1>
          <TextEditor
            value={leftJson}
            language="json"
            theme={GetJsonTheme()}
            onChange={(val) => setLeftJson(val)}
          />
        </div>

      </div>
    </div>
  )
}

export default LeftPanel
