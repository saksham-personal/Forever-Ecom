import React, { FC } from 'react';

const Newsletter: FC = () => {

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe Now & get 20% OFF</p>
            <p className='text-gray-400 mt-3'>Dummy</p>

            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input className="w-full sm:flex-1 outline-none" type="email" placeholder='Enter your E-mail' />
                <button type='submit' className='bg-black text-white text-s px-10 py-4'>Subscribe</button>
            </form>

        </div>
    )
}

export default Newsletter;