import React, { useState } from 'react'

interface Props {
    onJoin: (name: string) => void;
}

const JoinMeeting = (props: Props) => {
    const { onJoin } = props;
    const [name, setName] = useState<string>('');

    return (
        <div className='create-meeting'>
            <div className='form'>
                <h3>Hey {name ? name : 'There'}!</h3>
                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder='Enter Name'
                />
                <button onClick={() => {onJoin(name)}}>
                    Join Meeting
                </button>
            </div>
        </div>
    )
}

export default JoinMeeting;
