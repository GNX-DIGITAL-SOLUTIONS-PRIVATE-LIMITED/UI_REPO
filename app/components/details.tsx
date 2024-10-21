'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation'; // Using useSearchParams for accessing query parameters
import '../../styles/empstyles.css';

const EmployeeDetails: React.FC = () => {
  const searchParams = useSearchParams();


  // Retrieving parameters from searchParams
  const fname = searchParams.get('fname');
  const lname = searchParams.get('lname');
  const gender = searchParams.get('gender');
  const dob = searchParams.get('dob');
  const maritalStatus = searchParams.get('maritalStatus');
  const country = searchParams.get('country');
  const countryCode = searchParams.get('countryCode');
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const address = searchParams.get('address');
  const emergencyContact = searchParams.get('emergencyContact');
  const emergencyPhone = searchParams.get('emergencyPhone');
  const experience = JSON.parse(searchParams.get('experience') || '[]');
  const employmentType = searchParams.get('employmentType')?.split(',') || [];

  return (
    <div>
      <h1>Employee Details</h1>

      <h2>Basic Information</h2>
      <p><strong>First Name:</strong> {fname}</p>
      <p><strong>Last Name:</strong> {lname}</p>
      <p><strong>Gender:</strong> {gender}</p>
      <p><strong>Date of Birth:</strong> {dob}</p>
      <p><strong>Marital Status:</strong> {maritalStatus}</p>

      <h2>Contact Information</h2>
      <p><strong>Country:</strong> {country}</p>
      <p><strong>Country Code:</strong> {countryCode}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Address:</strong> {address}</p>

      <h2>Emergency Contact</h2>
      <p><strong>Emergency Contact Name:</strong> {emergencyContact}</p>
      <p><strong>Emergency Phone:</strong> {emergencyPhone}</p>

      <h2>Experience</h2>
      {experience.length > 0 ? (
        experience.map((exp: { company: string; position: string; duration: string }, index: number) => (
          <div key={index}>
            <p><strong>Company:</strong> {exp.company}</p>
            <p><strong>Position:</strong> {exp.position}</p>
            <p><strong>Duration:</strong> {exp.duration}</p>
          </div>
        ))
      ) : (
        <p>No experience data available.</p>
      )}

      <h2>Employment Type</h2>
      <p>{employmentType.length > 0 ? employmentType.join(', ') : 'No employment type available.'}</p>
    </div>
  );
};

export default EmployeeDetails;
