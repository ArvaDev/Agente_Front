import './field.css';
import { IoIosSend } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';

export default function Field() {
    const { register, handleSubmit, watch, reset } = useForm();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('✅ WebSocket conectado');
        };

        socket.onerror = (error) => {
            console.error('❌ Error WebSocket', error);
        };

        socket.onclose = () => {
            console.log('🔌 WebSocket desconectado');
        };

        return () => {
            socket.close();
        };
    }, []);

    const onSubmit = (data: any) => {
        const message = data.texto;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const mess = {user: 'me', contain: message};
            socketRef.current.send(JSON.stringify(mess));
            reset();
        } else {
            console.warn('⚠️ WebSocket no conectado. No se pudo enviar el mensaje.');
        }
    };

    return (
        <div className='FieldClass'>
            <form className='Field' onSubmit={handleSubmit(onSubmit)}>
                <textarea {...register('texto')} className='area' placeholder='Escribe tu mensaje...' />
                <button disabled={!watch('texto')}>
                    <IoIosSend className='icon'/>
                </button>
            </form>
        </div>
    );
}
