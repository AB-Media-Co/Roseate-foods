import React, { useState } from 'react';
import { useCart } from '../state/CartProvider';
import { toast } from 'react-toastify';
import Button from './ui/Button';


const AddToCartButton = ({
  variantId,
  quantity = 1,
  className = "w-full justify-center",
  size = "btn",
  variant = "default",
  disabled = false,
  onSuccess,
  onError,
  children = "Add To Cart",
  showSuccessToast = true,
  showErrorToast = true,
  successMessage,
  productTitle,
  ...buttonProps
}) => {
  console.log(variantId,quantity)
  const [isAdding, setIsAdding] = useState(false);
  console.log(isAdding)
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    // Validation
    if (!variantId) {
      const error = new Error('Product variant not available');
      if (showErrorToast) {
        toast.error('⚠️ Unable to add product to cart');
      }
      onError?.(error);
      return;
    }

    if (quantity <= 0) {
      const error = new Error('Quantity must be greater than 0');
      if (showErrorToast) {
        toast.error('❌ Please select a valid quantity');
      }
      onError?.(error);
      return;
    }

    setIsAdding(true);
    
    try {
      // Add to cart via CartProvider
      await addToCart(variantId, quantity);
      
      // Success feedback with toast
      if (showSuccessToast) {
        const message = successMessage || 
          (productTitle 
            ? `🎉 ${productTitle} added to cart!` 
            : `✓ ${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
        toast.success(message);
      }
      
      // Call success callback if provided
      onSuccess?.({ variantId, quantity });
      
    } catch (error) {
      // Error handling with user-friendly toast
      if (showErrorToast) {
        const message = error.message.includes('inventory') 
          ? '🚨 Sorry, this item is out of stock'
          : error.message.includes('network') || error.message.includes('fetch')
            ? '🌐 Network error. Please try again.'
            : '❌ Failed to add to cart. Please try again.';
        toast.error(message);
      }
      
      // Call error callback if provided
      onError?.(error);
      
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={disabled || isAdding || !variantId}
      {...buttonProps}
    >
      {isAdding ? 'Adding...' : children}
    </Button>
  );
};

export default AddToCartButton;