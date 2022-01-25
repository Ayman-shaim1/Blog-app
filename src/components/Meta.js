import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords, image, url }) => {
  return (
    <Helmet>
      <title> {title}</title>
      <meta property="og:type" content="article" />
      <meta property="og:image:height" content="200" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image" content={image} />

      <meta
        property="og:description"
        content={
          description && description.length >= 30
            ? description.substring(0, 30) + "..."
            : description
        }
      />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
     

      <meta
        name="description"
        content={
          description && description.length >= 30
            ? description.substring(0, 30) + "..."
            : description
        }
      />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To E-Blog",
  description: "This is E-Blog web sites for latest news",
  keywords: "Blog, Blogs, News, latest news ",
  image: null,
  url: "https://blog-app-5dfc0.firebaseapp.com",
};

export default Meta;
