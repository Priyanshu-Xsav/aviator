import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


// http://localhost:3000/api/bets
// body to post data

// {
//     "id": 1,
//     "betamount": 100.0
//   }


export async function POST(request: Request) {
    try {
      const { id, betamount } = await request.json();
  
      // Validate input
      if (id === undefined || betamount === undefined) {
        return NextResponse.json({ error: 'ID and betamount are required' }, { status: 400 });
      }
  
      // Check for existing bet with the same ID
      const existingBet = await prisma.bets.findUnique({
        where: { id },
      });
  
      if (existingBet) {
        return NextResponse.json({ error: 'Bet with this ID already exists' }, { status: 400 });
      }
  
      // Create a new bet
      const newBet = await prisma.bets.create({
        data: {
          id,
          betamount: parseFloat(betamount), // Ensure betamount is a float
        },
      });
  
      return NextResponse.json(newBet, { status: 201 });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return NextResponse.json({ error:  'Failed to create bet' }, { status: 500 });
    }
  }


// http://localhost:3000/api/bets
// body to post data 
// {
//     "id": 1,
//     "winamount": 50.0
// }

export async function PUT(request: Request) {
    try {
      const { id, winamount } = await request.json();
      if (!id || !winamount) {
        return NextResponse.json({ error: 'Year and content are required' }, { status: 400 });
      }
  
      const updatedBet = await prisma.bets.update({
        where: { id: parseInt(id) }, // Specify the ID of the bet to update
        data: {
          winamount: parseFloat(winamount) // Update winamount
        },
      });
      return NextResponse.json(updatedBet, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
}

