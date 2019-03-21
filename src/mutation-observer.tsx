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


import React, { useEffect, useRef } from "react";


/**
 * Some React components (like react-transition-group) have not incorporated
 * forwardRef yet. They find their first child and apply CSS class names to it.
 * To work-around that problem this component monitors the DOM for changes to
 * its div element class attribute and passes those back up to its parent.
 */
export default (props: MutationObserverProps): JSX.Element => {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "class") {
                    props.onClassNameChange(ref.current.className);
                    break;
                }
            }
        });

        observer.observe(ref.current as Node, { attributes: true });

        return () => {
            observer.disconnect();
        };
    });

    // The wrapping div is a "guard" element that willl detect changes to its
    // class attribute. When those changes happen the onClassNameChange() prop
    // is invoked.
    return (
        <div ref={ref}>
            {props.children}
        </div>
    );
};

interface MutationObserverProps {
    children?: any;
    onClassNameChange: (className: string) => void;
}


export { MutationObserverProps };
