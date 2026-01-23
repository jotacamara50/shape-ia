import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDatabase();

    return NextResponse.json({ 
      success: true, 
      message: "Database initialized successfully" 
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    
    // Retornar detalhes do erro para debug
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: "Failed to initialize database",
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
}
