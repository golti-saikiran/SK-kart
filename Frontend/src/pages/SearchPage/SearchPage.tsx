import { useEffect, useState, useCallback } from "react";
import useStore from "../../Store/store";
import productCalls from "../../API/ProductCalls";
import { debounce } from "lodash";
// import "./SearchPage.css";
import { CategoryTypes, ProductType, SubCategoryTypes } from "../../utils/Types";

const SearchPage = () => {
  const categories = useStore((state) => state.category);
  const subcategories = useStore((state) => state.subCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryTypes[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategoryTypes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setFilteredCategories([]);
        setFilteredSubcategories([]);
        setFilteredProducts([]);
        return;
      }

      const lowerQuery = query.toLowerCase();

      const matchedCategories = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(lowerQuery)
      );
      const matchedSubcategories = subcategories.filter((sub) =>
        sub.subcategory_name.toLowerCase().includes(lowerQuery)
      );

      try {
        const result = await productCalls.searchProducts(query);
        setFilteredCategories(matchedCategories);
        setFilteredSubcategories(matchedSubcategories);
        setFilteredProducts(result || []);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 500),
    [categories, subcategories]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search categories, subcategories, or products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="search-results">
        {filteredCategories.length > 0 && (
          <div>
            <h3>Matching Categories</h3>
            <ul>
              {filteredCategories.map((cat) => (
                <li key={cat._id}>{cat.category_name}</li>
              ))}
            </ul>
          </div>
        )}

        {filteredSubcategories.length > 0 && (
          <div>
            <h3>Matching Subcategories</h3>
            <ul>
              {filteredSubcategories.map((sub) => (
                <li key={sub._id}>{sub.subcategory_name}</li>
              ))}
            </ul>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div>
            <h3>Matching Products</h3>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <img
                    src={product.product_image_url}
                    alt={product.productname}
                    className="product-img"
                  />
                  <h4>{product.productname}</h4>
                  <p>₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
