import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="nf">
      <h1>Product Not Fonud</h1>
      <Link href={"/"}>Back Home</Link>
    </div>
  );
};

export default NotFound;
