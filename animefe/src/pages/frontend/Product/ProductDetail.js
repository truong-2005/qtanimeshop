import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productApi from '../../../api/productApi';
import cartApi from '../../../api/cartApi';
import useAuth from '../../../hooks/useAuth';
import useCart from '../../../hooks/useCart';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import ReviewList from '../Review/ReviewList';
import CommentList from '../Comment/CommentList';
import { formatCurrency, getImageUrl } from '../../../utils';

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart() || {};
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res;
        // If slug is purely a number, it might be an ID fallback from cart
        if (/^\d+$/.test(slug)) {
          try {
            res = await productApi.getById(slug);
          } catch (e) {
            res = await productApi.getBySlug(slug);
          }
        } else {
          res = await productApi.getBySlug(slug);
        }
        
        setProduct(res);
        if (res.images && res.images.length > 0) {
          // Sort images: true first
          const sorted = [...res.images].sort((a, b) => b.isPrimary - a.isPrimary);
          setSelectedImage(getImageUrl(sorted[0].imageUrl, 'https://placehold.co/600x800?text=No+Image'));
        } else if (res.thumbnail) {
          setSelectedImage(getImageUrl(res.thumbnail, 'https://placehold.co/600x800?text=No+Image'));
        } else {
          setSelectedImage('https://placehold.co/600x800?text=No+Image');
        }
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    setAddingToCart(true);
    try {
      if (addToCart) {
        const success = await addToCart(product, quantity);
        if (success) {
          alert('Thêm vào giỏ hàng thành công!');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải chi tiết sản phẩm..." /></div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Title subtitle="Lỗi">Không tìm thấy sản phẩm</Title>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Product Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-lg mb-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(getImageUrl(img.imageUrl, 'https://placehold.co/600x800?text=No+Image'))}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === getImageUrl(img.imageUrl, 'https://placehold.co/600x800?text=No+Image') ? 'border-purple-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={getImageUrl(img.imageUrl, 'https://placehold.co/150')} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex gap-2 mb-2">
              {product.category && (
                <Link to={`/products/category/${product.category.id}`} className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-indigo-500/30 transition-colors">
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <Link to={`/products/brand/${product.brand.id}`} className="text-xs font-bold bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-rose-500/30 transition-colors">
                  {product.brand.name}
                </Link>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-black text-rose-600">{formatCurrency(product.salePrice)}</span>
                  <span className="text-lg text-slate-500 line-through">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-slate-900">{formatCurrency(product.price)}</span>
              )}
            </div>
          </div>

          <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
            <p>{product.description}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Tình trạng:</span>
              <span className={`font-bold ${product.quantity > 0 && product.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {product.status !== 'ACTIVE' ? 'Ngừng kinh doanh' : (product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng')}
              </span>
            </div>
            
            {product.attributes && product.attributes.length > 0 ? (
              product.attributes.map((attr, index) => (
                <div key={attr.id || index} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                  <span className="text-slate-500">{attr.name}:</span>
                  <span className="text-slate-800 text-right font-medium">{attr.value}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Chi tiết khác:</span>
                <span className="text-slate-800 text-right font-medium">Đang cập nhật</span>
              </div>
            )}
          </div>

          {product.quantity > 0 && product.status === 'ACTIVE' && (
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Số lượng:</span>
                <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                    className="w-16 bg-transparent text-center text-slate-900 font-bold focus:outline-none"
                    min="1"
                    max={product.quantity}
                  />
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  className="flex-1 justify-center py-3 text-lg"
                  onClick={handleAddToCart}
                  isLoading={addingToCart}
                  disabled={product.quantity < 1}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs / Reviews & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <Title subtitle="Ý kiến khách hàng">Đánh giá</Title>
          <div className="mt-6">
            <ReviewList productId={product.id} />
          </div>
        </div>
        <div>
          <Title subtitle="Hỏi đáp">Bình luận</Title>
          <div className="mt-6">
            <CommentList productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
