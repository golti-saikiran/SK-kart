import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../Store/store";
import productCalls from "../../API/ProductCalls";
import {
  ProductType,
  CategoryTypes,
} from "../../utils/Types";
import "./HomePage.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

type GroupedByCategory = {
  [categoryId: string]: {
    categoryName: string;
    products: ProductType[];
  };
};

const HomePage = () => {
  const categories = useStore((state) => state.category);
  const subCategories = useStore((state) => state.subCategory);
  const [categoryProducts, setCategoryProducts] = useState<GroupedByCategory>({});

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const res = await productCalls.getAllProducts();
        const allProducts: ProductType[] = res.productsList;

        const subCatToCatMap: { [subId: string]: string } = {};
        subCategories.forEach((sub) => {
          subCatToCatMap[sub._id] = typeof sub.category === "string" ? sub.category : sub.category._id;
        });

        const grouped: GroupedByCategory = {};

        for (const category of categories) {
          const catId = category._id;
          const catName = category.category_name;

          const productsInCategory = allProducts
            .filter((p) => {
              if (!p.sub_category) return false;
              const subCatId = typeof p.sub_category === "string" ? p.sub_category : p.sub_category._id;
              const mappedCatId = subCatToCatMap[subCatId];
              return mappedCatId === catId;
            })
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);

          grouped[catId] = {
            categoryName: catName,
            products: productsInCategory,
          };
        }
        setCategoryProducts(grouped);
      } catch (err) {
        console.error("Error fetching or grouping products:", err);
      }
    };

    fetchProductsByCategory();
  }, [categories, subCategories]);

  return (
    <div className="home-container">
      {/* Category Cards */}
      <div className="category-grid">
        {categories.map((cat: CategoryTypes) => (
          <CategoryCard {...cat} />
        ))}
      </div>

      {/* Category-wise Top Products */}
      {Object.entries(categoryProducts).map(([catId, { categoryName, products }]) => (
        <div key={catId} className="category-section">
          <div className="top-products-header">
            <h2 className="section-title">{categoryName} </h2>
            <Link to={`/category/${catId}`} className="see-more-link">
              See all
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="no-products-msg">No Products Available</p>
          ) : (
            <div className="top-products-scroll">
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
