import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get provider and tokens from request body
    const { provider, accessToken, refreshToken, providerAccountId } = await req.json();
    
    if (!provider || !providerAccountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Update the user record with the provider details
    if (provider === "github") {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          githubId: providerAccountId,
          githubToken: accessToken,
          githubRefreshToken: refreshToken,
        },
      });
      
      // Also create an Account entry to link the providers
      await db.account.create({
        data: {
          userId: session.user.id,
          type: "oauth",
          provider,
          providerAccountId,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: null,
        },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 