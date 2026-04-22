import { useContext, useActionState } from "react";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import {  } from "react";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {data, error, clearData, sendRequest} = useHttp('http://localhost:3000/orders', requestConfig, null);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
    }, 0);

    function handleClose() {
        userProgressCtx.hideCheckOut();
    }
    function handleFinish() {
        userProgressCtx.hideCheckOut();
        cartCtx.clearCart();
        clearData();
    }
   
     async function checkOutAction(prevState, fd) {
        
        const customerData = Object.fromEntries(fd.entries());

       await sendRequest(
        JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
       )
    }

    const [formState, formAction, isSending] = useActionState(checkOutAction, null);

    let actions = (
            <>
                <Button type="button" textOnly
                        onClick={handleClose}
                    >
                        Close
                </Button>
                    <Button type="submit">Submit Order</Button>
            </>)
            if (isSending) {
                actions = <span>Sending order data...</span>
            }

            if (data && !error) {
                return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
                    <h2>Success</h2>
                    <p>Your order has been submitted successfully!</p>
                    <p>We will get back to you via email in the next few minutes.</p>
                    <p className="modal-actions">
                        <Button onClick={handleFinish }>Okay</Button>
                    </p>
                </Modal>
            }
    return (<Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form action={checkOutAction}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full name" id="name" type="text" />
            <Input label="E-Mail Address" id="email" type="email" />
            <Input label="Street" id="street" type="text" />
                <div className="control-row">
                    <Input label="Postal Code" id="postal-code" type="text" />
                    <Input label="City" id="city" type="text" />
                </div>
                {error && <Error title="Failed to submit order" message={error} />}
                <p className="modal-actions">
                    {actions}
                </p>
        </form>
    </Modal>)
}