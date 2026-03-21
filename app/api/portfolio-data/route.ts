import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

const DB_NAME = 'portfolio';
const COLLECTION_NAME = 'portfolio_data';

interface PortfolioDataDoc {
  _id: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<PortfolioDataDoc>(COLLECTION_NAME);

    const data = await collection.findOne({ _id: 'portfolio_main' });
    if (!data) {
      return NextResponse.json({ success: true, data: null, source: 'none' });
    }

    const { _id, ...portfolioData } = data;
    return NextResponse.json({ success: true, data: portfolioData, source: 'mongodb' });
  } catch (error) {
    console.error('MongoDB portfolio data fetch error:', error);
    return NextResponse.json({ success: true, data: null, source: 'error' });
  }
}
