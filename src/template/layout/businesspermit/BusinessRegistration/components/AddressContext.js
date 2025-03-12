import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [businessAddress, setBusinessAddress] = useState({
    region: '',
    province: '',
    municipality: '',
    barangay: '',
    address: '',
    zipCode: '',
  });

  return (
    <AddressContext.Provider value={{ businessAddress, setBusinessAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => useContext(AddressContext);
