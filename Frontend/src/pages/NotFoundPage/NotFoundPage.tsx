import './NotFound.css'
import { MdOutlineError } from "react-icons/md";

const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-container">
            <p className="not-found-content">404 Page Not Found</p>
            <MdOutlineError className='not-found-icon'/>
        </div>
    )
}

export default NotFoundPage
