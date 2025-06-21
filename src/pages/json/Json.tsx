import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import JsonPanel from "./components/jsonPanel"
import ControleMenu from "./components/controleMenu"
import { useEffect, useRef, useState } from "react"
import type { ImperativePanelHandle } from "react-resizable-panels"
 



function Json() {
    const leftPanelRef = useRef<ImperativePanelHandle>(null)
    const rightPanelRef = useRef<ImperativePanelHandle>(null)
    // false means left panel is closed and right panel is open
    // null means both panels are open
    // true means right panel is closed and left panel is open
    const [isCollapsed, setIsCollapsed] = useState<boolean | null>(true)
 
    const toggleToLeft = () => {
        if (isCollapsed) {
            setIsCollapsed(null)
            leftPanelRef.current?.resize(50)
            rightPanelRef.current?.resize(50)
        } else if (isCollapsed === null) {
            setIsCollapsed(false)
            leftPanelRef.current?.resize(0)
            rightPanelRef.current?.resize(100)
        }
    }
    const toggleToRight = () => {
        if (isCollapsed === false) {
            setIsCollapsed(null)
            rightPanelRef.current?.resize(50)
            leftPanelRef.current?.resize(50)
        } else if (isCollapsed === null) {
            setIsCollapsed(true)
            rightPanelRef.current?.resize(0)
            leftPanelRef.current?.resize(100)
        }
    }
    const [leftPanelSize, setLeftPanelSize] = useState(100);
    const [rightPanelSize, setRightPanelSize] = useState(0);

    useEffect(() => {
        if (leftPanelSize !== 0 && rightPanelSize !== 0) {
            setIsCollapsed(null);
        }
    }, [leftPanelSize, rightPanelSize]);
    return (
        <div className="h-screen px-3 py-3 bg-background">
            <h1 className="text-2xl text-text font-bold mb-4">JSON Data formatter</h1>


            <ResizablePanelGroup direction="horizontal" className="max-h-[90%] w-full rounded-md border-2 border-border md:min-w-[450px]">
                <ResizablePanel className={` transition-all  ${isCollapsed === false ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'} transform `} ref={leftPanelRef} onResize={ (size) => setLeftPanelSize(size)} defaultSize={100}>
                    <JsonPanel/>
                </ResizablePanel>
                <ResizableHandle className="h-full" />

                <ControleMenu isCollapsed={isCollapsed} toggleToLeft={toggleToLeft}  toggleToRight={toggleToRight}/>

                <ResizablePanel className={` transition-all  ${isCollapsed === true ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'} transform `} ref={rightPanelRef}  onResize={ (size) => setRightPanelSize(size)}  defaultSize={0}>
                    <JsonPanel/>
                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default Json
