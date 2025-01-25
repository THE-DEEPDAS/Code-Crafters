import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import BaseLayout from "../Layouts/BaseLayout";

export default function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        recycledCups: "",
        dailyCupUsage: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const response = await api.post("/signup", formData);
            const { token, user } = response.data;
            
            // Store token and user data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            
            // Navigate to dashboard
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message || 
                "There was an error during sign up. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseLayout>
            <div className='max-w-lg mx-auto px-4 py-8'>
                <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleSubmit}>
                    <h1 className='text-3xl font-bold text-center mb-6'>Sign Up</h1>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
                            Username
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='username'
                            type='text'
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='email'
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='password'
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='recycledCups'>
                            Recycled Cups
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='recycledCups'
                            type='number'
                            name='recycledCups'
                            value={formData.recycledCups}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='dailyCupUsage'>
                            Daily Cup Usage
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='dailyCupUsage'
                            type='number'
                            name='dailyCupUsage'
                            value={formData.dailyCupUsage}
                            onChange={handleChange}
                        />
                    </div>
                    
                    {error && (
                        <div className="mb-4 text-red-500 text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className='flex items-center justify-between'>
                        <button
                            className='bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
}
