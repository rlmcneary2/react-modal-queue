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
import { ModalTitleProps } from "./interfaces";
import { createClassName } from "./util";


/**
 * Defines the title component of a modal element.
 */
// tslint:disable-next-line:variable-name
const ModalTitle = (props: ModalTitleProps): JSX.Element => {
    const { content } = props;
    return (<div className={createClassName("title")}>{typeof content === "string" ? (<h1>{content}</h1>) : content}</div>);
};

ModalTitle.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired
};


export default ModalTitle;
