// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export const config = {
  runtime: "experimental-edge"
}


export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
