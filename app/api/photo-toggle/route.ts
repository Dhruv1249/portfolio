import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

const DB_NAME = 'portfolio';
const COLLECTION_NAME = 'settings';
const DOC_ID = 'photo_toggle';

interface SettingsDoc {
  _id: string;
  visible: boolean;
}

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection<SettingsDoc>(COLLECTION_NAME);
}

export async function GET() {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({ _id: DOC_ID });
    
    // Default to true if not found in DB
    if (!doc) {
      return NextResponse.json({ visible: true });
    }
    
    return NextResponse.json({ visible: doc.visible });
  } catch (error) {
    console.error('MongoDB GET Error:', error);
    return NextResponse.json({ visible: true });
  }
}

export async function POST() {
  try {
    const collection = await getCollection();
    
    // Find current state
    const doc = await collection.findOne({ _id: DOC_ID });
    const currentVisible = doc ? doc.visible : true;
    const newVisible = !currentVisible;
    
    // Upsert the new state
    await collection.updateOne(
      { _id: DOC_ID },
      { $set: { visible: newVisible } },
      { upsert: true }
    );
    
    return NextResponse.json({ visible: newVisible, success: true });
  } catch (error) {
    console.error('MongoDB POST Error:', error);
    return NextResponse.json({ error: 'Failed to toggle photo state', visible: true }, { status: 500 });
  }
}
