import React, { useState } from "react";
import BusinessAddressForm from "./BusinessAdress";
import BusinessOperation from "./BusinessOperation";

const BusinessFormContainer = () => {
  const [formValues, setFormValues] = useState({
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    address: "",
    zipCode: "",
  });

  const updateFormValues = (newValues) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  return (
    <div>
      <BusinessAddressForm formValues={formValues} setFormValues={updateFormValues} />
      <BusinessOperation formValues={formValues} setFormValues={updateFormValues} />
    </div>
  );
};

export default BusinessFormContainer;
