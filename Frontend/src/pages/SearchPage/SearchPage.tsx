import { useEffect, useState, useCallback, useRef } from "react";
import useStore from "../../Store/store";
import productCalls from "../../API/ProductCalls";
import { debounce } from "lodash";
import { CategoryTypes, ProductType } from "../../utils/Types";
import SearchBar from "../../components/NavBar/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import './SearchPage.css';

const SearchPage = () => {
  const categories = useStore((state) => state.category);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryTypes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      const trimmedQuery = query.trim().toLowerCase();

      if (!trimmedQuery) {
        setFilteredCategories([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const matchedCategories = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(trimmedQuery)
      );

      try {
        const products = await productCalls.searchProducts(trimmedQuery);
        setFilteredCategories(matchedCategories);
        setFilteredProducts(products || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [categories]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="search-page">
      <SearchBar ref={searchInputRef} value={searchQuery} setValue={setSearchQuery} width="700px" />

      <div className="search-results">
        {loading && (
          <div className="loading">
            <p>Loading results...</p>
          </div>
        )}

        {!loading && searchQuery && filteredProducts.length === 0 && filteredCategories.length === 0 && (
          <p className="no-products-msg">No results matched your search.</p>
        )}

        {!loading && filteredCategories.length > 0 && (
          <div className="section">
            <h3 className="section-heading">Matching Categories</h3>
            <div className="category-grid">
              {filteredCategories.map((cat) => (
                <CategoryCard key={cat._id} {...cat} />
              ))}
            </div>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="section">
            <h3 className="section-heading">Matching Products</h3>
            <div className="search-products-container">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
