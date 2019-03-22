# react-modal-provider

Raise modal dialogs and views from any JavaScript code in a React application. **This package is different from other React modal packages because it does _not_ require a component in every location that a modal element needs to appear, instead a single ModalProvider is used to display modals.** This is especially helpful when a modal element needs to be displayed but the modal may not be related to the current view in the UI; for example a long-running background process encounters a problem and needs to display an error.

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
    // The function raiseModal() will be passed to a button's onClick prop.
    const raiseModal = () => {
        // The raiseModalElement() function returns a function to dismiss the modal.
        const dismissModal = raiseModalElement({
            body: (<input placeholder="Your name..." type="text" />), // The main message in the modal.
            footer: {
                onAffirmativeClick: () => submit(dismissModal),       // Displays a string like "OK".
                onNegativeClick: () => close(dismissModal)            // Displays a string like "Cancel".
            },
            title: "Enter your name",                                 // Appears at the top of the modal.
            uid: "MODAL_ENTER_NAME"                                   // Uniquely identifies this modal.
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
            body: "Temperature is dangerously high! You should probably do something about this.",
            footer: { onAffirmativeClick: () => dismissModal },
            title: "Warning!",
            uid: "MODAL_WARNING"
        });
    }
}
```

The modal is composed of several elements in the DOM: `modal-element-overlay`, `modal-element-container`, and `modal-element` which can be used to position and size the modal. The following CSS will style the modal so that it covers the entire positioned container block and prevents the user from taking any other action until the modal is dismissed.

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
A modal's body can be created simply by providing a single string or an array of strings. Each string will be surrounded by a &lt;p&gt; element. If more customization is needed a React Component can be provided for the body.

### Footer
A set of buttons will be displayed in the modal's footer. There are three different options for defining the buttons: one or two buttons can be created by passing handlers, a set of button definitions can be provided in an array, or a React Component can be provided as the footer content.

An example using handler functions.
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

It's also possible to supply button definitions in an array. There is more flexibility here since the content of the button can be set, a custom class can be set on the button, a button can be focused, and there are no limits on the number of buttons. Here three buttons are created.
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
## Notes
Modal requests are queued and processed in the order they are received.

Showing and hiding the modal can be animated using the [react-transition-group](http://reactcommunity.org/react-transition-group/) package. The transition classes will be set on the `modal-element-overlay` element.

If [ModalOptions](#modaloptions).dismissable is set to true then the modal will be dismissed if the user clicks anywhere outside the modal.

## API

### \<ModalProvider\>
The ModalProvider allows an application to display modals. This component is placed at the root of an application and is reponsible for controlling modals.

|Prop|Type|Description|
|---|---|---|
|\[**uid**\]|string|_Optional_ a unique identifier for this modal provider that can be used to direct a modal request to a specific provider instance.|
|\[**children**\]|Element \| Element[]|_Optional_ components between ModalProvider opening and closing tags.|

### dismissModal
A function returned from [raiseModalElement](#raisemodalelement). When invoked it dismisses the raised modal. Takes no parameters and returns void.

### raiseModalElement
Invoke this function to display a modal.

|Parameter|Type|Description|
|---|---|---|
|**options**|[ModalOptions](#modaloptions)|The options for the modal.|

#### Returns
[DismissModal](#dismissmodal) A function to dismiss the modal that was raised.

### ModalBodyProps
Information displayed in the main content of a modal.

|Property|Type|Description|
|---|---|---|
|**content**|string \| string[] \| JSX.Element|The main content can be one or more strings, or a component. Strings will be placed inside \<p\> elements.|

### ModalFooterProps
Props to configure the bottom portion of the modal.

|Property|Type|Description|
|---|---|---|
|**content**|[ModalFooterButtonHandlerProps](#modalfooterbuttonhandlerprops) \| [ModalFooterButtonProps](#modalfooterbuttonprops)[] \| JSX.Element|The contents of the footer.|

### ModalFooterButtonProps
Allows simple and semi-custom buttons to be created in the footer.

|Property|Type|Description|
|---|---|---|
|\[**className**\]|string|_Optional_ class name that will be set on the button.
|**content**|string \| JSX.Element|The information that will be displayed as the contents of a button element.|
|\[**focus** = false\]|boolean|_Optional_ if true the button will be focused. This should be true for only one button in the array.|
|\[**onClick**\]|(props: [ModalFooterButtonProps](#modalfooterbuttonprops)) => void|_Optional_ handler that will be invoked when the button is clicked.

### ModalFooterButtonHandlerProps
The simplest way to create a footer with one or two buttons, simply add handlers for the corresponding buttons.

|Property|Type|Description|
|---|---|---|
|**onAffirmativeClick**|() => void|Invoked when the affirmative button is clicked.|
|\[**onNegativeClick**\]|() => void|_Optional_ handler for a negative response button. If not supplied the button will not appear.|
|\[**primary**\]|"affirmative" \| "negative"|_Optional_ toggle to set the class "primary" on one of the two buttons.|

### ModalOptions
Object that controls the display of a modal.

|Property|Type|Description|
|---|---|---|
|**body**|[ModalBodyProps](#modalbodyprops)|The information to display in the main part of the modal.|
|\[**dismissable** = false\]|boolean|_Optional_ if true the modal can be dismissed by clicking outside of the modal.|
|\[**footer**\]|[ModalFooterProps](#modalfooterprops)|_Optional_ information displayed at the bottom of the modal.|
|\[**providerUid**\]|string|_Optional_ unique identifier of the provider.|
|\[**title**\]|[ModalTitleProps](#modaltitleprops)|_Optional_ title to display at the top of the modal.|
|**uid**|string|A unique identifier for this modal. Only one modal with this unique identifier can be queued at a time.|

### ModalTitleProps
Data used to display the title of a modal.

|Property|Type|Description|
|---|---|---|
|**content**|string \| JSX.Element|The information to display in the title. A string will be displayed as the content of an \<h1\> element.|
