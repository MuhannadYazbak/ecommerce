'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';
import { useEffect } from 'react';
import Image from 'next/image';

export default function AdminByFullName() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);


    if (!user || user.role !== 'admin') {
        return <p className="text-red-600">⛔ Access denied. Admins only.</p>;
    }

    return (
        <main className="container p-6">
            <header className='flex w-full justify-center' id='new item heading'>
                <h1 className="text-2xl font-bold mb-4" aria-label='new item heading'>Admin - by FullName Dashboard</h1>
            </header>
            <section id='visuals' className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4'>
                <article id='1' className='w-full h-[650px] border-black border-solid border-2 rounded-md'>
                    <div className='tableauPlaceholder' id='viz1757416662307' style={{ position: 'relative' }}><noscript><a href='#'><img alt='Total Orders by Fullname ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;TotalOrdersbyFullname&#47;1_rss.png' style={{ border: 'none' }} /></a></noscript><object className='tableauViz' style={{ width: '100%', height: '650px', display: 'block' }}><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='techmart&#47;TotalOrdersbyFullname' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;TotalOrdersbyFullname&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1757416662307');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*1.25)+'px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
                </article>
                <article id='2' className='w-full h-[650px] border-black border-solid border-2 rounded-md'>
                    <div className='tableauPlaceholder' id='viz1757416914587' style={{ position: 'relative' }}><noscript><a href='#'><img alt='In Cart products by Fullname ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;InCartproductsbyFullname&#47;1_rss.png' style={{ border: 'none' }} /></a></noscript><object className='tableauViz' style={{ width: '100%', height: '650px', display: 'block' }}><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='techmart&#47;InCartproductsbyFullname' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;InCartproductsbyFullname&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1757416914587');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*1.25)+'px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
                </article>
                <article id='3' className='w-full h-[650px] border-black border-solid border-2 rounded-md'>
                    <div className='tableauPlaceholder' id='viz1757417003655' style={{ position: 'relative' }}><noscript><a href='#'><img alt='Total Orders by Date ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;TotalOrdersbyDate&#47;1_rss.png' style={{ border: 'none' }} /></a></noscript><object className='tableauViz' style={{ width: '100%', height: '650px', display: 'block' }}><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='techmart&#47;TotalOrdersbyDate' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;TotalOrdersbyDate&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1757417003655');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*1.25)+'px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
                </article>
                <article id='4' className='w-full h-[650px] border-black border-solid border-2 rounded-md'>
                     <figcaption className="aspect-[16/9] overflow-hidden">
                                   <Image
                                     width={600}
                                     height={400}
                                     loading='lazy'
                                     src={'/images/totalSalesGauge.png'}
                                     alt={''}
                                     className="mx-auto"
                                   />
                     
                                 </figcaption>   
                    </article>
                <article id='5' className='w-full h-[650px] border-black border-solid border-2 rounded-md'>
                    <div className='tableauPlaceholder' id='viz1757417119821' style={{ position: 'relative' }}><noscript><a href='#'><img alt='Count DateOfBirth by year,month and fullname ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;CountDateOfBirthbyyearmonthandfullname&#47;1_rss.png' style={{ border: 'none' }} /></a></noscript><object className='tableauViz' style={{ width: '100%', height: '650px', display: 'block' }}><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='techmart&#47;CountDateOfBirthbyyearmonthandfullname' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;te&#47;techmart&#47;CountDateOfBirthbyyearmonthandfullname&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1757417119821');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*1.25)+'px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
                </article>
            </section>
            <nav className='flex p-2 content-center justify-center'>
                <BackButton />
            </nav>
        </main>
    );
}