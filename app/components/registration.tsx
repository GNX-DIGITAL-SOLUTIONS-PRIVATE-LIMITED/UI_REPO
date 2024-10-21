'use client';// Indicate that this is a client-side component

//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react'; // Include useEffect here

import { useRouter } from 'next/navigation'; // Correct for App Router


import '../../styles/empstyles.css';

interface Experience {
  company: string;
  position: string;
  duration: string;
}

interface FilePreview {
  file: File;
  preview: string; // Base64 URL for the preview
}

interface FormData {
  fname: string;
  lname: string;
  gender: string;
  dob: string;
  employmentType: string[]; 
  phone: string;
  email: string;
  address: string;
  maritalStatus: string;
  emergencyContact: string;
  emergencyPhone: string;
  countryCode: string;
  country: string;
  education: string[];
  image: File | null; 
  signature: File | null;
  documents: File | null; 
  experience: Experience[]; 
}

const registration = () => {
      const router = useRouter();
      const [files, setFiles] = useState<Record<string, FilePreview>>({});
      const [fileErrors, setFileErrors] = useState({
         image: '',
        signature: '',
       documents: '',
       });

  
    const [formData, setFormData] = useState<{
    fname: string;
    lname: string;
    gender: string;
    dob: string;
    employmentType: string[]; // Assuming this is an array of strings
    phone: string;
    email: string;
    address: string;
    maritalStatus: string;
    emergencyContact: string;
    emergencyPhone: string;
    countryCode: string;
    country: string;
    education: string[]; // Array of strings for education
    image: File | null; 
    signature: File | null;
    documents:File | null;// Allowing for an image upload
    experience: Experience[]; // Use the Experience type
  }>({
    fname: '',
    lname: '',
    gender: '',
    dob: '',
    employmentType: [],
    phone: '',
    email: '',
    address: '',
    maritalStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    countryCode: '',
    country: '',
    education: [],
    image: null,
    signature:null,
    documents:null,
    experience: [{ company: '', position: '', duration: '' }],
  });

  const [formErrors, setFormErrors] = useState<{
    fname?: string;
    lname?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateName = (value: string, nameType: 'fname' | 'lname') => {
    let error = '';

    // Check if the field is empty
    if (!value) {
      error = `${nameType === 'fname' ? 'First' : 'Last'} name is required.`;
    } else if (/[^a-zA-Z\s]/.test(value)) {
      error = `${nameType === 'fname' ? 'First' : 'Last'} name must not contain numbers or special characters.`;
    }

    // Update the state with the error if there is one
    
    setFormErrors((prevErrors) => ({ ...prevErrors, [nameType]: error, [nameType === 'fname' ? 'lname' : 'fname']: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const serializedData = {
        ...formData,
        experience: showExperience ? JSON.stringify(formData.experience) : 'No Experience',
    };

    // Create a new object to hold only string values for URLSearchParams
    const queryParams: Record<string, string> = {
        fname: serializedData.fname,
        lname: serializedData.lname,
        gender: serializedData.gender,
        dob: serializedData.dob,
        maritalStatus: serializedData.maritalStatus,
        phone: serializedData.phone,
        email: serializedData.email,
        address: serializedData.address,
        emergencyContact: serializedData.emergencyContact,
        emergencyPhone: serializedData.emergencyPhone,
        countryCode: serializedData.countryCode, // Include countryCode
        country: serializedData.country, // Include country
        employmentType: serializedData.employmentType.length > 0
            ? serializedData.employmentType.join(',') // Convert to a comma-separated string
            : '',
        education: serializedData.education.length > 0
            ? serializedData.education.join(',') // Convert to a comma-separated string
            : '',
        experience: serializedData.experience, // Already a JSON string
    };
  
    // Handle file inputs
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
    const filesBase64: Record<string, string> = {};

    for (const input of fileInputs) {
        const fileInput = input as HTMLInputElement;
        if (fileInput.files) {
            for (const file of Array.from(fileInput.files)) {
                const base64String = await fileToBase64(file);
                filesBase64[file.name] = base64String; // Store Base64
                // Additionally, store the File object for URL.createObjectURL
                if (file.name === 'image') {
                    serializedData.image = file; // Save file reference
                } else if (file.name === 'signature') {
                    serializedData.signature = file; // Save file reference
                } else if (file.name === 'documents') {
                    serializedData.documents = file; // Save file reference
                }
            }
        }
    }

    sessionStorage.setItem('formState', JSON.stringify({ ...serializedData, files: filesBase64 }));

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/nwdetails?${queryString}`);
};

/*useEffect(() => {
  const storedData = sessionStorage.getItem('formState');
  if (storedData) {
    try {
      const parsedData: Partial<FormData> = JSON.parse(storedData);
      
      // Use optional chaining when accessing experience
      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        experience: Array.isArray(parsedData.experiences) 
          ? parsedData.experiences
          : prev.experience, // Fall back to previous experience
      }));
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
}, []);
 */
const [addExperience, setAddExperience] = useState<string>('no'); 
useEffect(() => {
  const storedData = sessionStorage.getItem('formState');
  if (storedData) {
    console.log("Raw storedData:", storedData);
    try {
      const parsedData: Partial<FormData> = JSON.parse(storedData);
      console.log("Parsed Data:", parsedData);
      // If experience data exists, set addExperience to 'yes'
      //console.log("Parsed Experiences:", parsedData.experience);
      if (Array.isArray(parsedData.experience)) {
        console.log("Parsed Experience Length:", parsedData.experience.length); // Log the length of experience array
      } else {
        console.log("Experience is not an array or does not exist.");
      }
      if (Array.isArray(parsedData.experience) && parsedData.experience.length > 0) {
        console.log("entered");
        setAddExperience('yes'); 
        setShowExperience(true); // Set dropdown value to "yes" if experience exists
      }

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        experience: Array.isArray(parsedData.experience) 
          ? parsedData.experience
          : prev.experience, // Fall back to previous experience
      }));
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
}, []);



  


  const validatePhone = (value: string) => {
    let error = '';
  
    // Regular expression to validate phone number in format '123-456-7890'
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  
    // Check if the field is empty
    if (!value) {
      error = 'Phone number is required.';
    } else if (!phoneRegex.test(value)) {
      error = 'Please enter a valid phone number in the format 123-456-7890.';
    }
  
    // Update the state with the error if there is one
    setFormErrors((prevErrors) => ({ ...prevErrors, phone: error, email: undefined }));
  };
  
 
  

  const countryOptions = [
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'India', code: '+91' },
    // Add more countries and codes as needed
  ];
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countryOptions.find(
      (country) => country.name === e.target.value
    );
  
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
      }));
    }
  };
  // Using optional chaining
  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target; // Change to name if your checkbox uses name
  
    setFormData((prev) => {
      const updatedEmploymentType = checked
        ? [...prev.employmentType, name] // Add name if checked
        : prev.employmentType.filter((type) => type !== name); // Remove name if unchecked
  
      return { ...prev, employmentType: updatedEmploymentType };
    });
  };
  
  
 
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      // Handle checkboxes specifically
      const newValue = checked ? value : ''; // Your logic for checkboxes
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === 'fname') {
      validateName(value, 'fname'); // Validate the first name
    } else if (name === 'lname') {
      validateName(value, 'lname'); // Validate the last name
    }
    else if (name === 'email') {
      validateEmail(value, 'email'); }
      else if (name === 'phone') {
        validatePhone(value); // Validate the phone number
      }
     else {
      // Clear error for other fields (optional)
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      const newEducation = checked
        ? [...prev.education, name]
        : prev.education.filter((edu) => edu !== name);

      return {
        ...prev,
        education: newEducation,
      };
    });
  };

  // Function to preview the file in a popup window
  const handlePreview = (filePreview: string, fileType: string) => {
    const popupWindow = window.open('', '_blank', 'width=600,height=400');
    
    // Prepare the content based on file type
    const content = fileType === 'pdf'
      ? `<embed src="${filePreview}" type="application/pdf" width="100%" height="100%">`
      : `<img src="${filePreview}" alt="File Preview" style="width:100%;height:auto;">`;

    // Inject the content into the popup window
    if (popupWindow) {
      popupWindow.document.write(`
        <html>
        <head><title>File Preview</title></head>
        <body style="margin:0;">${content}</body>
        </html>
      `);
    }
  };

  const validateEmail = (value: string, emailType: 'email') => {
    let error = '';
  
    // Check if the email field is empty
    if (!value) {
      error = 'Email is required.';
    } else {
      // Regular expression for validating email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      // Check if the email format is invalid
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address.';
      }
    }
  
    // Update the state with the error if there is one
    setFormErrors((prevErrors) => ({ ...prevErrors, [emailType]: error }));
  };

   // File validation function
const validateFile = (file: File | null, fileType: string) => {
  let error = '';

  if (!file) {
    error = `${fileType} is required.`;
  } else {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validPdfType = ['application/pdf'];

    if (fileType === 'image' && !validImageTypes.includes(file.type)) {
      error = 'Only JPEG, JPG, or PNG files are allowed for images.';
    }
    if (fileType === 'certificate' && !validPdfType.includes(file.type)) {
      error = 'Only PDF files are allowed for certificates.';
    }
  }

  return error;
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    console.log(files);
  
    let error = '';
    if (name === 'image') {
      error = validateFile(file, 'image');
    } else if (name === 'signature') {
      error = validateFile(file, 'image');  // Signature should follow image validation
    } else if (name === 'documents') {
      error = validateFile(file, 'documents');
    }
  
    // Set file and validation error
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  
    setFileErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (!error && file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert the file to a Base64 string
      reader.onloadend = () => {
        // Set file preview data
        setFiles((prevFiles) => ({
          ...prevFiles,
          [name]: {
            file,
            preview: reader.result as string, // The base64 preview string
          },
        }));
      };
    } else {
      // Clear the file entry by deleting the key if file is invalid
      setFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        delete updatedFiles[name]; // Remove key for the file with an error
        return updatedFiles;
      });
    }
    
  };
  const [showExperience, setShowExperience] = useState(false);

 /* const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setShowExperience(value === 'yes');
  };*/
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAddExperience(value); // Update addExperience state
    setShowExperience(value === 'yes'); // Show or hide experience fields based on the selection
  };

 

 
  return (
    <div>
      <h1>Employee Details Form</h1>
      <form onSubmit={handleSubmit}>
      <fieldset>
      <legend >Basic Details</legend>
     
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label>FirstName:</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          {/* Error message display */}
          {formErrors.fname && (
                <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.fname}</span>
              )}
          
        </div>
        
        <div style={{ flex: '1' }}>
          <label>LastName:</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
          />
          {formErrors.lname && (
                <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.lname}</span>
              )}
          
        </div>
        </div>
        <div>
  <label>Gender:</label>
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="gender"
        value="male"
        checked={formData.gender === 'male'}
        onChange={handleChange}
        required
      />
      Male
    </label>
    <label>
      <input
        type="radio"
        name="gender"
        value="female"
        checked={formData.gender === 'female'}
        onChange={handleChange}
        required
      />
      Female
    </label>
    <label>
      <input
        type="radio"
        name="gender"
        value="other"
        checked={formData.gender === 'other'}
        onChange={handleChange}
        required
      />
      Other
    </label>
  </div>
</div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
  <label>Marital Status:</label>
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="maritalStatus"
        value="single"
        checked={formData.maritalStatus === 'single'}
        onChange={handleChange} // Use the same handler
        required
      />
      Single
    </label>
    <label>
      <input
        type="radio"
        name="maritalStatus"
        value="married"
        checked={formData.maritalStatus === 'married'}
        onChange={handleChange} // Use the same handler
        required
      />
      Married
    </label>
    <label>
      <input
        type="radio"
        name="maritalStatus"
        value="divorced"
        checked={formData.maritalStatus === 'divorced'}
        onChange={handleChange} // Use the same handler
        required
      />
      Divorced
    </label>
  </div>
</div>

       </fieldset>
        <fieldset>
          <legend>Employment Type:</legend>
          <label>
          <input 
            type="checkbox"
            name="Full-time"
            checked={formData.employmentType.includes('Full-time')}
            onChange={handleEmploymentTypeChange}
             />
       Full-time
          </label>
          <label>
            <input
              type="checkbox"
              name="Part-time"
              checked={formData.employmentType.includes('Part-time')}
              onChange={handleEmploymentTypeChange}
            />
            part-time
          </label>
          <label>
            <input
              type="checkbox"
              name="Contract"
              checked={formData.employmentType.includes('Contract')}
              onChange={handleEmploymentTypeChange}
            />
            contract
          </label>
          
        </fieldset>
        {/* Country dropdown */}
        <fieldset>
        <legend>Contact Information</legend>  
        <div className="contact-section">
            

  <div className="phone-group">
    <div className="contact-row">
      <div className="country-dropdown">
        <label>Country:</label>
        <select value={formData.country} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          {countryOptions.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="country-code">
        <label>Country Code:</label>
        <input
          type="text"
          name="countryCode"
          value={formData.countryCode}
          readOnly
          className="country-code-input"
        />
      </div>

      <div className="phone-input">
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          placeholder="123-456-7890"
          value={formData.phone}
          onChange={handleChange}
          required
          className="phone-number-input"
        />
      </div>
      {formErrors.phone && (
                <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.phone}</span>
              )}
          
    </div>
  </div>

  <div>
    <label>Email:</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
    />
     {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
  </div>

  <div>
    <label>Address:</label>
    <textarea
      name="address"
      value={formData.address}
      onChange={handleChange}
      required
    />
  </div>
  
</div>
<div>
          <label>Emergency Contact Person:</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact No:</label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            required
          />
        </div>
 </fieldset>

       
        
        <fieldset>
          <legend>Educational Qualifications</legend>
          <label>
            <input
              type="checkbox"
              name="HighSchool"
              checked={formData.education.includes('HighSchool')}
              onChange={handleCheckboxChange}
            />
            High School
          </label>
          <label>
            <input
              type="checkbox"
              name="Bachelordegree"
              checked={formData.education.includes('Bachelordegree')}
              onChange={handleCheckboxChange}
            />
            Bachelor's Degree
          </label>
          <label>
            <input
              type="checkbox"
              name="Master"
              checked={formData.education.includes('Master')}
              onChange={handleCheckboxChange}
            />
            Master's Degree
          </label>
          <label>
            <input
              type="checkbox"
              name="phd"
              checked={formData.education.includes('phd')}
              onChange={handleCheckboxChange}
            />
            PhD
          </label>
        </fieldset>
        <fieldset>
  <legend>Work Experience</legend>
  <label>Do you Have Experience:</label>


  <select
      id="experienceDropdown"
      value={addExperience} // Bind the state to dropdown value
      onChange={handleDropdownChange} // Handle dropdown changes
    >
    <option value="no">No</option>
    <option value="yes">Yes</option>
  </select>
  {showExperience && (
  <fieldset>
  <legend> Experience</legend>
 

  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Position</th>
        <th>Duration</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {formData.experience.map((exp, index) => (
        <tr key={index}>
          <td>
            <input
              type="text"
              name={`company-${index}`}
              value={exp.company}
              onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].company = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  experience: updatedExperience,
                }));
              }}
              required
            />
          </td>
          <td>
            <input
              type="text"
              name={`position-${index}`}
              value={exp.position}
              onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].position = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  experience: updatedExperience,
                }));
              }}
              required
            />
          </td>
          <td>
            <input
              type="text"
              name={`duration-${index}`}
              value={exp.duration}
              onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].duration = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  experience: updatedExperience,
                }));
              }}
              required
            />
          </td>
          <td>
            <button
              type="button"
              onClick={() => {
                const updatedExperience = formData.experience.filter((_, i) => i !== index);
                setFormData((prev) => ({
                  ...prev,
                  experience: updatedExperience,
                }));
              }}
            >
              -
            </button>
            <button
    type="button"
    onClick={() => {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, { company: '', position: '', duration: '' }],
      }));
    }}
  >
    +
  </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </fieldset>
  )}
</fieldset>
     
       
  

        <div>
        <fieldset>
        <legend>Upload Documents</legend>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ marginRight: '20px' }}>
            <label>Photo:</label>
            <input
              type="file"
              name="image"
              id="empPic"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {fileErrors.image && <span style={{ color: 'red' }}>{fileErrors.image}</span>}
            {files.image && (
               <img
               src="/eye.png"
               alt="View"
               style={{ width: '20px', height: '20px', cursor: 'pointer' }}
               onClick={() => handlePreview(files.image.preview, 'image')}
             />
            )}
          </div>
          <div style={{ marginRight: '20px' }}>
            <label>Signature:</label>
            <input
              type="file"
              name="signature"
              id="signature"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {fileErrors.signature && <span style={{ color: 'red' }}>{fileErrors.signature}</span>}
            {files.signature && (
              <img
              src="/eye.png"
              alt="View"
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => handlePreview(files.image.preview, 'image')}
            />
              
            )}
          </div>
          <div>
            <label>Documents:</label>
            <input
              type="file"
              name="certificate"
              id="certificate"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            {fileErrors.documents && <span style={{ color: 'red' }}>{fileErrors.documents}</span>}
            {files.certificate && (
              <img
              src="/eye.png"
              alt="View"
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => handlePreview(files.image.preview, 'image')}
            />
            )}
          </div>
        </div>
      </fieldset>
       

        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};


export default registration;
