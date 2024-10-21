'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Using useSearchParams for accessing query parameters
import '../../styles/empstyles.css';
import { useRouter } from 'next/navigation';

interface ExperienceEntry {
  company: string;
  position: string;
  duration: string;
}

interface FormData {
  fname: string;
  lname: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  countryCode: string;
  country: string;
  employmentType: string[];
  education: string[];
  experience: ExperienceEntry[];
  image: File | null; 
  signature: File | null;
  documents: File | null; // This should be an array
  files?: Record<string, string>; // Added to store uploaded files as Base64 strings
}




const EmployeeDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);


  /*useEffect(() => {
    // Retrieve form data from sessionStorage
    const storedFormData = sessionStorage.getItem('formState');
    if (storedFormData) {
      try {
        const parsedData = JSON.parse(storedFormData);
        
        // Check if experience is an array; if not, set to an empty array
        if (!Array.isArray(parsedData.experience)) {
          console.error('Experience data is not an array:', parsedData.experience);
          parsedData.experience = []; // Default to an empty array
        }
        
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data from sessionStorage:', error);
      }
    }
  }, []);*/

 
 
  useEffect(() => {
    const searchParamsObj: Record<string, string | null> = {};
    searchParams.forEach((value, key) => {
      searchParamsObj[key] = value;
    });
  
    try {
      const experienceString = searchParamsObj['experience'];
      let experienceArray: ExperienceEntry[] = [];
  
      if (experienceString) {
        // Debug log to see the value
        console.log('Experience String:', experienceString);
        
        // Check if the experience string is a valid JSON format
        if (experienceString.trim() === '"No Experience"') {
          // Handle the case of "No Experience"
          console.log('No Experience provided, setting experienceArray to empty.');
          experienceArray = []; // Treat "No Experience" as an empty array
        } else {
          // Try parsing experienceString
          try {
            experienceArray = JSON.parse(decodeURIComponent(experienceString));
            console.log('Parsed Experience Array:', experienceArray);
          } catch (parseError) {
            console.error('Error parsing experience:', parseError);
            experienceArray = []; // Fallback to empty array if parsing fails
          }
        }
      }
  
      const sessionData = sessionStorage.getItem('formState');
      let files: Record<string, string> | undefined;
  
      if (sessionData) {
        try {
          const parsedSessionData: FormData = JSON.parse(sessionData);
          files = parsedSessionData.files || undefined; // Ensure files is assigned properly
        } catch (sessionError) {
          console.error('Error parsing session data:', sessionError);
          files = undefined; // Fallback in case of parsing error
        }
      }
  
      const parsedData: FormData = {
        fname: searchParamsObj['fname'] || '',
        lname: searchParamsObj['lname'] || '',
        gender: searchParamsObj['gender'] || '',
        dob: searchParamsObj['dob'] || '',
        maritalStatus: searchParamsObj['maritalStatus'] || '',
        phone: searchParamsObj['phone'] || '',
        email: searchParamsObj['email'] || '',
        address: searchParamsObj['address'] || '',
        emergencyContact: searchParamsObj['emergencyContact'] || '',
        emergencyPhone: searchParamsObj['emergencyPhone'] || '',
        countryCode: searchParamsObj['countryCode'] || '',
        country: searchParamsObj['country'] || '',
        employmentType: searchParamsObj['employmentType']
          ? searchParamsObj['employmentType'].split(',')
          : [],
        education: searchParamsObj['education']
          ? searchParamsObj['education'].split(',')
          : [],
        experience: experienceArray,
        image: null,
        signature: null,
        documents: null,
        files: files,
      };
  
      console.log('Parsed Data:', parsedData);
      setFormData(parsedData);
    } catch (error) {
      console.error('Error parsing query parameters:', error);
    }
  }, [searchParams]);
  
  
  


  const handleEdit = () => {
    console.log('Edit button clicked'); 
    // Ensure form data is saved in sessionStorage so it can be used on the registration page
    if (formData) {
      sessionStorage.setItem('formState', JSON.stringify(formData));
    }
    
    // Navigate back to the registration page
    router.push('/registration'); // Adjust the path based on your actual registration page route
  };

  // Check if form data is available
  if (!formData) {
    return <p>Loading...</p>; // Optionally, show a loading indicator
  }

  const {
    fname,
    lname,
    gender,
    dob,
    maritalStatus,
    phone,
    email,
    address,
    emergencyContact,
    emergencyPhone,
    countryCode,
    country,
    employmentType,
    education,
    experience, // Removed the default empty array as we are checking later
    files,
  } = formData;

  


  return (
    <div className="form-container">
      <h1>Employee Details</h1>
      <button className="edit-button" onClick={handleEdit}>
        Edit
      </button>
      <section>
        <h2 className="section-title">Basic Information</h2>
        <div className="form-group">
          <p><strong>Name:</strong> {fname} {lname}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Date of Birth:</strong> {dob}</p>
          <p><strong>Marital Status:</strong> {maritalStatus}</p>
        </div>
      </section>

      {/* Education Section */}
      <section>
        <h2 className="section-title">Educational Qualification:</h2>
        {education.length > 0 ? (
          <ul>
            {education.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
        ) : (
          <p>No education information provided.</p>
        )}
      </section>

      {/* Employment Types Section */}
      <section>
        <h2 className="section-title">Employment Type:</h2>
        {employmentType.length > 0 ? (
          <ul>
            {employmentType.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        ) : (
          <p>No employment type selected.</p>
        )}
      </section>

      <section>
        <h2 className="section-title">Contact Information</h2>
        <div className="form-group">
          <p><strong>Phone:</strong> {countryCode} {phone}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Emergency Contact Person:</strong> {emergencyContact}</p>
          <p><strong>Contact No:</strong> {emergencyPhone}</p>
        </div>
      </section>

      <section>
        <h2 className="section-title">Experience</h2>
        {Array.isArray(experience) && experience.length > 0 ? ( // Ensure experience is an array
          <table className="experience-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {experience.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.company}</td>
                  <td>{exp.position}</td>
                  <td>{exp.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No experience data available.</p>
        )}
      </section>

      {/* Files Section */}
      <section>
  <h2 className="section-title">Uploaded Files</h2>
  {files && Object.keys(files).length > 0 ? (
    <div className="uploaded-files" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      {Object.entries(files).map(([fileName, base64String], index) => {
        console.log('Processing file:', fileName); // Log the file being processed
        console.log('Base64 String:', base64String);
        const fileType = fileName.split('.').pop()?.toLowerCase(); // Extract the file extension

        return (
          <div key={fileName} className="file-item" style={{ marginRight: '20px', textAlign: 'center' }}>
            {index === 0 && <h3>Photo</h3>}
            {index === 1 && <h3>Signature</h3>}
            {index === 2 && <h3>Documents</h3>}
            {fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' ? (
              <img
                src={base64String}
                alt={fileName}
                style={{ maxWidth: '100px', height: 'auto' }} // Adjust image size
              />
            ) : fileType === 'pdf' ? (
              <embed
                src={base64String}
                type="application/pdf"
                style={{ width: '100%', height: '150px' }} // Adjust PDF size
              />
            ) : (
              <p>{fileName}: Unsupported file type</p>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p>No files uploaded.</p>
  )}
</section>

        
    </div>
  );
};

export default EmployeeDetails;
