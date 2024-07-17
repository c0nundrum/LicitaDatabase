import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db("mydatabase");
  const collection = db.collection("editals");

  const oportunidades = await collection.countDocuments();
  return NextResponse.json(oportunidades);
}
