"use client";

import { Button } from '@/components/ui/button';
import React from 'react';

interface CopyButtonProps {
  aiResponse: string;
  formData: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ aiResponse, formData }) => {
  const handleCopy = () => {
    // Combine aiResponse and formData
    const textToCopy = `Form Data: ${formData}\nAI Response: ${aiResponse}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  return (
    <div>
      <Button variant='ghost' className='text-primary' onClick={handleCopy}>
        Copy
      </Button>
    </div>
  );
};

export default CopyButton;
