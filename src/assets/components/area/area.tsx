import './area.css';
import Message from '../message/message';
import { useEffect, useState } from 'react';

interface Message {
    user: string;
    contain: string;
}

export default function Area() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');

        ws.onopen = () => {
            console.log('Conexión WebSocket abierta');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        };

        ws.onerror = (error) => {
            console.error('Error en WebSocket', error);
        };

        ws.onclose = () => {
            console.log('Conexión WebSocket cerrada');
        };

        return () => {
            ws.close();
        };
    }, []);


    return (
        <div className='AreaClass'>
            <div className='Area'>
                {messages.length > 0 ? messages.map((message, index) => (
                    <Message key={index} user={message.user} contain={message.contain} />
                ))
                : <h1>En que puedo ayudarte</h1>
            }
            </div>
        </div>
    )
}