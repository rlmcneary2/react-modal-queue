# react-modal-queue

Raise modal dialogs and views from any JavaScript code in a React application. **This package is different from other React modal packages because it does _not_ require a component in every location that a modal needs to appear, instead a single ModalProvider is used to display modals.**

## Advantages
- Does not require a React component in every location where a modal needs to appear, instead a single ModalProvider at the base of the application is used to display modals.
- Triggering the display of a modal can be done from any code in the application and is not restricted to React components; for example a long-running background process encounters a problem and needs to display an error.
- A single DOM location for the appearance of modals simplifies styling and animating modals.

## Examples
A basic JavaScript and CSS implementation to display the modal above the page contents. [Demonstrates using `ModalProvider` and `raiseModalElement`](https://codepen.io/rlmcneary2/pen/LaMJVz).

A more complex example that demonstrates [animating the appearance and disappearance of the modal](https://codepen.io/rlmcneary2/pen/LaMJVz) using [react-transition-group](http://reactcommunity.org/react-transition-group/) and CSS.

## Install
```
npm i -S react-modal-queue
```

## Use
Typically you will just wrap your application in the ModalProvider component.

```javascript
import { ModalProvider } from "react-modal-queue";

export default = props => {
    return (
        <ModalProvider>
            <App {...props} />
        </ModalProvider>
    );
};
```

When you need to display a modal use `raiseModalElement()`. This function takes a single argument: an instance of ModalOptions with information about the modal, and returns a function that can be used to dismiss the modal when it is no longer needed.

```javascript
import { raiseModalElement } from "react-modal-queue";

export default = props => {

    const raiseModal = () => {
        const dismissModal = raiseModalElement({
            body: "You raised a modal!",
            footer: () => dismissModal(),
            title: "Modal Title",
            uid: "MODAL_EXAMPLE"
        });
    };
    
    return (
        <button onClick={raiseModal}>Display Modal</button>
    );

};
```

### Title
The title content can be a string that will be placed into an \<h1\> element or a React Component if the title needs to be customized.

### Body
A modal's body content can be created simply by providing a single string or an array of strings. Each string will be surrounded by a \<p\> element. If more customization is needed a React Component can be provided for the body.

### Footer
A set of buttons can be displayed in the modal's footer. There are three different options for defining the footer: one or two buttons can be displayed by passing handler functions, a set of button definitions can be provided in an array, or a React Component can be provided as the footer content.

## Style and Appearance
The ModalProvider adds and removes elements from the document's DOM to display a modal. The appearance of those elements as a "modal UI element" depends entirely on the CSS that is applied to them. When a modal is created it will look like this in the DOM (the contents of title, body, and footer will vary depending on the props set) and will appear after the contents of ModalProvider.
```html
<div class="modal-element-overlay visible">
    <div class="modal-element-container visible">
        <div class="modal-element visible">
            <span aria-hidden="true" style="visibility: collapse;"><!-- providerUid: '1553865290781', modalUid: 'TEST_MODAL_3' --></span>
            <div class="modal-element-title">
                <h1>Modal Title</h1>
            </div>
            <div class="modal-element-body">
                <p>This is the modal body.</p>
            </div>
            <div class="modal-element-footer">
                <button class="modal-element-button affirmative"></button>
            </div>
        </div>
    </div>
</div>
```
For these elements to appear as a modal - above the page contents, and in normal use as only dismissable by clicking a button - CSS must be applied. There is [an example that illustrates the modal styled with the behavior described](https://codepen.io/rlmcneary2/pen/LaMJVz).

## Notes
Modal requests are queued and processed in the order they are received. Only one modal is displayed at a time.

Showing and hiding the modal can be animated using the [react-transition-group](http://reactcommunity.org/react-transition-group/) package. Wrap the <ModalProvider> component in a transition component and the transition classes will be set on the `modal-element-overlay` element.

If [ModalOptions](#modaloptions).dismissable is set to true or to an [OnDismissableModalDismissed](#ondismissablemodaldismissed) function then the modal can be dismissed if the user clicks anywhere outside the modal.

## API

<h3 style="margin: 40px 0 5px 0;">&lt;ModalProvider&gt;</h3>
The ModalProvider allows an application to display modals. This component is placed at the root of an application and is reponsible for controlling modals.

|Prop|Type|Description|
|---|---|---|
|\[**uid**\]|string|_Optional_ unique identifier for this modal provider that can be used to direct a modal request to a specific provider instance.|
|\[**children**\]|Element \| Element[]|_Optional_ components between ModalProvider opening and closing tags.|

<h3 style="margin: 40px 0 5px 0;">dismissModal</h3>
A function returned from [raiseModalElement](#raisemodalelement). When invoked it dismisses the raised modal. Takes no parameters and returns void.

<h3 style="margin: 40px 0 5px 0;">raiseModalElement</h3>
Invoke this function to display a modal.

|Parameter|Type|Description|
|---|---|---|
|**options**|[ModalOptions](#modaloptions)|The options for the modal.|

#### Returns
[DismissModal](#dismissmodal) A function to dismiss the modal that was raised.

<h3 style="margin: 40px 0 5px 0;">ModalBodyProps</h3>
Information displayed in the main content of a modal.

|Property|Type|Description|
|---|---|---|
|**content**|string \| string[] \| JSX.Element|The main content can be one or more strings, or a component. Strings will be placed inside \<p\> elements.|

<h3 style="margin: 40px 0 5px 0;">ModalFooterProps</h3>
Props to configure the bottom portion of the modal.

|Property|Type|Description|
|---|---|---|
|**content**|[ModalFooterButtonHandlerProps](#modalfooterbuttonhandlerprops) \| [ModalFooterButtonProps](#modalfooterbuttonprops)[] \| JSX.Element|The contents of the footer.|

<h3 style="margin: 40px 0 5px 0;">ModalFooterButtonProps</h3>
Allows simple and semi-custom buttons to be created in the footer.

|Property|Type|Description|
|---|---|---|
|\[**className**\]|string|_Optional_ class name that will be set on the button.
|**content**|string \| JSX.Element|The information that will be displayed as the contents of a button element.|
|\[**focus** = false\]|boolean|_Optional_ if true the button will be focused. This should be true for only one button in the array.|
|\[**onClick**\]|(props: [ModalFooterButtonProps](#modalfooterbuttonprops)) => void|_Optional_ handler that will be invoked when the button is clicked.

<h3 style="margin: 40px 0 5px 0;">ModalFooterButtonHandlerProps</h3>
The simplest way to create a footer with one or two buttons, simply add handlers for the corresponding buttons.

|Property|Type|Description|
|---|---|---|
|**onAffirmativeClick**|() => void|Invoked when the affirmative button is clicked.|
|\[**onNegativeClick**\]|() => void|_Optional_ handler for a negative response button. If not supplied the button will not appear.|
|\[**primary**\]|"affirmative" \| "negative"|_Optional_ toggle to set the class "primary" on one of the two buttons.|

<h3 style="margin: 40px 0 5px 0;">ModalOptions</h3>
Object that controls the display of a modal.

|Property|Type|Description|
|---|---|---|
|**body**|string \| string[] \| [ModalBodyProps](#modalbodyprops)|The information to display in the main part of the modal.|
|\[**dismissable** = false\]|boolean \| [OnDismissableModalDismissed](#ondismissablemodaldismissed)|_Optional_ if true the modal can be dismissed by clicking outside of the modal.|
|\[**footer**\]|[OnClickHandler](#onclickhandler) \| \[[OnClickHandler](#onclickhandler), [OnClickHandler](#onclickhandler)\] \| [ModalFooterProps](#modalfooterprops)|_Optional_ information displayed at the bottom of the modal. For a single affirmative button (i.e. "OK") pass a single OnClickHandler. For two buttons, one affirmative and one negative (i.e. "OK, "Cancel") pass an array with two OnClickHandlers. For more control use ModalFooterProps.|
|\[**providerUid**\]|string|_Optional_ unique identifier of the provider.|
|\[**title**\]|string \| [ModalTitleProps](#modaltitleprops)|_Optional_ title to display at the top of the modal.|
|**uid**|string|A unique identifier for this modal. Only one modal with this unique identifier can be queued at a time.|

<h3 style="margin: 40px 0 5px 0;">ModalTitleProps</h3>
Data used to display the title of a modal.

|Property|Type|Description|
|---|---|---|
|**content**|string \| JSX.Element|The information to display in the title. A string will be displayed as the content of an \<h1\> element.|

<h3 style="margin: 40px 0 5px 0;">OnClickHandler</h3>
A function invoked when a button is clicked. Takes no parameters and returns void.

<h3 style="margin: 40px 0 5px 0;">OnDismissableModalDismissed</h3>
A function that is invoked by a modal to indicate that the user has clicked outside of a dismissable modal. This function should be provided if the disappearance of the modal is animated and the function creator needs to start that animation. Takes no parameters and returns void.
