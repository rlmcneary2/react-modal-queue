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


import PropTypes from "prop-types";
import React from "react";
import { DismissModal, ModalButtonProps, ModalFooterButtonHandlerProps, ModalFooterButtonProps, ModalFooterPropsInternal } from "./interfaces";
import ModalButton from "./modal-button";
import { createClassName } from "./util";


/**
 * Defines the title component of a modal.
 */
// tslint:disable-next-line:variable-name
const ModalFooter = (props: ModalFooterPropsInternal): JSX.Element => {
    const { content, dismiss } = props;

    let footer = modalFooterHandlerProps(content);

    if (!footer) {
        footer = modalFooterButtonProps(content, dismiss);
    }

    if (!footer) {
        footer = content as JSX.Element;
    }

    return (<div className={createClassName("footer")}>{footer}</div>);
};

ModalFooter.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.shape({
            onAffirmativeClick: PropTypes.func.isRequired,
            onNegativeClick: PropTypes.func,
            primary: PropTypes.oneOf(["affirmative", "negative"])
        }),
        PropTypes.arrayOf(
            PropTypes.shape({
                className: PropTypes.string,
                content: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.element
                ]).isRequired,
                focus: PropTypes.bool,
                onClick: PropTypes.func
            })
        ),
        PropTypes.element
    ]).isRequired,
    dismiss: PropTypes.func.isRequired
};


export default ModalFooter;


function createButtonClassName(): string {
    return `${createClassName("button")}`;
}

function isButtonProps(props: any): props is ModalFooterButtonProps[] {
    return Array.isArray(props) && (props.length ? props[0].hasOwnProperty("content") : false);
}

function isHandlerProps(props: any): props is ModalFooterButtonHandlerProps {
    return props.hasOwnProperty("onAffirmativeClick");
}

function modalFooterButtonProps(props: any, dismiss: DismissModal): JSX.Element | void {
    if (!isButtonProps(props)) {
        return;
    }

    const buttons = props.map((x, i) => {
        const { className, content: children, focus, onClick } = x;

        const bProps: ModalButtonProps = {
            children,
            className: `${createButtonClassName()}${className ? " " + className : ""}`,
            modalFocus: focus ? true : false,
            onClick: () => onClick ? onClick(x) : dismiss() // If no click handler is provided the dialog will be dismissed when the button is clicked.
        };

        return (
            <ModalButton key={`${i}`} {...bProps} />
        );
    });

    return (<>{buttons}</>);
}

function modalFooterHandlerProps(props: any): JSX.Element | void {
    if (!isHandlerProps(props)) {
        return;
    }

    const affirmative = (
        <button
            className={`${createButtonClassName()} affirmative${props.primary === "affirmative" ? " primary" : ""}`}
            onClick={props.onAffirmativeClick}
        />
    );

    const negative = props.onNegativeClick ? (
        <button
            className={`${createButtonClassName()} negative${props.primary === "negative" ? " primary" : ""}`}
            onClick={props.onAffirmativeClick}
        />
    ) : null;

    return (<>{affirmative}{negative}</>);
}
