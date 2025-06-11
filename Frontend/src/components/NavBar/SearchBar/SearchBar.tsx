import { MdOutlineSearch } from "react-icons/md";
import './searchbar.css'
import { useNavigate } from "react-router";

type SearchProps = {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
}
const SearchBar = (props: SearchProps) => {
    const navigate = useNavigate()
    const handleOnFocus = () =>{
        navigate('/search')
    }
    return (
        <div className="searchbar">
            <input type='text'
                className="search-input"
                placeholder='Search...'
                value={props.value}
                onFocus={()=> handleOnFocus()}
                onChange={()=>{}}
            />
            <button className='search-button'><MdOutlineSearch /></button>
        </div>
    )
}

export default SearchBar
