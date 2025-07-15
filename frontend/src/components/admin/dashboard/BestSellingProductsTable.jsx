import React from 'react';

const BestSellingProductsTable = ({ products }) => (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Sản phẩm bán chạy</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Tên sản phẩm</th>
            <th className="text-left">Đã bán</th>
            <th className="text-left">Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={product._id || idx} className="border-t">
              <td>
                {product.productName}
                {product.variantName && (
                  <span style={{ fontSize: '12px', color: '#888', marginLeft: 4 }}>
                    ({product.variantName})
                  </span>
                )}
              </td>
              <td>{product.sold}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  

export default BestSellingProductsTable;
