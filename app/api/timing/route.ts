import { NextResponse } from 'next/server';
let timerValue: number = 0; // Starting value for the timer
let aviator: number = 1.00; // Starting value for aviator
const incrementStep: number = 0.01; // Step for increment
let upperRange: number = Math.random() * (2 - 1) + 1; // Random maximum limit between 1 and 2

console.log(`Random Maximum Limit: ${upperRange.toFixed(2)}`);

// Start server-side timer
const startTimer = () => {
    const timerIntervalId = setInterval(() => {
        timerValue += 1; // Increment the timer every second

        // When timer reaches 10, start incrementing aviator
        if (timerValue === 10) {
            clearInterval(timerIntervalId);
            startIncrementing();
        }
    }, 1000); // Timer updates every 1000 milliseconds (1 second)
};

// Function to start incrementing aviator
const startIncrementing = () => {
    console.log('Starting to increment aviator...');
    const incrementIntervalId = setInterval(() => {
        // Increment the aviator
        aviator += incrementStep;

        // Log the current value formatted to 2 decimal places
        console.log(`Aviator Value: ${aviator.toFixed(2)}`);

        // Check if we reached or exceeded the max limit
        if (aviator >= upperRange) {
            clearInterval(incrementIntervalId); // Stop the incrementing process
            console.log(`Reached the maximum limit of ${upperRange.toFixed(2)} for aviator.`);

            // Reset timer and aviator for the next cycle
            timerValue = 0;
            aviator = 1.00; // Reset aviator
            upperRange = Math.random() * (2 - 1) + 1; // Reset upperRange
            console.log(`Random Maximum Limit: ${upperRange.toFixed(2)}`); // Log new limit

            // Restart the timer after resetting
            startTimer();
        }
    }, 100); // Increment aviator every 100 milliseconds
};

// Start the timer
startTimer();

// Export the GET function for API response

// to get timervalue and avaitor percentage 
//  hit  this at 
// http://localhost:3000/api/timing
export async function GET() {
    try {
        return NextResponse.json({ timer: timerValue, aviator: aviator.toFixed(2)});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history records' }, { status: 500 });
    }
}
