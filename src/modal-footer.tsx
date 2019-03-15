/*
 * Copyright (c) 2019 Richard L. McNeary II
 *
 * MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import React from "react";
import { ModalFooterProps } from "./interfaces";
import { createClassName } from "./util";


/**
 * Defines the title component of a modal element.
 */
export default (props: ModalFooterProps): JSX.Element => {
    const { buttons, content, onNegativeClick, onAffirmativeClick } = props;

    let footerContent: JSX.Element | JSX.Element[];
    if (content) {
        // If custom content provided show that.
        footerContent = content;
    } else if (buttons) {
        // They could also just supply an array of button objects.
        footerContent = buttons.map((x, i) => {
            const { content: children, onClick: clickHandler } = x;
            const buttonProps = {
                children,
                onClick: () => clickHandler(x)
            };

            return (<button key={"" + i} {...buttonProps} />);
        });
    } else if (onNegativeClick || onAffirmativeClick) {
        // Lastly just simple callbacks for common types of buttons.
        footerContent = [];
        if (onAffirmativeClick) {
            footerContent.push((<button className={`${createButtonClassName()} affirmative`} key="affirmative" onClick={onAffirmativeClick} />));
        }

        if (onNegativeClick) {
            footerContent.push((<button className={`${createButtonClassName()} negative`} key="negative" onClick={onNegativeClick} />));
        }
    }

    return (<div className={createClassName("footer")}>{footerContent}</div>);
};


function createButtonClassName(): string {
    return `${createClassName("button")}`;
}
