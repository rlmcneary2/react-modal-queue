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


import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { DismissModalElement, ModalElementProps, ModalProps } from "./interfaces";


/** These are modals queued for display, shared by all ModalProvider instances. */
const modals: ModalItem[] = [];
/** This is a collection of modal change listeners, shared by all ModalProvider instances. */
const modalChanges: OnModalChange[] = [];


/** 
 * The ModalElement is reponsible for displaying a modal.
 */
export default (props: ModalElementProps): JSX.Element => {
    const { providerUid } = props;


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

            if (modals.length) {
                const modal = findAndClaimNextModalItem(providerUid);
                if (modal) {
                    setModalElementUid(modal.modalUid);
                    return;
                }
            }

            setModalElementUid(null);
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


    if (!currentModalUid) {
        return (<span dangerouslySetInnerHTML={{__html: "<!-- no modal element -->"}} />);
    }


    return (
        <div className="modal-element">
            <span>current UID: '{currentModalUid}'</span>
        </div>
    );
};


function findAndClaimNextModalItem(providerUid: string): ModalItem {
    const modalItem = findModalItem(providerUid);
    if (!modalItem) {
        return;
    }

    modalItem.claimedUid = providerUid;

    return modalItem;
}

function findModalItem(providerUid: string): ModalItem {
    const index = modals.findIndex(x => (x.claimedUid === providerUid) || (x.providerUid === providerUid) || (!x.claimedUid && !x.providerUid));
    if (index < 0) {
        return;
    }

    return modals[index];
}

/**
 * Cause a modal element to be displayed.
 * @param props The props for the modal element.
 * @returns A function to dismiss the modal element.
 */
function raiseModalElement(props: ModalProps): DismissModalElement {
    const { providerUid, uid: modalUid } = props;

    if (!modalUid) {
        throw Error(`A modal must include a valid uid string property.`);
    }

    if (modals.some(x => x.modalUid === modalUid)) {
        throw Error(`A modal with the uid '${modalUid}' already exists.`);
    }


    const modalItem: Partial<ModalItem> = {
        claimedUid: null,
        modalUid,
        providerUid
    };


    // This function is returned to the caller to dismiss the modal.
    const dismissModalElement: DismissModalElement = () => {
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
    dismissModalElement: DismissModalElement;
    providerUid?: string;
    modalUid: string;
}
