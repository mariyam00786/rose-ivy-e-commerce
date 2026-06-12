export const FALLBACK_IMAGES = [
  'https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg', // pink roses
  'https://inbloom.ae/wp-content/uploads/706719212_17960656125104145_777686201114964296_n.jpg', // dark/velvet roses
  'https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp', // ivory vase
  'https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg', // wedding bouquet
  'https://inbloom.ae/wp-content/uploads/2025/05/L1080140-Photoroom-3.jpg', // sunflower/yellow
  'https://inbloom.ae/wp-content/uploads/2025/05/green-orchids-Photoroom-7-e1746599286884.jpg', // green orchids
];

export function getFallbackImage(productName) {
  const name = (productName || '').toLowerCase();
  
  if (name.includes('velvet') || name.includes('noir') || name.includes('dark') || name.includes('black')) {
    return FALLBACK_IMAGES[1];
  }
  if (name.includes('vase') || name.includes('ivory') || name.includes('antique') || name.includes('white')) {
    return FALLBACK_IMAGES[2];
  }
  if (name.includes('bridal') || name.includes('wedding') || name.includes('hand bouquet')) {
    return FALLBACK_IMAGES[3];
  }
  if (name.includes('sunflower') || name.includes('yellow') || name.includes('summer')) {
    return FALLBACK_IMAGES[4];
  }
  if (name.includes('orchid') || name.includes('statement') || name.includes('imperial') || name.includes('grand')) {
    return FALLBACK_IMAGES[5];
  }
  if (name.includes('box') || name.includes('dusty') || name.includes('pink') || name.includes('parisian')) {
    return FALLBACK_IMAGES[0];
  }
  
  // Deterministic fallback so a specific product always gets the same image
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

export function getProductImage(product) {
  if (!product) return getFallbackImage('');
  
  // Check images array
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    if (img && !img.includes('pexels.com') && !img.includes('unsplash.com')) {
      return img;
    }
  }
  
  // Check imageUrl
  if (product.imageUrl && !product.imageUrl.includes('pexels.com') && !product.imageUrl.includes('unsplash.com')) {
    return product.imageUrl;
  }
  
  // Fallback to our semantic flower matcher
  const name = product.name || product.productId?.name || '';
  return getFallbackImage(name);
}

export function getCategoryImage(category) {
  if (!category) return FALLBACK_IMAGES[0];
  
  // If the category has a non-placeholder image, use it
  if (category.image && !category.image.includes('unsplash.com') && !category.image.includes('pexels.com')) {
    return category.image;
  }
  
  // Map category names to appropriate flower images
  const name = (category.name || category.slug || '').toLowerCase();
  
  if (name.includes('box') || name.includes('flower box')) return FALLBACK_IMAGES[0];
  if (name.includes('signature')) return FALLBACK_IMAGES[1];
  if (name.includes('vase') || name.includes('bouquet')) return FALLBACK_IMAGES[2];
  if (name.includes('statement') || name.includes('interior')) return FALLBACK_IMAGES[5];
  if (name.includes('wedding')) return FALLBACK_IMAGES[3];
  if (name.includes('seasonal') || name.includes('summer')) return FALLBACK_IMAGES[4];
  if (name.includes('gift')) return FALLBACK_IMAGES[0];
  if (name.includes('yacht') || name.includes('aviation')) return FALLBACK_IMAGES[5];
  if (name.includes('b2b') || name.includes('solution')) return FALLBACK_IMAGES[2];
  if (name.includes('bespoke')) return FALLBACK_IMAGES[1];
  
  return getFallbackImage(name);
}
