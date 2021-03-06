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
 * A function that dismisses its modal.
 */
type DismissModal = () => void;

/**
 * Information displayed in the main content of a modal.
 */
interface ModalBodyProps {
    /** The main content can be one or more strings, or a component. Strings will be placed inside <p> elements. */
    content: string | string[] | JSX.Element;
}

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
    onAffirmativeClick: OnClickHandler;

    /** Optional handler for a negative response button. If not supplied the seconds button will not appear. */
    onNegativeClick?: OnClickHandler;

    /** Optional toggle to set the class "primary" on one of the two buttons. */
    primary?: "affirmative" | "negative";
}

/**
 * Props that control the display of a modal.
 */
interface ModalOptions {
    /** The information to display in the modal. */
    body: string | string[] | ModalBodyProps;

    /** If true or a handler is provided the modal can be dismissed by clicking outside of the modal. */
    dismissable?: boolean | OnDismissableModalDismissed;

    /** Information displayed at the bottom of the modal. */
    footer?: OnClickHandler | [OnClickHandler, OnClickHandler] | ModalFooterProps;

    /** The unique identifier of the provider. */
    providerUid?: string;

    /** A title to display at the top of the modal. */
    title?: string | ModalTitleProps;

    /** A unique identifier for this modal. */
    uid: string;
}

/**
 * Props passed to a modal provider.
 */
interface ModalProviderProps {
    /** These are passed as components between opening and closing <ModalProvider> tags. */
    children?: JSX.Element | JSX.Element[];
    /** A unique identifier for this modal provider. */
    uid?: string;
}

/**
 * Data used to display the title of a modal.
 */
interface ModalTitleProps {
    /** The information to display in the title. A string will be displayed as the content of an <h1> element. */
    content: string | JSX.Element;
}


/**
 * Props passed to the internal Modal.
 * @protected
 */
interface ModalProps {
    mutatedClassName?: string;
    providerUid: string;
}

/**
 * Internal props passed to the footer.
 * @protected
 */
interface ModalFooterPropsInternal extends ModalFooterProps {
    dismiss: DismissModal;
}

/**
 * A handler invoked when the user clicks or taps a button.
 */
type OnClickHandler = () => void;

/**
 * A handler invoked when the user has requested that a dismissable modal be dismissed.
 */
type OnDismissableModalDismissed = () => void;


export {
    DismissModal,
    ModalBodyProps,
    ModalButtonProps,
    ModalProps,
    ModalFooterButtonHandlerProps,
    ModalFooterButtonProps,
    ModalFooterProps,
    ModalFooterPropsInternal,
    ModalOptions,
    ModalProviderProps,
    ModalTitleProps,
    OnClickHandler,
    OnDismissableModalDismissed
};
