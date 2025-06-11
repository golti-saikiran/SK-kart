import { useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes';
import categoryCalls from './API/CategoriesCalls';
import SubCategoryCalls from './API/SubCategoriesCalls';
import useStore from './Store/store';
import { ToastContainer, Slide } from 'react-toastify';

const App: React.FC = (): JSX.Element => {
  const updateCategory = useStore((state) => state.updateCategory);
  const updateSubCategory = useStore((state) => state.updateSubCategory);
  const theme = useStore((state) => state.theme);

  // Fetch categories and subcategories on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await categoryCalls.FetchCategories();
        updateCategory(categories);

        const subcategories = await SubCategoryCalls.FetchSubCategories();
        updateSubCategory(subcategories);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();
  }, []);

  // Apply theme to the HTML root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        className="custom-toast-container"
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  )

};

export default App;
