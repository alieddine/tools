import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUp } from 'lucide-react';
import { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';


function Ocr() {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [picture, setPicture] = useState<string>("");
    const [text, setText] = useState<string>("test");

    const recognizeText = async ( ) => {
        const worker = await createWorker('eng'); 
        const { data } = await worker.recognize( picture);
        setText(data.text);
        await worker.terminate();
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragActive(false);

        const file = event.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith("image/")) {
            console.log("Error: The dropped file is not an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setPicture(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files?.[0];
            if (!file.type.startsWith("image/")) {
                console.log("Error: The dropped file is not an image.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => setPicture(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    return (
        <div className="flex flex-col text-text items-center justify-start h-screen bg-background">
            <Input className="hidden" ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
            <div className="flex w-full justify-around items-center">
            <div
                onClick={handleDivClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ width: "356px", height: "256px" }}
                className={`border-2  border-dashed p-10 rounded-lg flex flex-col gap-1  items-center cursor-pointer 
                    ${dragActive ? "border-blue-400 bg-white/10" : "border-border"}`}
            >
                <ImageUp className="h-20 w-20 text-text" />
                <span className="text-sm font-medium text-text-secondary">
                    Drag and drop an image or click to browse
                </span>
                <span className="text-xs text-text-secondary">
                    Only image files are accepted
                </span>
            </div>

            <img
                src={picture}
                alt="preview"
                width="556"
                height="556"
                className="border shadow-custom border-border rounded-md  "
                crossOrigin="anonymous"
            />
            </div>
            <Button className="mt-4" onClick={()=>{  recognizeText()}} disabled={!picture}>
                Recognize Text
            </Button>
            <div className="mt-4 w-full max-w-2xl p-4 bg-card rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-text">Recognized Text</h2>
                <p className="mt-2 text-text-secondary">{text}</p>

            </div>
        </div>
    )
}

export default Ocr
