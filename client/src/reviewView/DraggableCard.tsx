import { useRef } from 'react'
import Draggable from 'react-draggable'

type DraggableCardProps = {
    backgroundColour: string
    defaultPosision: { x: number; y: number }
    content: string
    handleSelected: () => void
}

function DraggableCard({ backgroundColour, defaultPosision, content, handleSelected }: DraggableCardProps) {
    const nodeRef = useRef(null)
    const style = {
        width: '350px',
        fontFamily: 'Courier prime',
        fontWeight: '400',
    }
    return (
        <Draggable nodeRef={nodeRef} defaultPosition={defaultPosision}>
            <div ref={nodeRef} style={style}>
                <div style={{ height: '40px', backgroundColor: backgroundColour }}></div>
                <div
                    style={{
                        whiteSpace: 'pre-wrap',
                        padding: '0px 20px 0px',
                        textIndent: '30px',
                        backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16px, #9198e5 17px, #9198e5 18px)`,
                    }}
                >
                    {content.slice(0, 300)}...
                </div>
                <div style={{ height: '40px', backgroundColor: backgroundColour }} onClick={() => handleSelected()}>
                    EXPAND
                </div>
            </div>
        </Draggable>
    )
}

export default DraggableCard
