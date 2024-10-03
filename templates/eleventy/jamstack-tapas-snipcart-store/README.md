# 11ty and Snipcart for eCommerce

## Deploy Your Own

Deploy your own Eleventy and Snipcart for eCommerce project with Azion.

[![Deploy Button](/static/button.png)](https://console.azion.com/create/azion-community/eleventy-snipcart-for-ecommerce "Deploy with Azion")


---

- [Snipcart](https://snipcart.com/) and [Snipcart for developers](https://snipcart.com/ecommerce-for-developers)
- Words great with Jamstack and without!
- Simple startup:
  - Sign up, get API key
  - Include some JavaScript
  - Encode product data using
    `data-*` attributes of HTML

```
<button class="snipcart-add-item" 
        data-item-id="123" 
        data-item-price="9.99" 
        data-item-description="Demo Time with Mike!  You can't not watch!  Just like a car race!"
        data-item-image="/assets/images/demotime.png" 
        data-item-name="Demo Time with Mike!">
    Add to cart
</button>
```

Check out `src/index.liquid` and `src/_data/products.json` as a good place to start seeing how Snipcart is easily implemented.

<img width="1639" alt="image" src="https://github.com/cscie114/jamstack-tapas-snipcart-store/assets/4117033/f8487499-8626-4861-ab89-610d42caabec">
