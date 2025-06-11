import React from 'react';
import Modal from 'react-modal'
import './CustomeModel.css'
import { MdOutlineClose } from "react-icons/md";

Modal.setAppElement('#root');

interface AppModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
    customStyles?: Modal.Styles;
    buttons?: Array<{
        label: string;
        onClick: () => void;
    }>;
}

const CustomModal: React.FC<AppModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    customStyles,
    buttons
}) => {
    const defaultStyles: Modal.Styles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            backgroundColor: '#ddd',
            transform: 'translate(-50%, -50%)',
            // width: '50vw',
            padding: '10px',
            // padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            ...customStyles?.content,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            ...customStyles?.overlay,
        },
    };
    const content = () => {
        return (
            <div className='model-container'>
                {title && <h3 className='title'>{title}</h3>}
                <button onClick={onClose} className='close-button'><MdOutlineClose /></button>
                {children}

                {buttons && (
                    <>
                        <hr />
                        <div className='footer'>
                            {buttons.map((button, index) =>
                                <button key={index} onClick={button.onClick} className='button '>
                                    {button.label}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title || 'App Modal'}
            style={defaultStyles}
            shouldCloseOnOverlayClick={false}
        >
            {content()}
        </Modal>
    );
};

export default CustomModal;
