import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON body
    const { email, password, name }: any = await req.json();

    // Basic input validation (more robust validation is recommended)
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Make the registration request to your external API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    } else {
      // Handle API errors more gracefully. Log the error for debugging.
      console.error("Registration API Error:", data); // Log the actual error from the backend.
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error("Registration Error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    ); // Generic error message for the client
  }
}
