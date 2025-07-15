import React, { useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton, Modal, Box, Typography, Divider, List, ListItem } from '@mui/material';

const StatCard = ({ label, value, infoDetail }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <div className="text-lg font-semibold mb-2 flex items-center">
        {label}
        {infoDetail && (
          <IconButton size="small" onClick={handleOpen} title="Xem chi tiết" sx={{ ml: 1 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      {infoDetail && (
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 350, maxHeight: '80vh', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Chi tiết tồn kho</Typography>
            <Typography>Sản phẩm sắp hết hàng: {infoDetail.lowStockProducts.length}</Typography>
            <Typography>Sản phẩm đã hết hàng: {infoDetail.outOfStockProducts.length}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Danh sách sản phẩm sắp hết hàng:</Typography>
            <List dense>
              {infoDetail.lowStockProducts.length === 0 && <ListItem>Không có sản phẩm nào sắp hết hàng.</ListItem>}
              {infoDetail.lowStockProducts.map((p, idx) => (
                <ListItem key={idx} alignItems="flex-start">
                  <b>{p.name}</b> (Tồn kho: {p.totalStock})<br />
                  {p.variants.map((v, i) => (
                    <span key={i} style={{ marginLeft: 8 }}>- {v.name}: {v.stock}<br /></span>
                  ))}
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Danh sách sản phẩm đã hết hàng:</Typography>
            <List dense>
              {infoDetail.outOfStockProducts.length === 0 && <ListItem>Không có sản phẩm nào hết hàng.</ListItem>}
              {infoDetail.outOfStockProducts.map((p, idx) => (
                <ListItem key={idx} alignItems="flex-start">
                  <b>{p.name}</b>
                  {p.variants.map((v, i) => (
                    <span key={i} style={{ marginLeft: 8 }}>- {v.name}: {v.stock}<br /></span>
                  ))}
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default StatCard;
