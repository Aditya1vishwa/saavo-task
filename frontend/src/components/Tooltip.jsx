import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import React from "react";

export default function Tooltip({ children, content, placement = "top" }) {
    const ref = useRef(null);
    const tooltipRef = useRef(null);

    const [visible, setVisible] = useState(false);
    const [style, setStyle] = useState({ opacity: 0 }); // invisible on first render
    const [finalPlacement, setFinalPlacement] = useState(placement);

    useLayoutEffect(() => {
        if (!visible || !tooltipRef.current || !ref.current) return;

        const target = ref.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();
        const spacing = 10;

        const placements = {
            top: {
                top: target.top - tooltip.height - spacing,
                left: target.left + target.width / 2 - tooltip.width / 2,
            },
            bottom: {
                top: target.bottom + spacing,
                left: target.left + target.width / 2 - tooltip.width / 2,
            },
            left: {
                top: target.top + target.height / 2 - tooltip.height / 2,
                left: target.left - tooltip.width - spacing,
            },
            right: {
                top: target.top + target.height / 2 - tooltip.height / 2,
                left: target.right + spacing,
            },
        };

        const viewport = { width: window.innerWidth, height: window.innerHeight };

        const checkFit = (pos) =>
            pos.top >= 0 &&
            pos.left >= 0 &&
            pos.top + tooltip.height <= viewport.height &&
            pos.left + tooltip.width <= viewport.width;

        // User's preference comes first, then the rest
        const order = [
            placement,
            ...["top", "bottom", "right", "left"].filter((p) => p !== placement),
        ];

        let chosen = placement;
        let pos = placements[placement];

        for (const p of order) {
            if (checkFit(placements[p])) {
                chosen = p;
                pos = placements[p];
                break;
            }
        }

        setFinalPlacement(chosen);
        setStyle({
            top: pos.top + window.scrollY,
            left: pos.left + window.scrollX,
            opacity: 1,
        });
    }, [visible, placement]);

    const show = () => {
        console.log("showing tooltip");
        setStyle({ opacity: 0 });
        setVisible(true);
    };

    const hide = () => setVisible(false);

    return (
        <>
            {React.cloneElement(children, {
                ref,
                onMouseEnter: show,
                onMouseLeave: hide,
            })}
            {visible &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className={`pre_tool_tooltip pre_tool_${finalPlacement}`}
                        style={{ ...style, position: "absolute" }}
                    >
                        {content}
                        <div className="pre_tool_arrow" />
                    </div>,
                    document.body
                )}
        </>
    );
}