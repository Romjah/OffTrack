import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';

const DATA_FILE = 'offtrack_sync_data.json';

function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        return {};
    }
}
function writeData(data: any) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const GET: RequestHandler = async ({ url }) => {
    const email = url.searchParams.get('email');
    if (!email) {
        return json({ error: 'Missing email' }, { status: 400 });
    }
    const data = readData();
    const userData = data[email] || {
        currentActivity: null,
        dailyStats: { totalTime: 0, activities: [] },
        weeklyStats: { totalTime: 0, activities: [] }
    };
    return json(userData, {
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { email, payload } = body;
    if (!email) {
        return json({ error: 'Missing email' }, { status: 400 });
    }
    const data = readData();
    data[email] = payload;
    writeData(data);
    return json({ success: true }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
}; 