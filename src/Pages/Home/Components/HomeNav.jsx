import React from 'react'
import Button from '../../../components/ui/Button';
import { useState } from "react";
import { Search, User, ShoppingCart, ChevronDown } from "lucide-react";

const HomeNav = () => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);

    return (
        <div>
            <nav className="w-full  bg-background">
                <div className="content mx-auto ">
                    <div className="flex items-center  justify-between ">
                        {/* Left spacing */}
                        <div className="flex-1" />

                        {/* Center - Logo and Navigation */}
                        <div className="flex items-center mt-6 flex-col gap-6">
                            {/* Logo */}
                            <div className="flex items-center">
                                <img
                                    src="/roseate.svg"
                                    alt="Roseate"
                                    className="h-[87px] w-auto"
                                />
                            </div>

                            {/* Navigation Links */}
                            <div className="flex items-center gap-8">
                                <a
                                    href="/"
                                    className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                                >
                                    HOME
                                </a>

                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsProductsOpen(true)}
                                    onMouseLeave={() => setIsProductsOpen(false)}
                                >
                                    <button
                                        className="flex items-center gap-1 text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                                    >
                                        PRODUCTS
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {isProductsOpen && (
                                        <div className="absolute top-full left-0 mt-0.5 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                                            <a href="/products/category1" className="block px-4 py-2 text-body hover:bg-muted transition-colors">
                                                Category 1
                                            </a>
                                            <a href="/products/category2" className="block px-4 py-2 text-body hover:bg-muted transition-colors">
                                                Category 2
                                            </a>
                                            <a href="/products/category3" className="block px-4 py-2 text-body hover:bg-muted transition-colors">
                                                Category 3
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href="/our-story"
                                    className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                                >
                                    OUR STORY
                                </a>
                            </div>
                        </div>

                        {/* Right - Icons */}
                        <div className="flex-1 flex items-start justify-end gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-brand-500 hover:text-brand-600 hover:bg-transparent"
                            >
                                <Search className='text-brand-500'  />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-brand-500 hover:text-brand-600 hover:bg-transparent"
                            >
                                <User  className='text-brand-500' />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative text-brand-500 hover:text-brand-600 hover:bg-transparent"
                            >
                                <ShoppingCart  className='text-brand-500'/>
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center font-medium">
                                    2
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default HomeNav
