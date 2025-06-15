
import './searchbar.css';
import React from "react";

type SearchProps = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    width: string;
};

// 🔧 Use forwardRef to pass ref to input
const SearchBar = React.forwardRef<HTMLInputElement, SearchProps>(
    ({ value, setValue, width }, ref) => {

        return (
            <div className="searchbar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products or categories..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ width }}
                    ref={ref} // ✅ correctly assign ref
                />
            </div>
        );
    }
);

export default SearchBar;
