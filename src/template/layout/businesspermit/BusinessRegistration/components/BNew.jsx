import { Box, Step, StepButton, Stepper } from '@mui/material';
import React from 'react';
import BusinessAdditional from './BusinessAdditional';
import BusinessAddress from './BusinessAdress';
import BusinessForm from './BusinessFormNew';
import BusinessOperation from './BusinessOperation';


const steps = [
  'Business Information and Registration',
  'Business Address',
  'Business Operation',
  'Additional Details',
  'Review & Submit',
];

function BNew() {
  // This state tracks which step we’re on
  const [activeStep, setActiveStep] = React.useState(0);

  // Move to the *next* step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Move to the *previous* step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Optional: jump to a specific step if user clicks the StepButton
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // Conditionally render the step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BusinessForm handleNext={handleNext} />;
      case 1:
        return <BusinessAddress handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <BusinessOperation handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <BusinessAdditional handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <div>Review & Submit Component</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {/* Stepper Header */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ width: '80%' }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Render the content for whichever step is active */}
      {renderStepContent()}
    </Box>
  );
}

export default BNew;
