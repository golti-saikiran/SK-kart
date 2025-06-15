// src/components/Breadcrumbs/Breadcrumbs.tsx
import { Link, useLocation } from "react-router-dom";
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const formatBreadcrumb = (segment: string) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <nav className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={to} className="breadcrumb-item">
            <span className="separator">/</span>
            {isLast ? (
              <span className="breadcrumb-current">{formatBreadcrumb(segment)}</span>
            ) : (
              <Link to={to} className="breadcrumb-link">
                {formatBreadcrumb(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
