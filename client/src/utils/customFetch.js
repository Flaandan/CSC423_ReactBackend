class HttpError extends Error {
  response;

  constructor(response) {
    super(`HTTP Error: ${response.status} ${response.statusText}`);
    this.response = response;
  }

  async getErrorMessage() {
    try {
      const errorBody = await this.response.json();
      return errorBody.error || this.response.statusText || "an error occurred";
    } catch {
      const text = await this.response.text();
      return text || this.response.statusText || "an error occurred";
    }
  }
}

export async function customFetch(params) {
  const { url, method, jwt, requestBody } = params;

  const fetchOptions = {
    method: method.toUpperCase(),
  };

  if (jwt) {
    fetchOptions.headers = {
      Authorization: `Bearer ${jwt}`,
    };
  }

  if (requestBody) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}), // Preserve existing headers
    };
    fetchOptions.body = JSON.stringify(requestBody);
  }
  console.log(fetchOptions);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      // Sets timeout for each fetch call
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new HttpError(response);
    }

    const contentLength = response.headers.get("content-length");

    // Check if the response contains a body
    if (contentLength && contentLength !== "0") {
      try {
        const responseBody = await response.json();
        return responseBody;
      } catch {
        return { error: "failed to parse JSON response" };
      }
    } else {
      return response.json();
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("request timed-out");
    }

    if (err instanceof HttpError) {
      const errorMessage = await err.getErrorMessage();
      return { error: errorMessage };
    }

    if (err instanceof Error) {
      return { error: err.message };
    }

    return { error: "server error occurred" };
  }
}
