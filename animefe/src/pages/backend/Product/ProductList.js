import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productApi from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import brandApi from '../../../api/brandApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import SelectBox from '../../../components/common/SelectBox';
import Input from '../../../components/common/Input';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { formatCurrency, formatDate, getImageUrl } from '../../../utils';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter search parameters state
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    brandId: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    page: 0,
    size: 5,
    sortBy: 'id',
    sortDirection: 'desc',
  });

  const navigate = useNavigate();

  // Load Categories & Brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await categoryApi.getAll();
        const brRes = await brandApi.getAll();
        setCategories(catRes || []);
        setBrands(brRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on current filters state
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productApi.getAll(filters);
      // API response: PageProductResponse which contains content, totalPages, number etc.
      setProducts(response?.content || []);
      setTotalPages(response?.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleSearch = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword, page: 0 }));
  };

  const handleFilterSelect = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handleSort = (config) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: config.key,
      sortDirection: config.direction,
      page: 0,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productApi.delete(id);
        loadProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const headers = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'thumbnail', label: 'Ảnh' },
    { key: 'name', label: 'Tên sản phẩm', sortable: true },
    { key: 'price', label: 'Giá gốc', sortable: true },
    { key: 'quantity', label: 'Kho', sortable: true },
    { key: 'status', label: 'Trạng thái', sortable: true },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (product) => (
    <tr key={product.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors text-slate-300">
      <td className="px-6 py-4 font-semibold text-slate-500">#{product.id}</td>
      <td className="px-6 py-4">
        <img src={getImageUrl(product.thumbnail, 'https://placehold.co/40x48?text=No+Image')} alt="Product" className="w-10 h-12 object-cover rounded border border-slate-800 bg-slate-950" />
      </td>
      <td className="px-6 py-4">
        <div>
          <Link to={`/admin/products/show/${product.id}`} className="font-bold text-slate-200 hover:text-indigo-400 transition-colors">{product.name}</Link>
          <p className="text-[10px] text-slate-500 mt-0.5">{product.brandName} | {product.categoryName}</p>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-slate-200">{formatCurrency(product.price)}</td>
      <td className="px-6 py-4 font-semibold text-slate-400">{product.quantity}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
          product.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Gallery image edit */}
          <Link
            to={`/admin/products/images/${product.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-400 transition-colors"
            title="Thư viện ảnh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
          
          {/* Sale price setup */}
          <Link
            to={`/admin/products/sale/${product.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-400 transition-colors"
            title="Thiết lập KM"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
          
          {/* Store Input */}
          <Link
            to={`/admin/products/store/${product.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
            title="Nhập kho"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </Link>

          <Link
            to={`/admin/products/edit/${product.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
            title="Xóa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Title subtitle="Quản lý danh sách mô hình figure trong kho hàng">
          Sản phẩm
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/products/create')}>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
        <div className="md:col-span-2">
          <SearchBox placeholder="Tìm kiếm mô hình..." onSearch={handleSearch} className="max-w-none" />
        </div>
        <SelectBox
          name="categoryId"
          value={filters.categoryId}
          onChange={handleFilterSelect}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Lọc Danh mục"
        />
        <SelectBox
          name="brandId"
          value={filters.brandId}
          onChange={handleFilterSelect}
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
          placeholder="Lọc Hãng sản xuất"
        />
        <SelectBox
          name="status"
          value={filters.status}
          onChange={handleFilterSelect}
          options={[
            { value: 'ACTIVE', label: 'Đang bán (ACTIVE)' },
            { value: 'INACTIVE', label: 'Ngừng bán (INACTIVE)' },
            { value: 'OUT_OF_STOCK', label: 'Hết hàng (OUT_OF_STOCK)' },
          ]}
          placeholder="Lọc Trạng thái"
        />
        <Input
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleFilterSelect}
          placeholder="Giá tối thiểu"
        />
        <Input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleFilterSelect}
          placeholder="Giá tối đa"
        />
      </div>

      <Table
        headers={headers}
        data={products}
        isLoading={isLoading}
        sortConfig={{ key: filters.sortBy, direction: filters.sortDirection }}
        onSort={handleSort}
        renderRow={renderRow}
      />

      <Pagination
        currentPage={filters.page + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
