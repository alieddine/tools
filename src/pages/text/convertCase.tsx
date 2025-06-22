import { MdiContentCopy } from "@/components/custom/svgs";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";

function ConvertCase() {
    const [text, setText] = useState("");

    const copyToClipboard = () => {

        navigator.clipboard.writeText(text)
            .then(() => { })
            .catch(err => {
                console.error('Failed to copy JSON: ', err);
            });
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-background">
            <h1 className="text-4xl font-bold text-text">Convert Case Tool</h1>
            <p className="mt-4 text-lg text-text-secondary">This tool will help you convert text to different cases.</p>
            <div className="mt-8 w-[70%]  p-6 bg-card rounded-lg shadow-md">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 p-4 text-text border rounded-lg outline-none "
                    placeholder="Enter your text here..."
                ></Textarea>
                <div className="mt-4 flex gap-4">
                    <Button onClick={() => { setText(text.toLocaleUpperCase()) }} className="px-4 py-2 bg-popover ">Convert to Uppercase</Button>
                    <Button onClick={() => { setText(text.toLocaleLowerCase()) }} className="px-4 py-2 bg-popover ">Convert to Lowercase</Button>
                    <Button onClick={() => { setText(text.replace(/\b\w/g, char => char.toUpperCase())) }} className="px-4 py-2 bg-popover ">Convert to Title Case</Button>
                    <Button onClick={() => { setText(text.replace(/(^\w{1})|(\s+\w{1})/g, char => char.toUpperCase())) }} className="px-4 py-2 bg-popover ">Convert to Sentence Case</Button>
                    <TooltipCustom content="Copy JSON to clipboard">
                        <MdiContentCopy className="size-6 cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" onClick={copyToClipboard} />
                    </TooltipCustom>
                </div>
            </div>
        </div>
    )
}

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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

export default ConvertCase
