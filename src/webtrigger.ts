import { provisionForTenant, deprovisionForTenant } from "./aws/provision";

function buildResponse(message = "OK", statusCode = 200, statusText = "OK") {
  return {
    body: JSON.stringify({ message: message }),
    headers: { "Content-Type": ["application/json"] },
    statusCode: statusCode,
    statusText: statusText,
  };
}

export async function webtriggerProvision(req: any) {
  try {
    const body = JSON.parse(req.body);
    console.log(`Webtrigger request: ${JSON.stringify(body)}`);
    await provisionForTenant(body.cloudId);
    return buildResponse();
  } catch (error) {
    if (typeof error === "string") {
      return buildResponse(error, 400, "Bad Request");
    } else if (error instanceof Error) {
      return buildResponse(error.toString(), 400, "Bad Request");
    } else {
      return buildResponse("Unknown error", 400, "Bad Request");
    }
  }
}

export async function webtriggerDeprovision(req: any) {
  try {
    const body = JSON.parse(req.body);
    console.log(`Webtrigger request: ${JSON.stringify(body)}`);
    await deprovisionForTenant(body.cloudId);
    return buildResponse();
  } catch (error) {
    if (typeof error === "string") {
      return buildResponse(error, 400, "Bad Request");
    } else if (error instanceof Error) {
      return buildResponse(error.toString(), 400, "Bad Request");
    } else {
      return buildResponse("Unknown error", 400, "Bad Request");
    }
  }
}
