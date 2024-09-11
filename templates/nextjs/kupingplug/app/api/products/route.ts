import products from "@/data/dummy.json";

export async function GET() {
  return Response.json(products);
}

export const runtime = "edge";
