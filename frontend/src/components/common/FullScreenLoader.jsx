import React from 'react';

const FullScreenLoader = ({ headingText, paragraphText }) => {
    return (
        <div className="pr_fullscreen_loader_overlay">
            <span className="pr_fullscreen_loader_spinner"></span>
            {headingText && <h3 className="pr_fullscreen_loader_heading">{headingText}</h3>}
            {paragraphText && <p className="pr_fullscreen_loader_text">{paragraphText}</p>}
        </div>
    );
};

export default FullScreenLoader;
