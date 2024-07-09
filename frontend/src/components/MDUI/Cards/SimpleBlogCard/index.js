// Material Dashboard 2 React Examples
// SimpleBlogCard.js
import React from "react";
import PropTypes from "prop-types";
import SimpleBlogCard from "../../../examples/Cards/BlogCards/SimpleBlogCard";

function MySimpleBlogCard(props) {
  const { image, title, description, action } = props;

  return <SimpleBlogCard image={image} title={title} description={description} action={action} />;
}

MySimpleBlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default MySimpleBlogCard;
