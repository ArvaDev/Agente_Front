import './message.css';

type messageProps = {
    user: string;
    contain: string;
}

export default function Message({user, contain}: messageProps) {
    return (
        <div className='MessageClass' style={{ justifyContent: user === 'me' ? 'flex-end' : 'flex-start' }}>
            <div className={user === 'me' ? 'MessageMe' : 'MessageOther'}>
                { contain }
            </div>
        </div>
    )
}