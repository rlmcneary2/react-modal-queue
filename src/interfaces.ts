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


/** 
 * A function that dismisses its modal element.
 */
type DismissModal = () => void;

/**
 * Information displayed in the content of a modal element.
 */
interface ModalBodyProps {
    /** The main content can be one or more strings, or one or more custom elements. Strings will be placed inside <p> elements. */
    content: string | string[] | JSX.Element;
}

// interface ModalButtonProps extends React.DOMAttributes<any> {
//     className?: string;
//     focus?: boolean;
// }
interface ModalButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    modalFocus?: boolean;
}

/**
 * Props to configure the footer of the modal.
 */
interface ModalFooterProps {
    /** Define the display of the footer. */
    content: ModalFooterButtonHandlerProps | ModalFooterButtonProps[] | JSX.Element;
}

/**
 * Allows simple and semi-custom buttons to be created in the footer.
 */
interface ModalFooterButtonProps {
    /** Optional class name that will be set on the button. */
    className?: string;

    /** The information that will be displayed as the contents of a button element. */
    content: string | JSX.Element;

    /** If true the button will be focused. This should be true for only one button in the array. */
    focus?: boolean;

    /** Optional handler that will be invoked when the button is clicked. */
    onClick?: (props: ModalFooterButtonProps) => void;
}

/**
 * Create a footer with one or two buttons.
 */
interface ModalFooterButtonHandlerProps {
    /** Invoked when the affirmative button is clicked. */
    onAffirmativeClick: () => void;

    /** Optional handler for a negative response button. If not supplied the seconds button will not appear. */
    onNegativeClick?: () => void;

    /** Optional toggle to set the class "primary" on one of the two buttons. */
    primary?: "affirmative" | "negative";
}

/**
 * Props that control the display of a modal.
 */
interface ModalOptions {
    /** The information to display in the modal element. */
    body: ModalBodyProps;

    /** If true the modal can be dismissed by clicking outside of the modal element. */
    dismissable?: boolean;

    /** Information displayed at the bottom of the modal element. */
    footer?: ModalFooterProps;

    /** The unique identifier of the provider. */
    providerUid?: string;

    // A title to display at the top of the modal element.
    title?: ModalTitleProps;

    /** A unique identifier for this modal. */
    uid: string;
}

/**
 * Props passed to a modal provider.
 */
interface ModalProviderProps {
    /** These are passed as elements between opening and closing <ModalProvider> tags. */
    children?: JSX.Element | JSX.Element[];
    /** A unique identifier for this modal provider. */
    uid?: string;
}

/**
 * Data used to display the title of a modal element.
 */
interface ModalTitleProps {
    /** The information to display in the title. A string will be displayed as the content of an <h1> element. */
    content: string | JSX.Element;
}


/**
 * Props passed to the internal ModalElement.
 * @protected
 */
interface ModalElementProps {
    providerUid: string;
}

/**
 * Internal props passed to the footer.
 * @protected
 */
interface ModalFooterPropsInternal extends ModalFooterProps {
    dismiss: DismissModal;
}


export {
    DismissModal,
    ModalBodyProps,
    ModalButtonProps,
    ModalElementProps,
    ModalFooterButtonHandlerProps,
    ModalFooterButtonProps,
    ModalFooterProps,
    ModalFooterPropsInternal,
    ModalOptions,
    ModalProviderProps,
    ModalTitleProps
};
