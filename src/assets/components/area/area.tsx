import './area.css';
import Message from '../message/message';
import { useEffect, useState } from 'react';

export default function Area() {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Conexión WebSocket abierta');
        };

        ws.onmessage = (event) => {
            console.log('Mensaje recibido:', event.data);
            setMessages(prev => [...prev, event.data]);
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
                {messages.map((message, index) => (
                    <Message key={index} user={message.user} contain={message.contain} />
                ))}
            </div>
        </div>
    )
}