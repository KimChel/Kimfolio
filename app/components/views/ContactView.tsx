"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";

export type FormData = {
  fname: string;
  lname: string;
  email: string;
  message: string;
};

export default function ContactView(){
    const { register, handleSubmit, reset } = useForm<FormData>();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const sendEmail = async (data: FormData) => {
    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success')
        reset();
      } else {
        const errorData = await response.json
        console.error('API Error:', errorData);

      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('idle')
      alert(
        'An error occurred while sending the email. Please try again later.'
      )
    }

  }

  const StatusMessage = () => {
    switch (status) {
      case 'loading':
        return <p className="text-white animate-pulse">TRANSMITTING DATA...</p>;
      case 'success':
        return <p className="text-green-400">MESSAGE SENT: Your request has been logged and forwarded.</p>;
      case 'error':
        return <p className="text-red-400">ERROR: Failed to connect to server. Please try again later.</p>;
      default:
        return null;
    }
  };

  const isFormDisabled = status === 'loading' || status === 'success';

  const onSubmit = (data: FormData) => {
    sendEmail(data);
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-white p-2 overflow-hidden">
      <div className=" border-b-2 border-rose-500 flex justify-between items-end pb-2 ">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl bg-rose-500 px-2">CONTACT</h1>
          <span className="text-xs">
            {status === 'success' ? 'TRANSACTION COMPLETE' : 'CONNECTION_ESTABLISHED_SUCCESFULLY'}
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col font-mono text-rose-500 terminal-scroll-rose p-2 overflow-y-auto">

        <StatusMessage />

        {/* Hide form or show success message after successful submission */}
        {status !== 'success' && (
          <form id="contactForm" onSubmit={handleSubmit(onSubmit)} className={isFormDisabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="flex flex-row pb-3 justify-between">
              {/* ... (Your existing input fields) ... */}
              <div className="w-[45%]">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  className="w-full border border-rose-500 focus:border-rose-500 bg-transparent p-1"
                  {...register("fname", { required: true })}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="w-[45%]">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-rose-500 focus:border-rose-500 bg-transparent p-1"
                  {...register("lname", { required: true })}
                  disabled={isFormDisabled}
                />
              </div>
            </div>
            <div className="pb-3">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                className="w-full border border-rose-500 focus:border-rose-500 bg-transparent p-1"
                {...register("email", { required: true })}
                disabled={isFormDisabled}
              />
            </div>
            <div className="pb-3">
              <label htmlFor="message" className="text-base font-medium">Message</label>
              <textarea
                rows={4}
                placeholder="Type your message"
                className="w-full resize-none border border-rose-500 py-3 px-6 text-base font-medium outline-none focus:border-rose-500 bg-transparent"
                {...register("message", { required: true })}
                disabled={isFormDisabled}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full border border-rose-500 text-rose-500 py-2 mt-4 hover:bg-rose-500 hover:text-white transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFormDisabled}
              >
                {status === 'loading' ? 'Sending...' : 'Transmit Message'}
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="w-full flex flex-row justify-between align-center">
        <div className="w-[45%] border-t mt-4 border-rose-500"></div>
        <div className="w-[5%] text-rose-500 text-2xl">OR</div>
        <div className="w-[45%] border-t mt-4 border-rose-500"></div>
      </div>
    </div>
  );
}