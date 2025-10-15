import React from 'react'
import { usePage } from '../../hooks/useProducts'
import PolicyPageTitle from '../../components/PolicyPageTitle';

const PrivacyPolicy = () => {
    const { data: page, isLoading, error } = usePage("privacy-policies");
    console.log(page)


    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-500 text-sm">Loading Privacy Policy page...</p>
            </div>
        );

    if (error) return <p>Error: {error.message}</p>;
    if (!page) return <p>Page not found.</p>;
    return (
        <article className="mb-10">
            <PolicyPageTitle title={page.title} />
            <div className="content" dangerouslySetInnerHTML={{ __html: page.body }} />
            <p className="updated content">Last updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
        </article>
    )
}

export default PrivacyPolicy
