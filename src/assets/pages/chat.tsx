import './chat.css';
import Area from '../components/area/area';
import Field from '../components/field/field';

export default function Chat() {
    return (
        <div className='ChatPage page'>
            <Area />
            <Field />
        </div>
    )
}