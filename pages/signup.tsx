import React from "react";
import "./signup.css";
import Head from "next/head";
import Link from "next/link";

const Signup: React.FC = () => {
  return (
    <>
      <Head>
        <title>SIGN UP</title>
      </Head>

      <div className="signup-container">
        <h1 className="signup-heading">Welcome to Indian Railways</h1>

        <form className="signup-form">
          {/* Phone Number */}
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" name="phone" maxLength={15} required />

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          {/* Password */}
          <label htmlFor="password">New Password</label>
          <input type="password" id="password" name="password" required />

          {/* Full Name */}
          <label htmlFor="fullname">Full Name</label>
          <input type="text" id="fullname" name="fullname" required />

          {/* Date of Birth */}
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob" required />

          {/* Gender */}
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Address */}
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" rows={3} required></textarea>

          {/* Aadhaar Number */}
          <label htmlFor="aadhaar">Aadhaar Number</label>
          <input type="text" id="aadhaar" name="aadhaar" maxLength={12} required />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </>
  );
};

export default Signup;