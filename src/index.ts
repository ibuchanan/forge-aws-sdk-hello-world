import s3lifecycle from "./aws";

export function listener(req: any) {
  try {
    const body = JSON.parse(req.body);
    console.log(body);
    s3lifecycle(req);
    return {
      body: '{"hello": "world"}',
      headers: { "Content-Type": ["application/json"] },
      statusCode: 200,
      statusText: "OK",
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const invalidJson = {
        type: "about:blank",
        title: "Invalid request",
        detail: "The request must be valid JSON",
      };
      return {
        body: JSON.stringify(invalidJson),
        headers: { "Content-Type": ["application/problem+json"] },
        statusCode: 400,
        statusText: "Bad Request",
      };
    } else {
      return {
        body: error + "\n",
        headers: { "Content-Type": ["application/json"] },
        statusCode: 400,
        statusText: "Bad Request",
      };
    }
  }
}
