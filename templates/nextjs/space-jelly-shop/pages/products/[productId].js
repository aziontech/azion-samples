import Head from "next/head";
import styles from "../../styles/Product.module.css";
import products from "../../products.json";
import { useCart } from "../../hooks/useCart";

const Product = ({ product }) => {
  const { id, title, description, image, price } = product;

  const { addToCart } = useCart();

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} - Space Jelly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.productImage}>
          <img src={image} alt={title} />
        </div>

        <div>
          <h1>{title}</h1>

          <p className={styles.description}>{description}</p>

          <p className={styles.description}>${price.toFixed(2)}</p>

          <p>
            <button className={styles.button} onClick={() => addToCart({ id })}>
              Buy
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Product;

export const getStaticProps = async ({ params }) => {
  const product = products.find((product) => product.id === params.productId);
  return {
    props: {
      product,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = products.map((product) => ({
    params: { productId: product.id },
  }));

  return {
    paths,
    fallback: false,
  };
};
