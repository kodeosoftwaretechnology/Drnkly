import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, MapPin, Wine, Store, FileCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';

interface UploadedFiles {
  license?: File;
  id?: File;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const categories = ['Drinks', 'Cigarette', 'Soft Drinks', 'Snacks', 'Glasses & Plates'];
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [vendorId, setVendorId] = useState<string>('');

  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  useEffect(() => {
    if (!vendorId) return;
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`https://vendor.peghouse.in/api/vendor/status/${vendorId}`);
        setVerificationStatus(res.data.verificationStatus);
      } catch (err) {
        console.error('Error fetching vendor status:', err);
      }
    };
    fetchStatus();
  }, [vendorId]);

  useEffect(() => {
    // Validate password as user types
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  }, [password]);

  const isPasswordValid = () => {
    return Object.values(passwordRequirements).every(req => req === true);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFileUpload = (type: keyof UploadedFiles) => (file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (step === 1) {
      if (!businessName || !businessEmail || !businessPhone || !password) {
        setErrors((prev: any) => ({
          ...prev,
          businessInfo: 'All business fields are required.'
        }));
        return;
      }
      if (!/^\d{10}$/.test(businessPhone)) {
        setErrors((prev: any) => ({
          ...prev,
          businessPhone: 'Business phone number must be exactly 10 digits.'
        }));
        return;
      }
      
      if (!isPasswordValid()) {
        setErrors((prev: any) => ({
          ...prev,
          password: 'Password does not meet the requirements.'
        }));
        return;
      }
  
      setErrors({});
      setStep(step + 1);
      return;
    }
  
    if (step === 2) {
      if (!uploadedFiles.license) {
        setErrors((prev: any) => ({
          ...prev,
          documentUpload: 'Shop License is required to proceed.'
        }));
        return; // ❗ This return stops further step change
      }
    
      // Double-check that the uploaded license is a valid File object
      if (!(uploadedFiles.license instanceof File)) {
        setErrors((prev: any) => ({
          ...prev,
          documentUpload: 'Invalid license file. Please re-upload.'
        }));
        return;
      }
    
      setErrors({});
      setStep(3); // ✅ Explicitly go to Step 3
      return;
    }
    
    
  
    if (step === 3) {
      if (!location.addressLine1 || !location.city || !location.state || !location.postalCode) {
        setErrors((prev: any) => ({
          ...prev,
          locationInfo: 'All location fields are required.'
        }));
        return;
      }
      setErrors({});
      setStep(step + 1);
      return;
    }
  
    if (step === 4) {
      // 🚀 Just move to Step 5 without API call yet
      setStep(5);
      return;
    }
  
    if (step === 5 && !vendorId) {
  const registrationData = {
    businessName,
    businessEmail,
    businessPhone,
    password,
    location,
    productCategories: selectedCategories,
  };

  try {
    const res = await axios.post('https://vendor.peghouse.in/api/vendor/register', registrationData);
    setVendorId(res.data.vendorId);
    setVerificationStatus('pending');
    
    navigate('/login');
  } catch (error: any) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
  }

  return; // Prevent fallback setStep()
}

  };
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 relative">
            <h2 className="text-xl font-semibold">Business Information</h2>
            <Input label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter your business name" required />
            <Input label="Business Email" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="Enter your business email" required />
            <Input
              label="Business Phone"
              type="tel"
              value={businessPhone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setBusinessPhone(value);
                  setErrors((prev: any) => ({ ...prev, businessPhone: undefined }));
                }
              }}
              placeholder="Enter your business phone"
              required
            />
            {errors.businessPhone && <p className="text-red-500">{errors.businessPhone}</p>}
            <div className="relative">
              <Input
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <p className="font-medium text-gray-700">Password must contain:</p>
              <ul className="pl-4 space-y-1">
                <li className={passwordRequirements.length ? "text-green-600" : "text-red-500"}>
                  ✓ At least 8 characters
                </li>
                <li className={passwordRequirements.uppercase ? "text-green-600" : "text-red-500"}>
                  ✓ At least one uppercase letter (A-Z)
                </li>
                <li className={passwordRequirements.lowercase ? "text-green-600" : "text-red-500"}>
                  ✓ At least one lowercase letter (a-z)
                </li>
                <li className={passwordRequirements.special ? "text-green-600" : "text-red-500"}>
                  ✓ At least one special character (@, #, $, etc.)
                </li>
              </ul>
            </div>
            
            {errors.password && <p className="text-red-500">{errors.password}</p>}
            {errors.businessInfo && <p className="text-red-500">{errors.businessInfo}</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Document Upload</h2>
            <FileUpload label="Shop License" icon={<FileCheck className="w-12 h-12" />} accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('license')} description="" />
            {errors.documentUpload && <p className="text-red-500">{errors.documentUpload}</p>}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Address Line 1" value={location.addressLine1} onChange={(e) => setLocation({ ...location, addressLine1: e.target.value })} placeholder="Street address" required />
              <Input label="Address Line 2" value={location.addressLine2} onChange={(e) => setLocation({ ...location, addressLine2: e.target.value })} placeholder="Apartment, suite, etc." />
              <Input label="City" value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} placeholder="Enter city" required />
              <Input label="State" value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} placeholder="Enter state" required />
              <Input label="Postal Code" value={location.postalCode} onChange={(e) => setLocation({ ...location, postalCode: e.target.value })} placeholder="Enter postal code" required />
              <Button type="button" variant="secondary" icon={<MapPin className="w-5 h-5" />} className="mt-6">Use Current Location</Button>
            </div>
            {errors.locationInfo && <p className="text-red-500">{errors.locationInfo}</p>}
          </div>
        );
        case 4:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Product Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Verification Status</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800">Application Under Review</h3>
                <p className="text-sm text-yellow-600 mt-1">Our team is reviewing your application. This usually takes 1-2 business days.</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {verificationStatus}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Store className="w-12 h-12 mx-auto text-blue-600" />
            <h1 className="text-3xl font-bold mt-4">Vendor Registration</h1>
            <p className="text-gray-600 mt-2">Complete your profile to start selling</p>
          </div>

          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }} />
            {[1, 2, 3, 4, 5].map(stepNumber => (
              <div key={stepNumber} className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${step >= stepNumber ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                <span className="text-sm">{stepNumber}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between pt-6 border-t">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <div className="flex flex-col">
                <Button type="submit">
  {step === 5 && !vendorId ? 'Submit Registration' : step === 5 ? 'Waiting for Approval' : 'Continue'}
</Button>

                {step === 5 && verificationStatus !== 'verified' && (
                  <p className="text-sm text-red-600 mt-2">
                    Admin approval is required to proceed.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
