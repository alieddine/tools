import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import LeftPanelRef from "./components/leftPanel"
import ControleMenu from "./components/controleMenu"
import { useRef, useState } from "react"
import type { ImperativePanelHandle } from "react-resizable-panels"




function Json() {
    const leftPanelRef = useRef<ImperativePanelHandle>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
 
    const toggleLeftPanel = () => {
        if (isCollapsed) {
            leftPanelRef.current?.resize(50)
        } else {
            leftPanelRef.current?.resize(0)
        }
        setIsCollapsed(!isCollapsed)
    }
    return (
        <div className="h-screen px-3 py-3 ">
            <h1 className="text-2xl text-text font-bold mb-4">JSON Data formatter</h1>


            <ResizablePanelGroup direction="horizontal" className="max-h-[90%] w-full rounded-md border-2 border-border md:min-w-[450px]">
                <ResizablePanel className={` transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'} transform `} ref={leftPanelRef} defaultSize={25}>
                    <LeftPanelRef/>
                </ResizablePanel>
                <ResizableHandle className="h-full" />

                <ControleMenu isCollapsed={isCollapsed} toggleLeftPanel={toggleLeftPanel} />

                <ResizablePanel className="h-full" defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default Json
