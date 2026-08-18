import React from 'react';
import { getImageUrl } from '../../utils';

const BannerCard = ({ banner, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:scale-105 transition-transform duration-200">
      <img
        src={getImageUrl(banner.image, 'https://placehold.co/600x300?text=No+Image')}
        alt={`Banner ${banner.title}`}
        className="w-full h-auto object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/600x300?text=No+Image';
        }}
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-200 truncate">{banner.title}</h3>
        <p className="text-xs text-slate-400 break-all">{banner.link}</p>
        <span className={banner.active ? "inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20" : "inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-500 rounded-full"}>
          {banner.active ? 'Active' : 'Inactive'}
        </span>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onEdit}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
            aria-label="Edit banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
            aria-label="Delete banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
