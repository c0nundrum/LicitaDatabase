export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db("mydatabase");
  const collection = db.collection("editals");
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const filter: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(queryParams)) {
    filter[key] = !isNaN(value as any) ? Number(value) : value;
  }
  const oportunidades = await collection.find(filter).toArray();
  return NextResponse.json(oportunidades);
}
