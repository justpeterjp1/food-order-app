import { useEffect } from 'react';
import { createPortal } from 'react-dom'

export default function Modal({children, open, className = ''}) {
    const dialog = useRef();



    useEffect(() => {
        if(open) {
            dialog.current.showModal();
        }
    }, [open])
    return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>Modal Content</dialog>, 
    document.getElementById('modal'));
}