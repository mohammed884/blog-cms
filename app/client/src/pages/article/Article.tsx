import { useParams } from "react-router-dom";
const Article = () => {
  const params = useParams();
  console.log(params);
  return <div>Article</div>;
};

export default Article;
