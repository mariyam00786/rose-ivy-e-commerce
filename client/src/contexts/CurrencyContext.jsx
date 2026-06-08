import { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState('AED');

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  };

  // Convert AED to USD rate (approx 1 AED = 0.272 USD)
  const formatPrice = (aedAmount) => {
    const amount = Number(aedAmount || 0);
    if (currency === 'USD') {
      const usdAmount = amount * 0.272;
      return `$${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return `AED ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
