//A utility file for shared functions.
export const formatPrice = (price) => {
  return price ? `${price} ETB` : 'N/A';
};

export const formatQuantity = (quantity) => {
  return quantity ? `${quantity} kg` : 'N/A';
};