import { useContext } from "react";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
    }, 0);

    function handleClose() {
        userProgressCtx.hideCheckOut();
    }
   
    function handleSubmit(e) {
        e.preventDefault()

        const fd = new FormData(e.target)
        const customerData = Object.fromEntries(fd.entries());

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            }),
        });
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full name" id="name" type="text" />
            <Input label="E-Mail Address" id="email" type="email" />
            <Input label="Street" id="street" type="text" />
                <div className="control-row">
                    <Input label="Postal Code" id="postal-code" type="text" />
                    <Input label="City" id="city" type="text" />
                </div>
                <p className="modal-actions">
                    <Button type="button" textOnly
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button type="submit">Submit Order</Button>
                </p>
        </form>
    </Modal>
}