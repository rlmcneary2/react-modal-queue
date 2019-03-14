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


/** 
 * A function that dismisses its modal element.
 */
type DismissModalElement = () => void;

/**
 * Data used to display the main content of a modal element.
 */
interface ModalBodyProps {
    /** The main content can be one or more strings, or one or more custom elements. Strings will be placed inside <p> elements. */
    content: string | string[] | JSX.Element | JSX.Element[];
}

/**
 * The internal interface for props passed to the internal ModalElement.
 */
interface ModalElementProps {
    providerUid: string;
}

/**
 * Props that control the display of a modal.
 */
interface ModalProps {
    /** The information to display in the modal element. */
    body: ModalBodyProps;

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
    content: string | JSX.Element | JSX.Element[];
}


export {
    DismissModalElement,
    ModalBodyProps,
    ModalElementProps,
    ModalProps,
    ModalProviderProps,
    ModalTitleProps
};
