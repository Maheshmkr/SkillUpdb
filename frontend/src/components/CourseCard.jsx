import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Star, Users, Clock, ShoppingCart, Eye } from 'lucide-react';
import { getCourseById } from '../api/courseApi';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    _id,
    title,
    subtitle,
    instructor,
    thumbnail,
    rating = 4.5,
    ratingCount = 120,
    studentsEnrolled = 1500,
    totalHours = 20,
    price,
    originalPrice,
    status = 'Bestseller'
  } = course;

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['course', _id],
      queryFn: () => getCourseById(_id),
      staleTime: 5 * 60 * 1000,
    });
  };

  const handleClick = () => {
    navigate(`/course/${_id}`);
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      onMouseEnter={handlePrefetch}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail || 'https://via.placeholder.com/400x225?text=Course+Thumbnail'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {status && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
            {status}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye size={20} />
          </button>
          <button
            className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-colors"
            title="Save for Later"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-900 font-bold text-lg leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-1 mb-2">
          {subtitle || 'Master this skill with expert-led training.'}
        </p>

        <div className="mt-auto">
          <p className="text-gray-500 text-xs mb-2">
            {instructor?.name || 'SkillUp Instructor'}
          </p>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-600 font-bold text-sm">{rating.toFixed(1)}</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-gray-400 text-xs">({ratingCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{studentsEnrolled.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{totalHours}h</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-bold text-lg">${price}</span>
              {originalPrice && (
                <span className="text-gray-400 line-through text-sm">${originalPrice}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
