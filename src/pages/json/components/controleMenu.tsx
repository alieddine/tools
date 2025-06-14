import { ArrowLeft } from 'lucide-react'

function ControleMenu({ isCollapsed, toggleLeftPanel }: { isCollapsed: boolean; toggleLeftPanel: () => void }) {
    return (
        <div className="flex flex-col w-fit h-full justify-start py-3 border-r border-border">

            <button
                onClick={toggleLeftPanel}
                className='active:rotate-180 bg-secondary px-2 py-1 rounded-md hover:bg-primary hover:text-white w-fit h-fit text-text   cursor-pointer' >
                {isCollapsed ? <ArrowLeft className="size-6 cursor-pointer rotate-180" />
                    :
                    <ArrowLeft className="size-6 cursor-pointer" />}
            </button>
        </div>
    )
}

export default ControleMenu
