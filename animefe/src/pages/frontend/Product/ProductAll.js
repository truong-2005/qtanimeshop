import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productApi from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import brandApi from '../../../api/brandApi';
import Title from '../../../components/common/Title';
import ProductGrid from '../../../components/frontend/ProductGrid';
import ProductFilter from '../../../components/frontend/ProductFilter';
import Pagination from '../../../components/common/Pagination';

const ProductAll = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [pageData, setPageData] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Derive filters from URL
  const filters = {
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || '',
    sortDirection: searchParams.get('sortDirection') || '',
    page: Math.max(0, parseInt(searchParams.get('page') || '1', 10) - 1),
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll()
        ]);
        setCategories(catRes || []);
        setBrands(brandRes || []);
      } catch (err) {
        console.error('Lỗi tải danh mục/thương hiệu:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          ...filters,
          size: pageData.size,
          status: 'ACTIVE'
        };
        // Remove empty params
        Object.keys(params).forEach(k => {
          if (params[k] === '' || params[k] === null || params[k] === undefined) {
            delete params[k];
          }
        });
        
        const res = await productApi.getAll(params);
        setProducts(res.content || []);
        setPageData(prev => ({ ...prev, totalPages: res.totalPages || 0, page: res.number || 0 }));
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    // Reset page to 0 when filter changes
    updatedParams.set('page', '0');
    setSearchParams(updatedParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('page', newPage.toString());
    setSearchParams(updatedParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Title subtitle="Khám phá bộ sưu tập Figure">Tất Cả Sản Phẩm</Title>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <ProductFilter
            categories={categories}
            brands={brands}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid & Pagination */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          {filters.keyword && (
            <div className="text-sm text-slate-300 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
              Kết quả tìm kiếm cho từ khóa: <span className="font-bold text-indigo-400">"{filters.keyword}"</span>
            </div>
          )}
          
          <ProductGrid products={products} isLoading={isLoading} />
          
          {!isLoading && pageData.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={pageData.page + 1}
                totalPages={pageData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAll;
