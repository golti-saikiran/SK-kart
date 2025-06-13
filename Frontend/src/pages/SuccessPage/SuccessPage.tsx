import successImage from '../../Assets/order-placed-purchased-icon.svg'
import { Link, useParams } from 'react-router'
import './SuccessPage.css'

const SuccessPage = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className='success-container'>
            <img src={successImage} alt="order-success-image" width={200} />
            <p >Order Placed successfully</p>
            <p>Order Id: {id}</p>
            <Link  to="/dashboard/user/orders">Go to orders</Link>
        </div>
    )
}

export default SuccessPage
