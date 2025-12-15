import React from "react";
import AntdCard from "antd/es/card";
import type { CardProps } from "antd/es/card";

const Card = (props: CardProps) => {
  return React.createElement(AntdCard as unknown as React.ElementType, props);
};

export default Card;
