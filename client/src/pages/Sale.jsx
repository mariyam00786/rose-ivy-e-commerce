import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductsPage from './ProductsPage';

export default function Sale() {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ onSale: 'true' });
  }, [setSearchParams]);

  return <ProductsPage />;
}
