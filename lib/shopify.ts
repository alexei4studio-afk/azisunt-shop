const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const API_VERSION = '2024-01';

export async function shopifyFetch({ query, variables = {} }: { query: string, variables?: any }) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return {
      status: 500,
      body: { errors: [{ message: 'Error fetching from Shopify' }] },
    };
  }
}

export async function getAllProducts() {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            vendor
            productType
            status
            variants(first: 1) {
              edges {
                node {
                  price
                }
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                }
              }
            }
            metafield(namespace: "custom", key: "link_temu") {
              value
            }
          }
        }
      }
    }
  `;

  const { body } = await shopifyFetch({ query });
  
  if (body.errors) {
    console.error(body.errors);
    return [];
  }

  return body.data.products.edges.map(({ node }: any) => ({
    id: node.id,
    slug: node.handle,
    name: node.title,
    price: parseFloat(node.variants.edges[0]?.node.price || '0'),
    category: node.productType.toLowerCase(),
    description: node.descriptionHtml,
    images: node.images.edges.map(({ node: img }: any) => img.url),
    inStock: node.status === 'ACTIVE',
    affiliateUrl: node.metafield?.value || '#'
  }));
}
