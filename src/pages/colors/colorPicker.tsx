import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import ColorThief from "color-thief-browser";
import { ImageUp } from "lucide-react";
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
import { hexToColorVariants } from "@/helpers/colors";
import ColorConversion from "@/pages/colors/colorConversion";

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

        // ColorThief.getPalette(img, 6).then((colors: number[][]) => {
        //     const hexColors = colors.map(([r, g, b]) =>
        //         `#${r.toString(16).padStart(2, "0")}${g
        //             .toString(16)
        //             .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
        //     );
        //     setPalette(hexColors);
        // });
    };
    
    useEffect(() => {
        const img = imageRef.current;
        if (!img) return;
    
        const handlePalette = async () => {
            try {
                const palette = await ColorThief.getPalette(img, 6);
                const hexColors = palette.map(([r, g, b]) =>
                    `#${r.toString(16).padStart(2, "0")}${g
                        .toString(16)
                        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
                );
                setPalette(hexColors);
            } catch (err) {
                console.error("Failed to get palette", err);
            }
        };
    
        if (img.complete) {
            handlePalette();
        } else {
            img.addEventListener("load", handlePalette);
            return () => img.removeEventListener("load", handlePalette);
        }
    }, []);
    

    console.log("palette", palette);
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
            <ColorConversion color={color} palette={palette} /> 
        </div>
    );
}




