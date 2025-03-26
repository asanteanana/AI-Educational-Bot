import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-white text-2xl font-bold">AI Educational Q&A</h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <a href="#" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="#" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">About</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 