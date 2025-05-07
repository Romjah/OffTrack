import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    // TODO: Récupérer les données depuis le store ou la base de données
    const data = {
        currentActivity: null,
        dailyStats: {
            totalTime: 0,
            activities: []
        },
        weeklyStats: {
            totalTime: 0,
            activities: []
        }
    };

    return json(data, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    
    // TODO: Traiter les données reçues de FocusFlow
    // Par exemple, mettre à jour les statistiques ou les activités

    return json({ success: true }, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
}; 