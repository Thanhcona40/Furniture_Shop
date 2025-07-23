import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/category";

const CategoryMenu = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    useEffect(() => {
      if(!categories?.length) { 
        const fetchCategories = async () => {
          try {
            const response = await getCategories();
            setCategories(response.data);
          } catch (error) {
            console.error("Failed to fetch categories:", error);
          }
        }
        fetchCategories(); 
      }
    }, []);
  return (
      <div className="grid grid-cols-6 overflow-hidden shadow">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="group flex flex-col items-center justify-center p-10 px-14 hover:bg-gray-50 border border-gray-100 cursor-pointer perspective-1000"
              onClick={() => navigate(`/allproducts?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className="flip-icon w-16 h-16 mb-2">
                <img src={cat.image} className="w-full h-full" />
              </div>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </div>
          );
        })}
      </div>
  );
};

export default CategoryMenu;
