import { useEffect } from "react";
import { createPortal } from "react-dom";
import svg from "../assets/svg";
import "../../styles/Modal.css";

const Modal = ({ isOpen, onClose, title, width = 720, children, footer, className = "", isCloseBtn = true }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (event) => {
            if (event.key === "Escape" && isCloseBtn) onClose?.();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose, isCloseBtn]);

    if (!isOpen) return null;

    return createPortal(
        <div className="pr_modal_overlay" role="dialog" aria-modal="true">
            <div className="pr_modal_backdrop" onClick={isCloseBtn ? onClose : undefined} />
            <div className={`pr_modal ${className}`} style={{ maxWidth: width }}>
                <div className="pr_modal_header">
                    <h3>{title}</h3>
                    {isCloseBtn && (
                        <button type="button" className="pr_modal_close" onClick={onClose}>
                            {svg.close({})}
                        </button>
                    )}
                </div>
                <div className="pr_modal_body">{children}</div>
                {footer && <div className="pr_modal_footer">{footer}</div>}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
