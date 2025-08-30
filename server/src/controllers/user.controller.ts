import type { Request, Response } from 'express';

export function getUser(req : Request , res : Response){
    res.json({
        "message": "User retrieved successfully"
    });
}


