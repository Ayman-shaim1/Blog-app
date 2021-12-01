import React, { useRef, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
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
      <Link to={`/Admin/article/${article.id}`}>
        <div className="position-relative">
          <Card.Img src={article.image} />
          {article.status === "unpublished" ? (
            <Badge className="position-absolute bg-info iv-info-article">
              Not yet published
            </Badge>
          ) : article.status === "published" ? (
            <Badge className="position-absolute bg-success iv-info-article">
              published
            </Badge>
          ) : (
            <Badge className="position-absolute bg-danger iv-info-article">
              pending for review
            </Badge>
          )}
        </div>
      </Link>
      <Card.Body>
        <Card.Title as="h6">
          <strong dir="rtl" lang="ar">
            {article.title}
          </strong>
        </Card.Title>
        <Card.Text as="div" ref={articleContentRef}></Card.Text>
        <Card.Text>
          <Link to={`/Admin/article/${article.id}`}>view more</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Article;
