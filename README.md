# react-modal-provider

Display modal dialogs and elements in a React application. This package is different from other React modal packages because it does **not** require a component in every location that a modal element needs to appear, instead a single ModalProvider is used to display modals. This is helpful when a modal element needs to be displayed but the modal may not be related to the current view in the UI; for example a long-running background process encounters a problem and needs to display an error. The react-modal-provider package allows dialogs to be displayed from anywhere within the application.

## Install
```
npm i -S react-modal-provider
```

## Usage
Typically you will just wrap your application in the ModalProvider component. Rarely you may need more than one ModalProvider; in such a case pass the single optional prop named `uid` with a string value to uniquely identify each ModalProvider.

```javascript
import { ModalProvider } from "react-modal-provider";

export default = props => {
    return (
        <ModalProvider>
            <App {...props} />
        </ModalProvider>
    );
};
```

When you need to display a modal element use `raiseModalElement()`. This function takes a single argument: an instance of ModalProps with information about the modal, and returns a function that can be used to dismiss the modal when it is no longer needed.

```javascript
import { raiseModalElement } from "react-modal-provider";

export default = props => {
    // Here the modal is raised when the user clicks a button.
    const raiseModal = () => {
        const dismissModal = raiseModalElement({
            body: (<input placeholder="Your name..." type="text" />),
            footer: {
                onAffirmativeClick: () => submit(dismissModal),
                onNegativeClick: () => close(dismissModal)
            },
            title: "Enter your information",
            uid: "MODAL_ENTER_INFORMATION"
        });
    };
    
    return (
        <button onClick={raiseModal}>Enter Information</button>
    );
};
```

The following example is from part of a service that fetches temperature information from a remote location. If the data indicates there is a problem then a warning modal is shown regardless of which app view is currently displayed.

```javascript
import { raiseModalElement } from "react-modal-provider";

// An error modal is raised when the temperature status is out-of-range.
const response = await fetch(`https://example.com/?status=temperature`);

if (response.ok) {
    const data = await response.json();
    if (data.danger) {
        const dismissModal = raiseModalElement({
            body: `Temperature is dangerously high! You should probably do something about this.`,
            footer: { onAffirmativeClick: () => dismissModal },
            title: "Warning!",
            uid: "MODAL_WARNING"
        });
    }
}
```

The modal is composed of several elements "modal-element-overlay", "modal-element-container", and "modal-element" which can be used to position and size the modal. The following CSS will style the modal so that it covers the entire positioned container block and prevents the user from taking any other action until the modal is dismissed.

```css
.modal-element-overlay {
    align-items: center;
    background-color: rgba(50, 50, 50, 0.5);
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
}

.modal-element-overlay.visible {
    visibility: visible;
}

.modal-element-container {
    background-color: white;
    height: 50%;
    width: 70%;
}

.modal-element {
    height: 100%;
    width: 100%;
}
```

## API
TODO

## Notes
Modal requests are queueud and processed in the order they are recieved.

If the `ModalProp.dismissable` property is set to true then the modal will be dismissed if the user clicks anywhere outside the modal element.

It should be possible to animate the display of the dialog using the React transition package. TBD.
