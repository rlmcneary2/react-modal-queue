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


import React, { forwardRef, useEffect, useRef, useState } from "react";
import { DismissModal, ModalElementProps, ModalFooterPropsInternal, ModalOptions, ModalFooterProps } from "./interfaces";
import ModalBody from "./modal-body";
import ModalFooter from "./modal-footer";
import ModalTitle from "./modal-title";
import { classNameRoot, createClassName } from "./util";


/** These are modals queued for display, shared by all ModalProvider instances. */
const modals: ModalItem[] = [];
/** This is a collection of modal change listeners, shared by all ModalProvider instances. */
const modalChanges: OnModalChange[] = [];


/** 
 * The ModalElement is reponsible for displaying a modal.
 */
export default forwardRef((props: ModalElementProps, forwardedRef): JSX.Element => {
    const { mutatedClassName, providerUid } = props;


    // The current modal is tracked in state.
    const [currentModalUid, setModalElementUid] = useState(null);


    // Create functions to display or hide a modal as the queue of modal objects
    // is updated.
    useEffect(() => {
        // Invoked when a new modal item is added to the queue. If a modal is
        // currently being displayed the new item will be ignored until the
        // current modal is cleared.
        const onModalAdd = () => {
            if (currentModalUid) {
                return;
            }

            const modal = findAndClaimNextModalItem(providerUid);
            if (!modal) {
                return;
            }

            setModalElementUid(modal.modalUid);
        };

        // Removes the current modal item. If another item is queued it will be
        // displayed.
        const onModalRemove = (modalUid: string) => {
            if (currentModalUid !== modalUid) {
                return;
            }

            // If there are more modals to display get the next one and
            // immediately display it.
            let nextModalUid: string = null;
            const modal = findAndClaimNextModalItem(providerUid);
            if (modal) {
                nextModalUid = modal.modalUid;
            }

            setModalElementUid(nextModalUid);
        };

        // Add our queue change listeners.
        const changes: OnModalChange = { onModalAdd, onModalRemove };
        modalChanges.push(changes);

        return () => {
            // Remove the queue change listeners.
            const index = modalChanges.findIndex(x => x === changes);
            if (-1 < index) {
                modalChanges.splice(index, 1);
            }
        };
    });


    // If the user clicks outside of the modal element it will be dismissed when
    // ModalProp.dismissable is true.
    //
    // I'm not really crazy about how this works. Review later to see if there
    // is a better alternative.
    const ref = useRef(null);

    const documentClick = (evt: MouseEvent) => {
        if (!currentModalUid || !ref.current || ref.current.contains(evt.target)) {
            return;
        }

        const currentModalItem = findModalItem(providerUid, currentModalUid);
        if (currentModalItem && currentModalItem.options.dismissable) {
            // Let the stack for the click event unwind before dismissing the
            // modal element.
            setTimeout(() => currentModalItem.dismissModalElement());
        }
    };

    useEffect(() => {
        document.addEventListener("click", documentClick, true);
        return () => { document.removeEventListener("click", documentClick, true); };
    });


    let content: JSX.Element = null;
    let visible = "";
    if (currentModalUid) {
        const currentModalItem = findModalItem(providerUid, currentModalUid);
        if (currentModalItem) {
            visible = " visible";

            const { options: modalOptions } = currentModalItem;
            const { body: bodyProps, footer: footerProps, title: titleProps} = modalOptions;

            // Footer
            let nextFooterProps: ModalFooterPropsInternal;
            if (footerProps) {
                nextFooterProps = { ...footerProps, ...{ dismiss: currentModalItem.dismissModalElement } };
            }

            const footer = nextFooterProps ? (<ModalFooter {...nextFooterProps} />) : null;

            // Title
            let title: JSX.Element = null;
            if (titleProps) {
                const mtProps = typeof titleProps === "string" ? { content: titleProps } : titleProps;
                title = titleProps ? (<ModalTitle {...mtProps} />) : null;
            }

            // Body
            const mbProps = typeof bodyProps === "string" || Array.isArray(bodyProps) ? { content: bodyProps } : bodyProps;

            content = (
                <>
                    {title}
                    <ModalBody {...mbProps} />
                    {footer}
                </>
            );
        }
    }


    const overlayClassName = `${createClassName("overlay")}${visible}${mutatedClassName ? " " + mutatedClassName : ""}`;


    return (
        <div className={overlayClassName} ref={forwardedRef as React.Ref<HTMLDivElement>}>
            <div className={createClassName("container") + visible}>
                <div className={classNameRoot + visible} ref={ref}>
                    <span aria-hidden="true" dangerouslySetInnerHTML={{__html: `<!-- providerUid: '${providerUid}', modalUid: '${currentModalUid}' -->`}} style={{ visibility: "collapse" }} />
                    {content}
                </div>
            </div>
        </div>
    );
});


function findAndClaimNextModalItem(providerUid: string, modalUid: string = null): ModalItem {
    const modalItem = findModalItem(providerUid, modalUid);
    if (!modalItem) {
        return;
    }

    modalItem.claimedUid = providerUid;

    return modalItem;
}

function findModalItem(providerUid: string, modalUid: string = null): ModalItem {
    if (!modals.length) {
        return;
    }

    const index: number = modalUid ?
        modals.findIndex(x => x.modalUid === modalUid && (x.claimedUid === providerUid || x.providerUid === providerUid)) :
        modals.findIndex(x => (x.claimedUid === providerUid) || (x.providerUid === providerUid) || (!x.claimedUid && !x.providerUid));

    if (index < 0) {
        return;
    }

    return modals[index];
}

/**
 * Cause a modal element to be displayed.
 * @param options The options for the modal element.
 * @returns A function to dismiss the modal element.
 */
function raiseModalElement(options: ModalOptions): DismissModal {
    const { providerUid, uid: modalUid } = options;

    if (!modalUid) {
        throw Error(`A modal must include a valid uid string property.`);
    }

    if (modals.some(x => x.modalUid === modalUid)) {
        throw Error(`A modal with the uid '${modalUid}' already exists.`);
    }


    const modalItem: Partial<ModalItem> = {
        claimedUid: null,
        modalUid,
        options,
        providerUid
    };


    // This function is returned to the caller to dismiss the modal.
    const dismissModalElement: DismissModal = () => {
        const index = modals.findIndex(x => x === modalItem);
        if (index < 0) {
            return;
        }

        modals.splice(index, 1);

        modalChanges.forEach(x => x.onModalRemove(modalUid));
    };


    modalItem.dismissModalElement = dismissModalElement;

    modals.push(modalItem as ModalItem);

    modalChanges.forEach(x => x.onModalAdd());

    return dismissModalElement;
}


export { raiseModalElement };


type OnModalAdd = () => void;
type OnModalRemove = (modalUid: string) => void;

interface OnModalChange {
    onModalAdd: OnModalAdd;
    onModalRemove: OnModalRemove;
}

interface ModalItem {
    claimedUid: string;
    dismissModalElement: DismissModal;
    options: ModalOptions;
    providerUid?: string;
    modalUid: string;
}
