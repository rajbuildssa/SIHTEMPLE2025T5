import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DevoteeDetailsForm = ({ numberOfTickets, devoteeDetails, onDetailsSubmit }) => {
  const [formData, setFormData] = useState({
    primaryDevotee: {
      name: devoteeDetails?.primaryDevotee?.name || '',
      email: devoteeDetails?.primaryDevotee?.email || '',
      phone: devoteeDetails?.primaryDevotee?.phone || '',
      age: devoteeDetails?.primaryDevotee?.age || '',
      address: devoteeDetails?.primaryDevotee?.address || ''
    },
    additionalDevotees: devoteeDetails?.additionalDevotees || Array.from({ length: numberOfTickets - 1 }, () => ({ name: '', age: '' }))
  });

  const [errors, setErrors] = useState({});

  const handlePrimaryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      primaryDevotee: { ...prev.primaryDevotee, [field]: value }
    }));
    if (errors[`primary_${field}`]) setErrors(prev => ({ ...prev, [`primary_${field}`]: null }));
  };

  const handleAdditionalChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalDevotees: prev.additionalDevotees.map((d, i) => i === index ? { ...d, [field]: value } : d)
    }));
    if (errors[`additional_${index}_${field}`]) setErrors(prev => ({ ...prev, [`additional_${index}_${field}`]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const primary = formData.primaryDevotee;

    if (!primary.name.trim()) newErrors.primary_name = 'Name is required';
    if (!primary.email.trim()) newErrors.primary_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email)) newErrors.primary_email = 'Enter a valid email';
    if (!primary.age || isNaN(primary.age) || parseInt(primary.age) < 1) newErrors.primary_age = 'Enter valid age';
    if (!primary.phone || !/^\d{10}$/.test(primary.phone.replace(/\D/g, ''))) newErrors.primary_phone = 'Enter valid 10-digit phone';

    formData.additionalDevotees.slice(0, numberOfTickets - 1).forEach((d, i) => {
      if (!d.name.trim()) newErrors[`additional_${i}_name`] = 'Name required';
      if (!d.age || isNaN(d.age) || parseInt(d.age) < 1) newErrors[`additional_${i}_age`] = 'Enter valid age';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onDetailsSubmit(formData);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Devotee Details</h2>
        <p className="text-muted-foreground mb-4">Please provide details for all devotees</p>
        <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
          <User className="h-4 w-4 text-temple-saffron" />
          <span className="font-semibold">{numberOfTickets} Devotee{numberOfTickets > 1 ? 's' : ''}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Devotee */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-lg sacred-shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <User className="mr-2 h-5 w-5 text-sw1049-primary" /> Primary Devotee (Booking Contact)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input value={formData.primaryDevotee.name} onChange={(e) => handlePrimaryChange('name', e.target.value)} placeholder="Enter full name" className={errors.primary_name ? 'border-error' : ''} />
              {errors.primary_name && <p className="text-error text-xs mt-1">{errors.primary_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input type="email" value={formData.primaryDevotee.email} onChange={(e) => handlePrimaryChange('email', e.target.value)} placeholder="Enter email" className={errors.primary_email ? 'border-error' : ''} />
              {errors.primary_email && <p className="text-error text-xs mt-1">{errors.primary_email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <Input value={formData.primaryDevotee.phone} onChange={(e) => handlePrimaryChange('phone', e.target.value)} placeholder="10-digit phone" className={errors.primary_phone ? 'border-error' : ''} />
              {errors.primary_phone && <p className="text-error text-xs mt-1">{errors.primary_phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age *</label>
              <Input type="number" value={formData.primaryDevotee.age} onChange={(e) => handlePrimaryChange('age', e.target.value)} placeholder="Enter age" className={errors.primary_age ? 'border-error' : ''} />
              {errors.primary_age && <p className="text-error text-xs mt-1">{errors.primary_age}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea value={formData.primaryDevotee.address} onChange={(e) => handlePrimaryChange('address', e.target.value)} placeholder="Optional address" className="w-full border border-border rounded-md p-2 resize-none" rows={3} />
            </div>
          </div>
        </motion.div>

        {/* Additional Devotees */}
        {numberOfTickets > 1 && formData.additionalDevotees.slice(0, numberOfTickets - 1).map((devotee, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="bg-card rounded-lg sacred-shadow p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <User className="mr-2 h-5 w-5 text-temple-gold" /> Additional Devotee {index + 2}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input value={devotee.name} onChange={(e) => handleAdditionalChange(index, 'name', e.target.value)} className={errors[`additional_${index}_name`] ? 'border-error' : ''} />
                {errors[`additional_${index}_name`] && <p className="text-error text-xs mt-1">{errors[`additional_${index}_name`]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <Input type="number" value={devotee.age} onChange={(e) => handleAdditionalChange(index, 'age', e.target.value)} className={errors[`additional_${index}_age`] ? 'border-error' : ''} />
                {errors[`additional_${index}_age`] && <p className="text-error text-xs mt-1">{errors[`additional_${index}_age`]}</p>}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Important Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-temple-gold/10 border border-temple-gold/30 rounded-lg p-6">
          <h4 className="font-semibold text-temple-gold mb-3">📋 Important Information</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Primary devotee will receive booking confirmation via SMS/Email</li>
            <li>• All devotees must carry valid photo ID</li>
            <li>• Names must match exactly with ID</li>
            <li>• Children below 12 years are eligible for discounts</li>
            <li>• Phone number used for OTP verification at entry</li>
          </ul>
        </motion.div>

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex justify-center pt-6">
          <Button type="submit" size="lg" className="sw1049-gradient text-white px-8 py-3 hover:opacity-90">Continue to Payment</Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default DevoteeDetailsForm;
