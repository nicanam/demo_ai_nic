import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  try {
    // Get API key from environment variable
    const ANAM_API_KEY = process.env.ANAM_API_KEY;

    if (!ANAM_API_KEY) {
      console.error("Missing ANAM_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error - missing API key" },
        { status: 500 }
      );
    }

    if (!id) {
      console.error("Missing persona ID in request");
      return NextResponse.json(
        { error: "Missing persona ID" },
        { status: 400 }
      );
    }

    // Create session token request to Anam API
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: {
          personaId: id,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e: unknown) {
        if (e instanceof Error) {
          errorData = { rawError: e.message };
        } else {
          errorData = { rawError: errorText };
        }
      }

      console.error("Anam API error:", errorData);

      return NextResponse.json(
        {
          error: "Failed to get Anam session token",
          details: errorData,
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.sessionToken) {
      console.error("Missing sessionToken in Anam API response:", data);
      return NextResponse.json(
        { error: "Invalid response from Anam API - missing sessionToken" },
        { status: 500 }
      );
    }

    console.log("Successfully obtained Anam AI session token for persona:", id);

    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Error getting Anam session token:", error);
    return NextResponse.json(
      {
        error: "Failed to get Anam session token",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 