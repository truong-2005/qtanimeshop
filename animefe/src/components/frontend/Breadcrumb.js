import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs py-3 select-none text-left">
      <Link to="/" className="text-slate-500 hover:text-purple-400 transition-colors font-medium">
        Home
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span className="text-slate-700 font-bold">/</span>
            {isLast ? (
              <span className="text-purple-400 font-bold truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-slate-500 hover:text-purple-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
