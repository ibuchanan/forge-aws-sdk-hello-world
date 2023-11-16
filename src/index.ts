export function listener(req: any) {
  try {
    const body = JSON.parse(req.body);
    console.log(body);
    return s3lifecycle(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const invalidJson = {
        type: "about:blank",
        title: "Invalid request",
        detail: "The request must be valid JSON",
      }
      return {
        body: JSON.stringify(invalidJson),
        headers: { "Content-Type": ["application/problem+json"] },
        statusCode: 400,
        statusText: "Bad Request",
      }
    } else {
      return {
        body: error + "\n",
        headers: { "Content-Type": ["application/json"] },
        statusCode: 400,
        statusText: "Bad Request",
      }  
    }
  }
};
