import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MdiContentCopy } from "@/components/custom/svgs";

type Colors = {
    HEX: string;
    RGB: string;
    RGBA: string;
    HSL: string;
    HSLA: string;
    CMYK: string;
    LAB: string;
}

function ColorConversion({color, palette } : {color: Colors | null; palette: string[]}) {
    return (
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
    )
}
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
export default ColorConversion
