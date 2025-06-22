import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import ColorThief from "color-thief-browser";
import { ImageUp } from "lucide-react";
import { MdiContentCopy } from "@/components/custom/svgs";
import  "../../index.css"
type Colors = {
    HEX: string;
    RGB: string;
    RGBA: string;
    HSL: string;
    HSLA: string;
    CMYK: string;
    LAB: string;
}

export default function ColorPicker() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [picture, setPicture] = useState<string>("");

    const [color, setColor] = useState<Colors | null>(null);
    const [palette, setPalette] = useState<string[]>([]);
    const containerWidth = 556;
    const containerHeight = 556;

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



    const drawImage = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;


        canvas.width = containerWidth;
        canvas.height = containerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;

        if (imgAspect > canvasAspect) {
            drawHeight = canvas.width / imgAspect;
        } else {
            drawWidth = canvas.height * imgAspect;
        }

        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        ColorThief.getPalette(img, 6).then((colors: number[][]) => {
            const hexColors = colors.map(([r, g, b]) =>
                `#${r.toString(16).padStart(2, "0")}${g
                    .toString(16)
                    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
            );
            setPalette(hexColors);
        });
    };


    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
            .toString(16)
            .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
        setColor(hexToColorVariants(hex));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;

        if (!canvas || !zoomCanvas) return;

        const ctx = canvas.getContext("2d");
        const zoomCtx = zoomCanvas.getContext("2d");
        if (!ctx || !zoomCtx) {
            zoomCanvas.style.display = "block";
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        const zoomSize = 11;
        const scale = 12;

        const half = Math.floor(zoomSize / 2);


        const imageData = ctx.getImageData(
            x - zoomSize / 2,
            y - zoomSize / 2,
            zoomSize,
            zoomSize
        );
        zoomCanvas.width = zoomSize * scale;
        zoomCanvas.height = zoomSize * scale;
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
        zoomCtx.putImageData(imageData, 0, 0);
        zoomCtx.drawImage(
            zoomCanvas,
            0,
            0,
            zoomSize,
            zoomSize,
            0,
            0,
            zoomSize * scale,
            zoomSize * scale
        );

        zoomCtx.strokeStyle = "rgba(255, 255, 255,0.5)";
        for (let i = 0; i <= zoomSize; i++) {
            zoomCtx.beginPath();
            zoomCtx.moveTo(i * scale, 0);
            zoomCtx.lineTo(i * scale, zoomSize * scale);
            zoomCtx.stroke();

            zoomCtx.beginPath();
            zoomCtx.moveTo(0, i * scale);
            zoomCtx.lineTo(zoomSize * scale, i * scale);
            zoomCtx.stroke();
        }

        zoomCtx.strokeStyle = "red";
        zoomCtx.lineWidth = 1;
        zoomCtx.strokeRect(
            half * scale,
            half * scale,
            scale,
            scale
        );

        zoomCanvas.style.display = "block";
        zoomCanvas.style.left = `${e.clientX + 10}px`;
        zoomCanvas.style.top = `${e.clientY - 50}px`;

    };



    useEffect(() => {
        const handleMouseOut = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            const zoomCanvas = zoomCanvasRef.current;
            if (!canvas || !zoomCanvas) return;

            const rect = canvas.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                zoomCanvas.style.display = "none";
            }
        };

        window.addEventListener("mousemove", handleMouseOut);
        return () => {
            window.removeEventListener("mousemove", handleMouseOut);
        };
    }, []);
    return (
        <div className="relative p-4 w-full flex items-center gap-4 ">
            <div className="w-1/2 flex flex-col justify-center items-center gap-4">
                <Input className="hidden" ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
                <div
                    onClick={handleDivClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{width:containerWidth}}
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
                {picture != "" && (
                    <>
                        <img
                            ref={imageRef}
                            src={picture}
                            alt="preview"
                            onLoad={drawImage}
                            className="hidden"
                            crossOrigin="anonymous"
                        />
                        <div style={{ width: containerWidth, height: containerHeight }} className=" relative">

                            <canvas
                                ref={canvasRef}
                                width={containerWidth}
                                height={containerHeight}
                                onClick={handleCanvasClick}
                                onMouseMove={handleMouseMove}
                                className="border shadow-custom border-border absolute inset-0  rounded-md cursor-crosshair     "
                            />
                        </div>

                        <canvas
                            className="absolute rounded-[75px] border-2 border-border bg-background"
                            ref={zoomCanvasRef}
                            style={{
                                clipPath: "circle(50%)",
                                pointerEvents: "none",
                                display: "none",
                                position: "absolute",
                            }}
                        />
                    </>
                )}


            </div>
            <div className="w-px h-[90%] bg-border"></div>
            <div className="w-1/2 flex flex-col justify-center items-center p-3 h-full">
                {color && (
                    <div className="flex flex-col bg-navbar-background shadow-custom rounded-lg w-full border border-border py-2 px-5 items-center gap-2">
                        <div className="flex gap-5 items-center">
                            <div className="w-16 h-10  rounded-md border" style={{ backgroundColor: color.HEX }} />
                            <div className="text-text">Selected Color</div>
                        </div>
                        <hr className=" border-border w-[97%]  " />
                        <ColorsTypes color={color} />
                    </div>
                )}

                {palette.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        {palette.map((col, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: col }}
                                title={col}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { hexToColorVariants } from "@/helpers/colors";

const ColorsTypes = ({ color }: { color: Colors }) => {
    const colorList = [
        {name : "HEX", color:color.HEX},
        {name : "RGB", color:color.RGB},
        {name : "RGBA", color:color.RGBA},
        {name : "HSL", color:color.HSL},
        {name : "HSLA", color:color.HSLA},
        {name : "CMYK", color:color.CMYK},
        {name : "LAB", color:color.LAB}
    ]
    return (
        <div className="grid grid-cols-2 gap-5 my-5 w-full">
            {colorList.map((item, key) => (
                <ColorType key={key} name={item.name} color={item.color}/> 
            ))}
        </div>
    );
}

const ColorType = ({name ,color}: {name:string; color:string;})=>{
    const copyColorToClipboard = () => {
        navigator.clipboard.writeText(color)
            .then(() => { })
            .catch(err => {
                console.error('Failed to copy JSON: ', err);
            });
    }
    return (
        <div className="flex text-text hover:border-primary ease-in-out duration-200 hover:bg-card-hover h-13 items-center gap-2 justify-start bg-card  border border-border shadow py-1 group px-3 rounded-xl w-full">
            <div className="w-13">{name}</div>
            <div className="h-full w-px bg-border group-hover:bg-primary ease-in-out duration-200 "></div>
            <div className="flex justify-between w-full">
                <span className="font-mono  ">{color}</span>
                <TooltipCustom content={`Copy ${name} color`}>
                    <MdiContentCopy className="size-6 hover:fill-primary cursor-pointer fill-text hover:scale-110 ease-in-out duration-200" onClick={copyColorToClipboard} />
                </TooltipCustom>
            </div>
        </div>
    );
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
