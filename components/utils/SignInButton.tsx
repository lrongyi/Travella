import { login } from '@/lib/auth-actions'
import React from 'react'

export default function SignInButton() {
  return (
    <button className='flex items-center justify-center bg-gray-700 hover:bg-gray-500 text-white p-2 rounded-xl cursor-pointer'
                    onClick={login}>
                        <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 533.5 544.3"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.4 34.7-25.6 64.1-54.6 83.5v69.3h88.4c51.7-47.7 80.8-118.1 80.8-197.8z"
                            fill="#4285F4"
                            />
                            <path
                            d="M272 544.3c73.6 0 135.3-24.3 180.4-65.9l-88.4-69.3c-24.6 16.5-56.3 26.2-92 26.2-70.7 0-130.6-47.8-152-111.9H28.7v70.2C73.2 474.7 166.4 544.3 272 544.3z"
                            fill="#34A853"
                            />
                            <path
                            d="M120 323.4c-10.6-31.6-10.6-65.4 0-97l-70.2-70.2C17.1 205.6 0 244.2 0 272.1c0 27.9 17.1 66.5 49.8 115.9L120 323.4z"
                            fill="#FBBC05"
                            />
                            <path
                            d="M272 107.7c39.9-.6 77.9 14 107.1 40.7l80.2-80.2C429.6 24.5 364.3 0 272 0 166.4 0 73.2 69.6 28.7 181.6l91.3 70.2C141.4 155.5 201.3 107.7 272 107.7z"
                            fill="#EA4335"
                            />
                        </svg>
                        
                        Sign In

                        
                    </button>
  )
}
