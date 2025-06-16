import React from "react";
import { ReactComponent as BookShelfIcon } from '../assets/subnavbar/book-shelf.svg';
import { ReactComponent as LampIcon } from '../assets/subnavbar/light-lamp.svg';
import { ReactComponent as ChairIcon } from '../assets/subnavbar/chair.svg';
import { ReactComponent as SofaIcon } from '../assets/subnavbar/sofa.svg';
import { ReactComponent as TableIcon } from '../assets/subnavbar/table.svg';
import { ReactComponent as ClosetIcon } from '../assets/subnavbar/closet.svg';

const CategoryMenu = ({setType}) => {

    const categories = [
    { name: 'Sofa', icon: SofaIcon },
    { name: 'Ghế', icon: ChairIcon },
    { name: 'Trang trí', icon: LampIcon },
    { name: 'Kệ sách', icon: BookShelfIcon },
    { name: 'Bàn', icon: TableIcon },
    { name: 'Tủ quần áo', icon: ClosetIcon },
    ];

  return (
      <div className="grid grid-cols-6 overflow-hidden shadow">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="group flex flex-col items-center justify-center p-10 px-14 hover:bg-gray-50 border border-gray-100 cursor-pointer perspective-1000"
              onClick={() => setType(cat.name)}
            >
              <div className="flip-icon w-16 h-16 mb-2">
                <Icon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </div>
          );
        })}
      </div>
  );
};

export default CategoryMenu;
