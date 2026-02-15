import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>
        {title
          ? `${title} | Smart Institute`
          : "Smart Institute - Education ERP"}
      </title>
      <meta
        name="description"
        content={
          description ||
          "Leading education management system for student success."
        }
      />
      <meta
        name="keywords"
        content={keywords || "education, erp, student management, institute"}
      />
    </Helmet>
  );
};

export default SEO;
