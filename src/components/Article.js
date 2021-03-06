import React, { useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
const Article = ({ article }) => {
  const articleContentRef = useRef(null);
  useEffect(() => {
    let htmlTextContent =
      article.textContent.length > 300
        ? article.textContent.substring(0, 300) + "..."
        : article.textContent;
    articleContentRef.current.innerHTML = htmlTextContent;
  }, [article.textContent]);
  return (
    <Card className="h-100">
      <Link to={`/article/${article.id}`}>
        <Card.Img src={article.image} />
      </Link>
      <Card.Body>
        <Card.Title as="h6">
          <strong dir="rtl" lang="ar">
            {article.title}
          </strong>
        </Card.Title>
        <Card.Text as="div" ref={articleContentRef}></Card.Text>
        <Card.Text>
          <Link to={`/article/${article.id}`}>view more</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Article;
