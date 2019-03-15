# react-modal-provider

Raise modal dialogs and views from any JavaScript code in a React application. This package is different from other React modal packages because it does **not** require a component in every location that a modal element needs to appear, instead a single ModalProvider is used to display modals. This is especially helpful when a modal element needs to be displayed but the modal may not be related to the current view in the UI; for example a long-running background process encounters a problem and needs to display an error. The react-modal-provider package allows dialogs to be displayed from anywhere within the application.

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

When you need to display a modal element use `raiseModalElement()`. This function takes a single argument: an instance of ModalOptions with information about the modal, and returns a function that can be used to dismiss the modal when it is no longer needed.

```javascript
import { raiseModalElement } from "react-modal-provider";

export default = props => {
    // This function will be passed to a button's onClick prop.
    const raiseModal = () => {
        // The raiseModalElement function returns a function to dismiss the modal.
        const dismissModal = raiseModalElement({
            body: (<input placeholder="Your name..." type="text" />), // The main message in the modal.
            footer: {
                onAffirmativeClick: () => submit(dismissModal),       // Displays a string like "OK".
                onNegativeClick: () => close(dismissModal)            // Displays a string like "Cancel".
            },
            title: "Enter your information",                          // Appears at the top of the modal.
            uid: "MODAL_ENTER_INFORMATION"                            // Uniquely identifies this modal.
        });
    };
    
    // The modal is raised when the user clicks the button.
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

### Title
The title of the modal can be a string that will be placed into an &lt;h1&gt; element or a React Component if the title needs to be customized.

### Body
A modal's body can be created simply by providing a single string or an array of strings. Each string will be surrounded by a &lt;p&gt; element. If more customziation is needed a React Component can be provided for the body.

### Footer
A set of buttons will be displayed in the modal's footer. There are three different options for defining the buttons: one or two buttons can be created by passing handlers, a set of button definitions can be provided in an array, or a React Component can be provided as the footer content.

An example using handlers.
```javascript
const footer = {
    onAffirmativeClick: () => dismissModal(), // This handler is required and a single button will display.
    onNegativeClick: () => dismissModal(),    // Optional. Two buttons will be displayed.
    primary: "affirmative"                    // Optional. If specified the class "primary" will be added to the button.
};
```
```css
.modal-element-button.affirmative:before {
    content: "OK";
}

.modal-element-button.negative:before {
    content: "Cancel";
}

.modal-element-button.primary {
    background-color: red;
}
```

Supplying button definitions as part of an array. There is more flexibility here since the content of the button can be set, a custom class can be set on the button, a button can be focused, and there are no limits on the number of buttons. Here three buttons are created.
```javascript
const footer = [{                        // Button #1
    className: "primary",                // Optional. Will be set on the button.
    content: "Yes",                      // The information to display in the button. A string or React Component are both valid.
    focus: true,                         // Optional. If true the button will be focused.
    onClick: () => submit(dismissModal), // Optional. Invoked when the button is clicked. If not provided clicking the button will dismiss the dialog.
}, {                                     // Button #2
    content: "No",                       // The information to display in the button. A string or React Component are both valid.
}, {                                     // Button #3
    content: "Maybe",                    // The information to display in the button. A string or React Component are both valid.
}];
```


## API
TODO

## Notes
Modal requests are queueud and processed in the order they are recieved.

If the `ModalProp.dismissable` property is set to true then the modal will be dismissed if the user clicks anywhere outside the modal element.

It should be possible to animate the display of the dialog using the React transition package. TBD.
