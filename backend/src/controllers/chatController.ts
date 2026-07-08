import { Request, Response } from 'express';
import { ChatService } from '../services/chat/ChatService';

export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { question } = req.body;
        
        if (!question) {
             res.status(400).json({ success: false, error: 'Question is required in the request body.' });
             return;
        }

        await ChatService.handleChatStream(question, res);
    } catch (error: any) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Internal Server Error' })}\n\n`);
            res.end();
        }
    }
};
