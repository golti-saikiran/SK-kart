import './DashBoardLayout.css';

import { FiArrowLeftCircle,FiArrowRightCircle } from "react-icons/fi";
import { useOutletContext } from 'react-router-dom'; // ✅ import this

type DashboardContextType = {
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

type DashBoardPageProps = {
    title: string;
    button?: {
        text: string;
        clickEvent: React.Dispatch<React.SetStateAction<boolean>>;
    };
    children: React.ReactNode;
};

const DashBoardPageLayout = ({ title, button, children }: DashBoardPageProps) => {
    const { showMenu, setShowMenu } = useOutletContext<DashboardContextType>(); // ✅ get from context

    return (
        <div className="page-container">
            <div className="page-header">
                {showMenu ?
                    <FiArrowLeftCircle onClick={() => setShowMenu(prev => !prev)} className='showMenu'/> :
                    <FiArrowRightCircle onClick={() => setShowMenu(prev => !prev)} className='showMenu'/>}
                <span className="page-title">{title}</span>
                {button && (
                    <button
                        className="page-header-button"
                        onClick={() => button.clickEvent(true)}
                    >
                        {button.text}
                    </button>
                )}
            </div>
            <div className="page-content">
                {children}
            </div>
        </div>
    );
};

export default DashBoardPageLayout;
